import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { LendOrderData } from "./lend";
import { mergeObjects } from "../../components/GlobalFunctions";

let apiUrl = "";
if (process.env.NODE_ENV === "development") {
  apiUrl = "";
} else {
  apiUrl =
    process.env.REACT_APP_API_URL || "https://lendbook-api-bis.vercel.app"; //"https://api.lendbook.org";
}

export interface PoolIdWithPriceData {
  id: number;
  poolId: number;
  buyPrice: number;
  [key: string]: string | number;
}

export interface PoolData {
  id: number;
  //   poolId: number;
  //   buyPrice: number;
  //   deposits: number;
  //   lendingRate: number;
  //   borrowingRate: number;
  //   utilizationRate: number;
  //   borrows: number;
  //   availableSupply: number;
  [key: string]: string | number;
}

function calculatePricesForPools(
  startPrice: number,
  startId: number,
  marketPrice: number,
  step: number
): {
  poolIdWithPriceData: PoolIdWithPriceData[];
  closestPoolIdUnderPriceFeed: number;
} {
  let poolIdWithPriceData: PoolIdWithPriceData[] = [];
  let currentPrice = startPrice;
  let currentId = startId;

  let closestPoolIdUnderPriceFeed = 1111111110;

  // Determine the increment direction
  const isIncreasing = marketPrice > startPrice;
  const idStep = 2;

  // 5 = nombre de pool en dessous ou au dessus de endPrice
  const count = 10;
  const finalPrice = isIncreasing
    ? marketPrice * Math.pow(step, count)
    : marketPrice / Math.pow(step, count);

  // demarrage à partir de 5 en dessous du prix initial
  currentPrice = isIncreasing
    ? currentPrice / Math.pow(step, count)
    : currentPrice * Math.pow(step, count);
  currentId = isIncreasing ? currentId - 2 * count : currentId + 2 * count;

  let distPrice = 0;

  // Generate data
  while (
    (isIncreasing && currentPrice < finalPrice) ||
    (!isIncreasing && currentPrice > finalPrice)
  ) {
    //console.log(`create buy price ${currentPrice}`);

    poolIdWithPriceData.push({
      id: currentId,
      poolId: currentId,
      buyPrice: currentPrice,
    });

    if (isIncreasing) {
      if (currentPrice < marketPrice) {
        closestPoolIdUnderPriceFeed = currentId;
      }
      currentPrice *= step;
      currentId += idStep;
    } else {
      if (currentPrice > marketPrice) {
        closestPoolIdUnderPriceFeed = currentId - 2; //because we want the one under
      }
      currentPrice /= step;
      currentId -= idStep;
    }
  }

  // Add the final step if it has crossed the finalPrice
  if (
    (isIncreasing && currentPrice >= finalPrice) ||
    (!isIncreasing && currentPrice <= finalPrice)
  ) {
    poolIdWithPriceData.push({
      id: currentId,
      poolId: currentId,
      buyPrice: currentPrice,
    });
  }
  // Filtrer les données
  const idsToKeep: number[] = [];
  for (let i = 0; i < count; i++) {
    idsToKeep.push(closestPoolIdUnderPriceFeed - 2 * i);
  }
  poolIdWithPriceData = poolIdWithPriceData.filter((item) =>
    idsToKeep.includes(item.id)
  );

  poolIdWithPriceData = [...poolIdWithPriceData].reverse(); //inverse the order of price list

  return { poolIdWithPriceData, closestPoolIdUnderPriceFeed };
}

export const useFetchPools = () => {
  const [poolIdWithPrice, setPoolIdWithPrice] = useState<PoolIdWithPriceData[]>(
    []
  );
  const [poolData, setPoolData] = useState<PoolData[]>([]);

  const [poolLoading, setPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState<string>("");

  async function fetchPoolIdWithPrice() {
    setPoolLoading(true);
    try {
      console.log("Getting price step");
      const priceStepResponse = await axios.get(
        `${apiUrl}/v1/constant/priceStep`
      );
      const priceStep = parseFloat(
        ethers.utils.formatUnits(priceStepResponse.data.priceStep, 18)
      );

      console.log("getting price feed");
      const priceFeedResponse = await axios.get(
        `${apiUrl}/v1/constant/viewPriceFeed`
      );
      const priceFeed = parseFloat(
        ethers.utils.formatUnits(priceFeedResponse.data.viewPriceFeed, 8)
      );
      //const { price: priceFeed, loading: loadingPriceFeed } = usePriceOracle();

      //FIXME : need to call api when genesisPoolId is public in smartcontract
      const genesisPoolId = 1111111110;
      const limitPriceGenesisResponse = await axios.get(
        `${apiUrl}/v1/request/limitPrice/${genesisPoolId}`
      );
      const limitPriceGenesis = parseFloat(
        ethers.utils.formatUnits(limitPriceGenesisResponse.data.result, 18)
      );

      const { poolIdWithPriceData, closestPoolIdUnderPriceFeed } =
        calculatePricesForPools(
          limitPriceGenesis,
          genesisPoolId,
          priceFeed,
          priceStep
        );
      console.log(poolIdWithPriceData);
      setPoolIdWithPrice(poolIdWithPriceData);
      console.log(poolIdWithPrice);

      const poolIds = poolIdWithPriceData.map((item) => item.poolId);

      console.log(poolIds);

      //on a les id des pools qui nous interessent, maintenant on s'occupe de recuperer les data liées aux pools
      const results = await Promise.all(
        poolIds.map(async (poolId) => {
          //console.log(`poolIdspoolIds ${poolId}`);
          // Fetch data from the API
          const apiResponses = await Promise.all([
            axios.get(`${apiUrl}/v1/request/pools/${poolId}`),
            axios.get(`${apiUrl}/v1/request/viewLendingRate/${poolId}`),
            axios.get(`${apiUrl}/v1/request/viewUtilizationRate/${poolId}`),
            axios.get(`${apiUrl}/v1/request/limitPrice/${poolId}`),
            axios.get(`${apiUrl}/v1/request/viewBorrowingRate/${poolId}`),
          ]);

          const resultsAvailableAssets = apiResponses[0].data.result.split(",");
          const deposits = parseFloat(
            ethers.utils.formatUnits(resultsAvailableAssets[0], "ether")
          );
          const lendingRate =
            parseFloat(
              ethers.utils.formatUnits(apiResponses[1].data.result, "ether")
            ) * 100;
          const utilizationRate =
            parseFloat(
              ethers.utils.formatUnits(apiResponses[2].data.result, "ether")
            ) * 100;
          const buyPrice = parseFloat(
            ethers.utils.formatUnits(apiResponses[3].data.result, "ether")
          );
          const borrowingRate = parseFloat(
            ethers.utils.formatUnits(apiResponses[4].data.result, "ether")
          );
          const borrows = parseFloat(
            ethers.utils.formatUnits(resultsAvailableAssets[1], "ether")
          );
          //console.log(`poolIdspoolIdslendingRate ${lendingRate}`);

          return {
            id: poolId,
            poolId: poolId,
            buyPrice: buyPrice, //`${formatNumber(buyPrice)} USDC`,
            deposits: deposits, //`${formatNumber(availableAssets)} USDC`,
            lendingRate: lendingRate, //`${formatNumber(lendingRate)}%`,
            borrowingRate: borrowingRate,
            utilizationRate: utilizationRate, //`${utilizationRate.toFixed(2)}%`,
            mySupply: 0,
            myBorrowingPositions: 0,
            borrows: borrows,
            availableSupply: deposits - borrows,
          };
        })
      );
      const mergedData = mergeObjects(results, poolIdWithPriceData);
      setPoolData(mergedData);
      console.log(mergedData);
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setPoolError(errorMessage);
    } finally {
      setPoolLoading(false);
    }
  }

  const refetchPoolData = useCallback(() => {
    console.log("yeuyeuh");
    fetchPoolIdWithPrice();
  }, []);

  //FIXEME : mettre le priceFeed en argument de useEffect afin qu'il soit relancer à chaque fois que le prix change
  useEffect(() => {
    fetchPoolIdWithPrice();
    console.log("on passe par ce useEffect");
  }, []);

  //   useEffect(() => {
  //     fetchPoolIdWithPrice();
  //   }, [fetchPoolIdWithPrice]);

  return { poolData, poolLoading, poolError, refetchPoolData };
};
