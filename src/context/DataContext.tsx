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

// Fonction pour regrouper et calculer les valeurs spécifiques des supply en base et en quote
export const groupAndCalculate = (objects: ObjectWithId[]): ObjectWithId[] => {
  // Utilisation d'un Map pour regrouper les objets par poolId
  const groupedMap = new Map<string, ObjectWithId>();

  objects.forEach((item) => {
    const existing = groupedMap.get(item.poolId as string);

    if (existing) {
      // Mettre à jour l'existant avec les nouvelles règles
      existing.mySupplyQuote = Math.max(
        existing.mySupplyQuote as number,
        item.mySupplyQuote as number
      );
      existing.mySupplyBase = Math.max(
        existing.mySupplyBase as number,
        item.mySupplyBase as number
      );
      existing.mySupplyCumulated =
        existing.mySupplyQuote + existing.mySupplyBase;

      // Ajouter les nouvelles valeurs pour orderLenderIdQuote et orderLenderIdBase
      if ((item.mySupplyQuote as number) > 0) {
        existing.orderLenderIdQuote = item.orderLenderId;
      }
      if ((item.mySupplyBase as number) > 0) {
        existing.orderLenderIdBase = item.orderLenderId;
      }
    } else {
      // Ajouter le nouvel élément au Map
      item.mySupplyCumulated =
        (item.mySupplyQuote as number) + (item.mySupplyBase as number); // Calcul initial

      // Initialiser les valeurs pour orderLenderIdQuote et orderLenderIdBase
      if ((item.mySupplyQuote as number) > 0) {
        item.orderLenderIdQuote = item.orderLenderId;
      }
      if ((item.mySupplyBase as number) > 0) {
        item.orderLenderIdBase = item.orderLenderId;
      }

      groupedMap.set(item.poolId as string, { ...item });
    }
  });

  // Retourner les objets regroupés
  return Array.from(groupedMap.values());
};

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
  //console.log("fucking price : ", price);

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

  const userDepositsMergedQuoteAndBase = groupAndCalculate(userDeposits);

  let orderMergedData = mergeObjects(poolData, userDepositsMergedQuoteAndBase);

  orderMergedData.forEach((item) => {
    item.mySupplyCumulated =
      (item.mySupplyQuote as number) + (item.mySupplyBase as number) * price;
    if (Number.isNaN(item.mySupplyCumulated)) {
      item.mySupplyCumulated = 0;
    }
  });

  orderMergedData = mergeObjects(orderMergedData, userBorrows);
  //order the data based on buyPrice
  orderMergedData = orderMergedData.sort(
    (a, b) => Number(b.buyPrice) - Number(a.buyPrice)
  );

  orderMergedData = orderMergedData.map((item) => {
    const buyPrice = item.buyPrice as number;
    return {
      ...item,
      maxLTV: (buyPrice / price) * 96, //96% 0.96 is the liquidation LTV
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
