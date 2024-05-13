import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

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
      const genesisPoolResponse = await axios.get("/v1/constant/GenesisPoolId");
      const genesisPoolId = genesisPoolResponse.data.GenesisPoolId; // Assurez-vous que ceci correspond à la structure de réponse de votre API

      const results = await Promise.all(
        poolIds.map(async (poolId) => {
          // Fetch data from the API
          const apiResponses = await Promise.all([
            axios.get(`/v1/request/pools/${poolId}`),
            axios.get(`/v1/request/viewLendingRate/${poolId}`),
            axios.get(`/v1/request/viewUtilizationRate/${poolId}`),
            axios.get(`/v1/request/limitPrice/${genesisPoolId}`),
            "",
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
          const mySupply = "";

          return {
            buyPrice: `${buyPrice} USDC`,
            totalSupply: `${availableAssets} USDC`,
            netAPY: `${lendingRate.toFixed(2)}%`,
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
