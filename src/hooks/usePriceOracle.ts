import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

interface PriceFeedData {
  priceFeed: string;
}

export const usePriceOracle = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchPrice = async () => {
    try {
      const response = await axios.get("/v1/constant/priceFeed");
      const priceData: PriceFeedData = response.data;
      const priceInUSDC = parseFloat(ethers.utils.formatUnits(priceData.priceFeed, 18));
      setPrice(priceInUSDC);
    } catch (err) {
      setError("Failed to fetch price data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  return { price, loading, error };
};
