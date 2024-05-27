import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { formatNumber } from "../components/GlobalFunctions";

interface LendOrderData {
  buyPrice: string;
  totalSupply: string;
  netAPY: string;
  utilization: string;
  mySupply: string;
}

export const useFetchLendOrder = (
  contract: ethers.Contract,
  poolIds: number[]
) => {
  const [data, setData] = useState<LendOrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    try {
      const genesisPoolId = 1111111110;
      const results = await Promise.all(
        poolIds.map(async (poolId) => {
          // Fetch data from the API
          const apiResponses = await Promise.all([
            axios.get(`/v1/request/pools/${poolId}`),
            axios.get(`/v1/request/viewLendingRate/${poolId}`),
            axios.get(`/v1/request/viewUtilizationRate/${poolId}`),
            axios.get(`/v1/request/limitPrice/${poolId}`),
            "(To Be Done)",
          ]);

          const resultsAvailableAssets = apiResponses[0].data.result.split(",");
          const availableAssets = parseFloat(
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
          const mySupply = apiResponses[4];

          return {
            buyPrice: `${formatNumber(buyPrice)} USDC`,
            totalSupply: `${formatNumber(availableAssets)} USDC`,
            netAPY: `${formatNumber(lendingRate)}%`,
            utilization: `${utilizationRate.toFixed(2)}%`,
            mySupply: `${mySupply} USDC`,
          };
        })
      );

      setData(results);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [poolIds]);

  return { data, loading, error };
};
