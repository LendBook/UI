import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

let apiUrl = "";
if (process.env.NODE_ENV === "development") {
  apiUrl = "";
} else {
  apiUrl = process.env.REACT_APP_API_URL || "https://api.lendbook.org";
}

interface PriceFeedData {
  priceFeed: string;
}

export const usePriceOracle = () => {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchPrice = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/constant/priceFeed`);
      const priceData: PriceFeedData = response.data;
      const priceInUSDC = parseFloat(
        ethers.utils.formatUnits(priceData.priceFeed, 18)
      );
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
    const interval = setInterval(() => {
      fetchPrice();
    }, 10000); // 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
};
