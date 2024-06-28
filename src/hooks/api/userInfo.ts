import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from "ethers";

export interface UserDepositOrdersData {
  id: number;
  orderId: number;
  poolId: number;
  maker: string;
  mySupply: number;
  [key: string]: string | number;
}

export interface UserBorrowsData {
  id: number;
  orderId: number;
  poolId: number;
  borrower: string;
  myBorrowingPositions: number;
  [key: string]: string | number;
}

export const useFetchUserInfo = (provider: any, walletAddress: string | undefined) => {
  const [userInfo, setUserInfo] = useState({
    totalDepositsQuote: "",
    totalDepositsBase: "",
    excessCollateral: "",
  });
  const [userDeposits, setUserDeposits] = useState<UserDepositOrdersData[]>([]);
  const [userBorrows, setUserBorrows] = useState<UserBorrowsData[]>([]);
  const [loadingUser, setLoading] = useState(true);
  const [errorUser, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress && provider) {
      fetchGlobalUserInfo(walletAddress).catch(console.error);
      fetchDepositOrdersInfo(walletAddress).catch(console.error);
      fetchBorrowsInfo(walletAddress).catch(console.error);
    }
  }, [walletAddress, provider]);

  const fetchGlobalUserInfo = async (address: string) => {
    setLoading(true);
    try {
      const responseQuote = await axios.get(
        `/v1/request/viewUserTotalDeposits/${address}/true`
      );
      const formattedTotalQuote = ethers.utils.formatEther(
        responseQuote.data.result
      );

      const responseBase = await axios.get(
        `/v1/request/viewUserTotalDeposits/${address}/false`
      );
      const formattedTotalBase = ethers.utils.formatEther(
        responseBase.data.result
      );

      const responseExcessCollateral = await axios.get(
        `/v1/request/viewUserExcessCollateral/${address}/0`
      );
      const excessCollateral = ethers.utils.formatUnits(
        responseExcessCollateral.data.result.split(",")[1],
        "ether"
      );
      setUserInfo({
        totalDepositsQuote: formattedTotalQuote,
        totalDepositsBase: formattedTotalBase,
        excessCollateral: excessCollateral,
      });
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositOrdersInfo = async (address: string) => {
    setLoading(true);
    try {
      const depositOrdersIdResponse = await axios.get(
        `/v1/request/getUserDepositIds/${address}`
      );

      let depositOrdersId_l = depositOrdersIdResponse.data.result.split(",");
      depositOrdersId_l = depositOrdersId_l.map(Number);

      const results = await Promise.all(
        depositOrdersId_l.map(async (depositOrdersId: Number) => {
          const orderResponse = await axios.get(
            `/v1/request/orders/${depositOrdersId}`
          );

          const orderObject = orderResponse.data.result.split(",");
          const poolId = parseFloat(orderObject[0]);
          const makerAddress = orderObject[1];
          const quantity = parseFloat(
            ethers.utils.formatUnits(orderObject[3], "ether")
          );

          return {
            id: depositOrdersId,
            orderId: depositOrdersId,
            poolId: poolId,
            maker: makerAddress,
            mySupply: quantity,
          };
        })
      );
      setUserDeposits(results);
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowsInfo = async (address: string) => {
    setLoading(true);
    try {
      const borrowsIdResponse = await axios.get(
        `/v1/request/getUserBorrowFromIds/${address}`
      );

      let borrowsId_l = borrowsIdResponse.data.result.split(",");
      borrowsId_l = borrowsId_l.map(Number);

      const results = await Promise.all(
        borrowsId_l.map(async (borrowsId: Number) => {
          const orderResponse = await axios.get(
            `/v1/request/positions/${borrowsId}`
          );

          const orderObject = orderResponse.data.result.split(",");
          const poolId = parseFloat(orderObject[0]);
          const borrowerAddress = orderObject[1];
          const quantity = parseFloat(
            ethers.utils.formatUnits(orderObject[2], "ether")
          );

          return {
            id: borrowsId,
            orderId: borrowsId,
            poolId: poolId,
            borrower: borrowerAddress,
            myBorrowingPositions: quantity,
          };
        })
      );
      setUserBorrows(results);
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { userInfo, userDeposits, userBorrows, loadingUser, errorUser };
};
