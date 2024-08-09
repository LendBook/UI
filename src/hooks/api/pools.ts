import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { mergeObjects } from "../../components/GlobalFunctions";
import { count } from "console";

let apiUrl = "";
if (process.env.NODE_ENV === "development") {
  apiUrl = "";
} else {
  apiUrl = process.env.REACT_APP_API_URL || "https://api-v2-neon.vercel.app"; //"https://lendbook-api-bis.vercel.app"; //"https://api.lendbook.org";
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

export interface MarketInfoData {
  baseTokenAddress: string;
  quoteTokenAddress: string;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  totalDeposit: number;
  totalBorrow: number;
  maxLendingRate: number;
}

function calculatePricesForPools(
  genesisPrice: number,
  genesisId: number,
  marketPrice: number,
  step: number
): {
  poolIdWithPriceData: PoolIdWithPriceData[];
  closestPoolIdUnderPriceFeed: number;
} {
  let poolIdWithPriceData: PoolIdWithPriceData[] = [];

  let closestPoolIdUnderPriceFeed = 1111111110;

  // Determine the increment direction
  const isIncreasing = marketPrice > genesisPrice;
  const idStep = 2; // 2 because for each buy order pool, there is a sell order pool linked to it (odd number)

  ///////////////////////////new code
  // const gapPrice = isIncreasing
  //   ? marketPrice - genesisPrice
  //   : genesisPrice - marketPrice;

  //get a pool close (under or above) to the current market price
  const gapStep = Math.round(
    Math.abs(Math.log(genesisPrice / marketPrice) / Math.log(step))
  );
  const closeToMarketPoolId = isIncreasing
    ? genesisId + gapStep * idStep
    : genesisId - gapStep * idStep;

  const nbrPoolsUnder = 10;
  const nbrPoolsAbove = 5;

  const startPoolId = closeToMarketPoolId - nbrPoolsUnder * idStep;
  const endPoolId = closeToMarketPoolId + nbrPoolsAbove * idStep;

  let currentPrice = genesisPrice; // if startPoolId==genesisId

  if (startPoolId > genesisId) {
    currentPrice = genesisPrice * Math.pow(step, gapStep - nbrPoolsUnder);
  } else if (startPoolId < genesisId) {
    if (isIncreasing) {
      currentPrice = genesisPrice / Math.pow(step, nbrPoolsUnder - gapStep);
    } else {
      currentPrice = genesisPrice / Math.pow(step, gapStep + nbrPoolsUnder);
    }
  }

  // console.log("isIncreasing ", isIncreasing);
  // console.log("idStep ", idStep);
  // console.log("gapStep ", gapStep);
  // console.log("nbrPoolsUnder ", nbrPoolsUnder);
  // console.log("genesisPrice ", genesisPrice);
  // console.log("currentPrice ", currentPrice);
  let currentId = startPoolId;
  // Generate data
  while (currentId <= endPoolId) {
    //console.log(`create buy price ${currentPrice}`);

    poolIdWithPriceData.push({
      id: currentId,
      poolId: currentId,
      buyPrice: currentPrice,
    });

    if (currentPrice < marketPrice) {
      closestPoolIdUnderPriceFeed = currentId;
    }
    currentPrice *= step;
    currentId += idStep;
  }

  ///////////////////////////end code

  // // Filtrer les données
  // const idsToKeep: number[] = [];
  // for (let i = 0; i < count; i++) {
  //   idsToKeep.push(closestPoolIdUnderPriceFeed - 2 * i);
  // }
  // poolIdWithPriceData = poolIdWithPriceData.filter((item) =>
  //   idsToKeep.includes(item.id)
  // );
  // poolIdWithPriceData = [...poolIdWithPriceData].reverse(); //inverse the order of price list

  return {
    poolIdWithPriceData,
    closestPoolIdUnderPriceFeed,
  };
}

export const useFetchPools = () => {
  const initialMarketInfo: MarketInfoData = {
    baseTokenAddress: "",
    quoteTokenAddress: "",
    baseTokenSymbol: "",
    quoteTokenSymbol: "",
    totalDeposit: 0,
    totalBorrow: 0,
    maxLendingRate: 0,
  };
  const [marketInfo, setMarketInfo] =
    useState<MarketInfoData>(initialMarketInfo);

  const [poolIdWithPrice, setPoolIdWithPrice] = useState<PoolIdWithPriceData[]>(
    []
  );
  const [poolData, setPoolData] = useState<PoolData[]>([]);

  const [poolLoading, setPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState<string>("");
  const [closestPoolIdUnderPriceFeed, setClosestPoolIdUnderPriceFeed] =
    useState<number>(1111111110);

  async function fetchPoolIdWithPrice() {
    setPoolLoading(true);
    try {
      //tokens part
      const responseBaseTokenAddress = await axios.get(
        `${apiUrl}/api/v1/book/baseToken`
      );
      const baseTokenAddress = responseBaseTokenAddress.data.baseToken;

      const responseQuoteTokenAddress = await axios.get(
        `${apiUrl}/api/v1/book/quoteToken`
      );
      const quoteTokenAddress = responseQuoteTokenAddress.data.quoteToken;

      //console.log("responseBaseTokenAddress ", responseBaseTokenAddress);
      const responseBaseTokenSymbol = await axios.get(
        `${apiUrl}/api/v1/symbol/${baseTokenAddress}`
      );
      const baseTokenSymbol = responseBaseTokenSymbol.data.symbol;
      //console.log("responseBaseTokenSymbol ", responseBaseTokenSymbol);
      //console.log("baseTokenSymbol ", baseTokenSymbol);

      const responseQuoteTokenSymbol = await axios.get(
        `${apiUrl}/api/v1/symbol/${quoteTokenAddress}`
      );
      const quoteTokenSymbol = responseQuoteTokenSymbol.data.symbol;

      //console.log("Getting price step");
      const priceStepResponse = await axios.get(
        `${apiUrl}/api/v1/book/priceStep`
      );
      const priceStep = parseFloat(
        ethers.utils.formatUnits(priceStepResponse.data.priceStep, 18)
      );

      //console.log("getting price feed");
      const priceFeedResponse = await axios.get(
        `${apiUrl}/api/v1/book/viewPriceFeed`
      );
      const priceFeed = parseFloat(
        ethers.utils.formatUnits(priceFeedResponse.data.viewPriceFeed, 18)
      );
      //const { price: priceFeed, loading: loadingPriceFeed } = usePriceOracle();

      //FIXME : need to call api when genesisPoolId is public in smartcontract
      const genesisPoolId = 1111111110;
      const limitPriceGenesisResponse = await axios.get(
        `${apiUrl}/api/v1/book/limitPrice?poolId=${genesisPoolId}`
      );
      const limitPriceGenesis = parseFloat(
        ethers.utils.formatUnits(limitPriceGenesisResponse.data.limitPrice, 18)
      );
      //console.log("limitPriceGenesis", limitPriceGenesis);

      const { poolIdWithPriceData, closestPoolIdUnderPriceFeed } =
        calculatePricesForPools(
          limitPriceGenesis,
          genesisPoolId,
          priceFeed,
          priceStep
        );
      setClosestPoolIdUnderPriceFeed(closestPoolIdUnderPriceFeed);
      //console.log(poolIdWithPriceData);
      setPoolIdWithPrice(poolIdWithPriceData);
      //console.log(poolIdWithPrice);

      const poolIds = poolIdWithPriceData.map((item) => item.poolId);

      //console.log(poolIds);

      let _totalDeposit = 0;
      let _totalBorrow = 0;
      let _maxLendingRate = 0;
      //on a les id des pools qui nous interessent, maintenant on s'occupe de recuperer les data liées aux pools
      const results = await Promise.all(
        poolIds.map(async (poolId) => {
          //console.log(`poolIdspoolIds ${poolId}`);
          // Fetch data from the API

          // const apiResponses = await Promise.all([
          //   axios.get(`${apiUrl}/api/v1/book/pools?poolId=${poolId}`),
          //   axios.get(
          //     `${apiUrl}/api/v1/book/viewLendingRate?_poolId=${poolId}`
          //   ),
          //   axios.get(
          //     `${apiUrl}/api/v1/book/viewUtilizationRate?_poolId=${poolId}`
          //   ),
          //   axios.get(`${apiUrl}/api/v1/book/limitPrice?poolId=${poolId}`),
          //   axios.get(
          //     `${apiUrl}/api/v1/book/viewBorrowingRate?_poolId=${poolId}`
          //   ),
          // ]);
          const poolsResponse = await axios.get(
            `${apiUrl}/api/v1/book/pools?poolId=${poolId}`
          );
          const viewLendingRateResponse = await axios.get(
            `${apiUrl}/api/v1/book/viewLendingRate?_poolId=${poolId}`
          );
          const viewUtilizationRateResponse = await axios.get(
            `${apiUrl}/api/v1/book/viewUtilizationRate?_poolId=${poolId}`
          );
          const viewLimitPriceResponse = await axios.get(
            `${apiUrl}/api/v1/book/limitPrice?poolId=${poolId}`
          );
          const viewBorrowingRateResponse = await axios.get(
            `${apiUrl}/api/v1/book/viewBorrowingRate?_poolId=${poolId}`
          );

          const poolsData = poolsResponse.data.pools.split(",");
          const deposits = parseFloat(
            ethers.utils.formatUnits(poolsData[0], "ether")
          );
          const lendingRate =
            parseFloat(
              ethers.utils.formatUnits(
                viewLendingRateResponse.data.viewLendingRate,
                "ether"
              )
            ) * 100;
          const utilizationRate =
            parseFloat(
              ethers.utils.formatUnits(
                viewUtilizationRateResponse.data.viewUtilizationRate,
                "ether"
              )
            ) * 100;
          const buyPrice = parseFloat(
            ethers.utils.formatUnits(
              viewLimitPriceResponse.data.limitPrice,
              "ether"
            )
          );
          const borrowingRate = parseFloat(
            ethers.utils.formatUnits(
              viewBorrowingRateResponse.data.viewBorrowingRate,
              "ether"
            )
          );
          const borrows = parseFloat(
            ethers.utils.formatUnits(poolsData[1], "ether")
          );
          //console.log(`poolIdspoolIdslendingRate ${lendingRate}`);

          _totalDeposit = _totalDeposit + deposits;
          _totalBorrow = _totalBorrow + borrows;
          if (_maxLendingRate < lendingRate) {
            _maxLendingRate = lendingRate;
          }

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
      //console.log(mergedData);

      setMarketInfo({
        baseTokenAddress: baseTokenAddress,
        quoteTokenAddress: quoteTokenAddress,
        baseTokenSymbol: baseTokenSymbol,
        quoteTokenSymbol: quoteTokenSymbol,
        totalDeposit: _totalDeposit,
        totalBorrow: _totalBorrow,
        maxLendingRate: _maxLendingRate,
      });
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setPoolError(errorMessage);
    } finally {
      setPoolLoading(false);
    }
  }

  const refetchPoolData = useCallback(() => {
    //console.log("yeuyeuh");
    fetchPoolIdWithPrice();
  }, []);

  //FIXEME : mettre le priceFeed en argument de useEffect afin qu'il soit relancer à chaque fois que le prix change
  useEffect(() => {
    fetchPoolIdWithPrice();
    //console.log("on passe par ce useEffect");
  }, []);

  //   useEffect(() => {
  //     fetchPoolIdWithPrice();
  //   }, [fetchPoolIdWithPrice]);

  return {
    poolData,
    poolLoading,
    poolError,
    refetchPoolData,
    closestPoolIdUnderPriceFeed,
    marketInfo,
  };
};
