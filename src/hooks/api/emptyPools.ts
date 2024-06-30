import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { id } from "ethers/lib/utils";
import { step } from "@material-tailwind/react";
import { usePriceOracle } from "./oraclePrice";

export interface PriceForPoolIdData {
  id: number;
  poolId: number;
  buyPrice: number;
  [key: string]: string | number;
}

const limitPriceGenesis = 1000;
const genesisPoolId = 1111111110;
const priceFeed = 2000;
const priceStep = 1.1;

// Je veux partir du limitPriceGenesis et aller jusqu'au priceFeed (le priceFeed peut etre plus grand ou plus petit que limitPriceGenesis).
// A la fin je veux obtenir un object de ce type :
// interface PriceForPoolIdData {
//     id: number;
//     buyPrice: number;
//     [key: string]: string | number;
//   }

// Par exemple , le premier element de cet object sera {id=genesisPoolId, buyPrice=limitPriceGenesis}
// et le deuxieme element sera {id=genesisPoolId+2, buyPrice=limitPriceGenesis*priceStep} si priceFeed > limitPriceGenesis
// ou sinon le deuxieme element sera  {id=genesisPoolId-2, buyPrice=limitPriceGenesis/priceStep} si priceFeed < limitPriceGenesis
// Et je veux que ça s'arrete quand le buyPrice du dernier element à franchis le priceFeed.
// Fais moi ce code en typescript

function generatePriceData(
  startPrice: number,
  startId: number,
  marketPrice: number,
  step: number
): { priceData: PriceForPoolIdData[]; closestPoolIdUnderPriceFeed: number } {
  let priceData: PriceForPoolIdData[] = [];
  let currentPrice = startPrice;
  let currentId = startId;

  let closestPoolIdUnderPriceFeed = 1111111110;

  // Determine the increment direction
  const isIncreasing = marketPrice > startPrice;
  const idStep = 2;

  // 5 = nombre de pool en dessous ou au dessus de endPrice
  const count = 5;
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
    console.log(`create buy price ${currentPrice}`);

    priceData.push({
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
    priceData.push({
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
  priceData = priceData.filter((item) => idsToKeep.includes(item.id));

  priceData = [...priceData].reverse(); //inverse the order of price list

  return { priceData, closestPoolIdUnderPriceFeed };
}

export const useFetchPriceForEmptyPools = () => {
  const [pricePoolId, setPricePoolId] = useState<PriceForPoolIdData[]>([]);

  const [pricePoolIdLoading, setLoading] = useState(true);
  const [pricePoolIdError, setError] = useState<string>("");

  const [poolIdCloseToPriceFeed, setPoolIdCloseToPriceFeed] =
    useState<number>(0);

  //const { price: priceFeed, loading: loadingPriceFeed } = usePriceOracle();

  async function fetchPricePoolIdInfo() {
    setLoading(true);
    try {
      console.log("STARTING GETTING NEW PRICE");
      const priceStepResponse = await axios.get(`/v1/constant/priceStep`);
      const priceStep = parseFloat(
        ethers.utils.formatUnits(priceStepResponse.data.priceStep, 18)
      );

      console.log("CONTINUE GETTING NEW PRICE");
      //FIXME: can be removed if we call usePriceOracle.ts from App and get access to the priceOracle.
      const priceFeedResponse = await axios.get("/v1/constant/priceFeed");
      const priceFeed = parseFloat(
        ethers.utils.formatUnits(priceFeedResponse.data.priceFeed, 18)
      );
      //const { price: priceFeed, loading: loadingPriceFeed } = usePriceOracle();

      //FIXME : need to call api when genesisPoolId is public in smartcontract
      const genesisPoolId = 1111111110;
      const limitPriceGenesisResponse = await axios.get(
        `/v1/request/limitPrice/${genesisPoolId}`
      );
      const limitPriceGenesis = parseFloat(
        ethers.utils.formatUnits(limitPriceGenesisResponse.data.result, 18)
      );

      const { priceData, closestPoolIdUnderPriceFeed } = generatePriceData(
        limitPriceGenesis,
        genesisPoolId,
        priceFeed,
        priceStep
      );
      console.log(priceData);

      setPricePoolId(priceData);
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  //FIXEME : mettre le priceFeed en argument de useEffect afin qu'il soit relancer à chaque fois que le prix change
  useEffect(() => {
    fetchPricePoolIdInfo();
  }, []);

  return { pricePoolId, pricePoolIdLoading, pricePoolIdError };
};
