import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useOrderbook } from "../useOrderbook";

let apiUrl = "";
if (process.env.NODE_ENV === "development") {
  apiUrl = "";
} else {
  apiUrl = process.env.REACT_APP_API_URL || "https://api-v2-neon.vercel.app"; //"https://lendbook-api-bis.vercel.app"; //"https://api.lendbook.org";
}

export interface UserDepositOrdersData {
  id: number;
  orderLenderId: number;
  poolId: number;
  maker: string;
  mySupply: number;
  [key: string]: string | number;
}

export interface UserBorrowsData {
  id: number;
  orderBorrowerId: number;
  poolId: number;
  borrower: string;
  myBorrowingPositions: number;
  [key: string]: string | number;
}

export interface UserInfoData {
  totalDepositsQuote: string;
  totalDepositsBase: string;
  excessCollateral: string;
  totalBorrow: number;
  baseTokenBalance: string;
  quoteTokenBalance: string;
}

export const useFetchUserInfo = (
  provider: any,
  walletAddress: string | undefined
) => {
  const initialUserInfo: UserInfoData = {
    totalDepositsQuote: "",
    totalDepositsBase: "",
    excessCollateral: "",
    totalBorrow: 0,
    baseTokenBalance: "",
    quoteTokenBalance: "",
  };
  const [userInfo, setUserInfo] = useState<UserInfoData>(initialUserInfo);
  const [userDeposits, setUserDeposits] = useState<UserDepositOrdersData[]>([]);
  const [userBorrows, setUserBorrows] = useState<UserBorrowsData[]>([]);
  const [loadingUser, setLoading] = useState(true);
  const [errorUser, setError] = useState<string | null>(null);
  //const { contract: bookAddress } = useOrderbook();
  const bookAddress = "0x5b0D0DDB7860eaEed42AE95b05A7d2df9877aD25";

  const fetchGlobalUserInfo = async (address: string) => {
    setLoading(true);
    try {
      const responseQuote = await axios.get(
        `${apiUrl}/api/v1/book/${bookAddress}/viewUserTotalDeposits?_user=${address}&_inQuote=true`
      );
      const formattedTotalQuote = ethers.utils.formatEther(
        responseQuote.data.viewUserTotalDeposits
      );
      //console.log("responseQuote ", responseQuote);

      const responseBase = await axios.get(
        `${apiUrl}/api/v1/book/${bookAddress}/viewUserTotalDeposits?_user=${address}&_inQuote=false`
      );
      const formattedTotalBase = ethers.utils.formatEther(
        responseBase.data.viewUserTotalDeposits
      );

      const responseExcessCollateral = await axios.get(
        `${apiUrl}/api/v1/book/${bookAddress}/viewUserExcessCollateral?_user=${address}&_minusCollateral=0`
      );
      const excessCollateral = ethers.utils.formatUnits(
        responseExcessCollateral.data.viewUserExcessCollateral.split(",")[1],
        "ether"
      );
      //tokens part (FIXEME repetition with pools.ts)
      const responseBaseTokenAddress = await axios.get(
        `${apiUrl}/api/v1/book/${bookAddress}/baseToken`
      );
      const baseTokenAddress = responseBaseTokenAddress.data.baseToken;

      const responseQuoteTokenAddress = await axios.get(
        `${apiUrl}/api/v1/book/${bookAddress}/quoteToken`
      );
      const quoteTokenAddress = responseQuoteTokenAddress.data.quoteToken;

      const responseBaseTokenBalance = await axios.get(
        `${apiUrl}/api/v1/balanceToken/${address}/${baseTokenAddress}`
      );
      const baseTokenBalance = responseBaseTokenBalance.data.balance;
      //console.log("baseTokenBalance ", baseTokenBalance);

      const responseQuoteTokenBalance = await axios.get(
        `${apiUrl}/api/v1/balanceToken/${address}/${quoteTokenAddress}`
      );
      const quoteTokenBalance = responseQuoteTokenBalance.data.balance;
      //console.log("quoteTokenBalance ", quoteTokenBalance);

      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        totalDepositsQuote: formattedTotalQuote,
        totalDepositsBase: formattedTotalBase,
        excessCollateral: excessCollateral,
        baseTokenBalance: baseTokenBalance,
        quoteTokenBalance: quoteTokenBalance,
      }));
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
        `${apiUrl}/api/v1/book/${bookAddress}/getUserDepositIds?_user=${address}`
      );

      let depositOrdersId_l =
        depositOrdersIdResponse.data.getUserDepositIds.split(",");
      depositOrdersId_l = depositOrdersId_l.map(Number);

      const results = await Promise.all(
        depositOrdersId_l.map(async (depositOrdersId: Number) => {
          const orderResponse = await axios.get(
            `${apiUrl}/api/v1/book/${bookAddress}/orders?orderId=${depositOrdersId}`
          );

          const orderObject = orderResponse.data.orders.split(",");
          const poolId = parseFloat(orderObject[0]);
          const makerAddress = orderObject[1];
          const quantity = parseFloat(
            ethers.utils.formatUnits(orderObject[3], "ether")
          );

          return {
            id: depositOrdersId,
            orderLenderId: depositOrdersId,
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
        `${apiUrl}/api/v1/book/${bookAddress}/getUserBorrowFromIds?_user=${address}`
      );

      let borrowsId_l = borrowsIdResponse.data.getUserBorrowFromIds.split(",");
      borrowsId_l = borrowsId_l.map(Number);

      let _totalBorrow = 0;

      const results = await Promise.all(
        borrowsId_l.map(async (borrowsId: Number) => {
          const orderResponse = await axios.get(
            `/api/v1/book/${bookAddress}/positions?positionId=${borrowsId}`
          );

          const orderObject = orderResponse.data.positions.split(",");
          const poolId = parseFloat(orderObject[0]);
          const borrowerAddress = orderObject[1];
          const quantity = parseFloat(
            ethers.utils.formatUnits(orderObject[2], "ether")
          );

          _totalBorrow = _totalBorrow + quantity;

          return {
            id: borrowsId,
            orderBorrowerId: borrowsId,
            poolId: poolId,
            borrower: borrowerAddress,
            myBorrowingPositions: quantity,
          };
        })
      );
      setUserBorrows(results);
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        totalBorrow: _totalBorrow,
      }));
    } catch (err: any) {
      const errorMessage = `Failed to fetch user info: ${err.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetchUserData = useCallback(() => {
    //console.log("yeuyeuh");
    if (walletAddress && provider) {
      fetchGlobalUserInfo(walletAddress).catch(console.error);
      fetchDepositOrdersInfo(walletAddress).catch(console.error);
      fetchBorrowsInfo(walletAddress).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (walletAddress && provider) {
      fetchGlobalUserInfo(walletAddress).catch(console.error);
      fetchDepositOrdersInfo(walletAddress).catch(console.error);
      fetchBorrowsInfo(walletAddress).catch(console.error);
    }
  }, [walletAddress, provider]);

  return {
    userInfo,
    userDeposits,
    userBorrows,
    loadingUser,
    errorUser,
    refetchUserData,
  };
};
