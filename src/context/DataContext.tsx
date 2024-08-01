import React, { createContext, useCallback, useContext } from "react";
import { usePriceOracle } from "../hooks/api/oraclePrice";
import {
  useFetchUserInfo,
  UserDepositOrdersData,
  UserBorrowsData,
} from "../hooks/api/userInfo";
import { ObjectWithId, mergeObjects } from "../components/GlobalFunctions";
import { PoolData, MarketInfoData, useFetchPools } from "../hooks/api/pools";

interface DataContextType {
  price: number | null;
  priceLoading: boolean;
  priceError: string;
  userInfo: any;
  userDeposits: UserDepositOrdersData[];
  userBorrows: UserBorrowsData[];
  loadingUser: boolean;
  errorUser: string | null;
  poolLoading: boolean;
  orderMergedData: ObjectWithId[];
  orderMergedDataUnderMarketPrice: ObjectWithId[];
  poolData: PoolData[];
  refetchData: () => void; // Add this line
  refetchUserData: () => void;
  closestPoolIdUnderPriceFeed: number;
  marketInfo: MarketInfoData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
  provider: any;
  walletAddress: string | undefined;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  provider,
  walletAddress,
}) => {
  // const { pricePoolId, pricePoolIdLoading, pricePoolIdError } =
  //   useFetchPriceForEmptyPools();
  // const poolIds = pricePoolId.map((item) => item.poolId);
  // const {
  //   data: orderData,
  //   loading: orderLoading,
  //   error: orderError,
  // } = useFetchLendOrder(poolIds);

  const { price, loading: priceLoading, error: priceError } = usePriceOracle();
  console.log("fucking price : ", price);

  const {
    userInfo,
    userDeposits,
    userBorrows,
    loadingUser,
    errorUser,
    refetchUserData,
  } = useFetchUserInfo(provider, walletAddress);

  const {
    poolData,
    poolLoading,
    poolError,
    refetchPoolData,
    closestPoolIdUnderPriceFeed,
    marketInfo,
  } = useFetchPools();

  let orderMergedData = mergeObjects(poolData, userDeposits);
  orderMergedData = mergeObjects(orderMergedData, userBorrows);
  //order the data based on buyPrice
  orderMergedData = orderMergedData.sort(
    (a, b) => Number(b.buyPrice) - Number(a.buyPrice)
  );

  orderMergedData = orderMergedData.map((item) => {
    const buyPrice = item.buyPrice as number;
    return {
      ...item,
      maxLTV: (buyPrice / price) * 100,
    };
  });

  // // Filtrer les données
  const orderMergedDataUnderMarketPrice = orderMergedData.filter((item) => {
    if (typeof item.poolId === "number") {
      return item.poolId <= closestPoolIdUnderPriceFeed;
    }
    return false;
  });

  const refetchData = useCallback(() => {
    // FIXEME j'appelle une deuxieme fois car ya un prblm et on ne recupere pas le nvx poolData
    // à cause de la mise a jour asynchrone il me semble et car ya pas de synchronisation entre poolData
    // et les user data (userDeposits et userBorrows)
    refetchUserData();
    refetchPoolData();
    refetchUserData();
    refetchPoolData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        price,
        priceLoading,
        priceError,
        userInfo,
        userDeposits,
        userBorrows,
        loadingUser,
        errorUser,
        poolLoading,
        orderMergedData,
        orderMergedDataUnderMarketPrice,
        poolData,
        refetchData, // Add this line
        refetchUserData,
        closestPoolIdUnderPriceFeed,
        marketInfo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
