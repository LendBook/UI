// metricsData.tsx
import React from "react";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CropDinRoundedIcon from "@mui/icons-material/CropDinRounded";
import theme from "../theme";

interface MarketInfo {
  quoteTokenSymbol: string;
  baseTokenSymbol: string;
}

export const getMetricsDataLending = (marketInfo: MarketInfo) => [
  {
    key: "buyPrice",
    title: "Buy Price",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.info.main,
    tooltipText: "The buy price linked to the selected pool of orders",
  },
  {
    key: "deposits",
    title: "Supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <SquareRoundedIcon fontSize="small" />,
    tooltipText: "Sum of the lending supply in the selected pool",
  },
  {
    key: "borrows",
    title: "Borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <SquareRoundedIcon fontSize="small" />,
    tooltipText: "Sum of the borrowing positions in the selected pool",
  },
  {
    key: "mySupply",
    title: "My supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <CropDinRoundedIcon fontSize="small" />,
    tooltipText: "Your lending supply in the selected pool",
  },
  {
    key: "lendingRate",
    title: "Net APY",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
    tooltipText: "The APY linked to the selected pool",
  },
  {
    key: "utilizationRate",
    title: "Utilization",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
    tooltipText: "The utilization rate of the selected pool",
  },
];

export const getMetricsDataLendingWithdraw = (marketInfo: MarketInfo) => [
  {
    key: "buyPrice",
    title: "Buy Price",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.info.main,
    tooltipText: "The buy price linked to the selected pool of orders",
  },
  {
    key: "deposits",
    title: "Supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <SquareRoundedIcon fontSize="small" />,
    tooltipText: "Sum of the lending supply in the selected pool",
  },
  {
    key: "borrows",
    title: "Borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <SquareRoundedIcon fontSize="small" />,
    tooltipText: "Sum of the borrowing positions in the selected pool",
  },
  {
    key: "mySupply",
    title: "My supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <CropDinRoundedIcon fontSize="small" />,
    tooltipText: "Your lending supply in the selected pool",
  },
  {
    key: "lendingRate",
    title: "Net APY",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
    tooltipText: "The APY linked to the selected pool",
  },
  {
    key: "utilizationRate",
    title: "Utilization",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
    tooltipText: "The utilization rate of the selected pool",
  },
];

export const getMetricsDataBorrowing = (marketInfo: MarketInfo) => [
  {
    key: "buyPrice",
    title: "Buy Price",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.info.main,
  },
  {
    key: "deposits",
    title: "Supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <SquareRoundedIcon fontSize="small" />,
  },
  {
    key: "borrows",
    title: "Borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <SquareRoundedIcon fontSize="small" />,
  },
  {
    key: "myBorrowingPositions",
    title: "My borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <CropDinRoundedIcon fontSize="small" />,
  },
  {
    key: "borrowingRate",
    title: "Borrow APY",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
  },
  {
    key: "utilizationRate",
    title: "Utilization",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
  },
  {
    key: "maxLTV",
    title: "Max LTV",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
  },
];

export const getMetricsDataBorrowingRepay = (marketInfo: MarketInfo) => [
  {
    key: "buyPrice",
    title: "Buy Price",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.info.main,
  },
  {
    key: "deposits",
    title: "Supply",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.primary.main,
    icon: <SquareRoundedIcon fontSize="small" />,
  },
  {
    key: "borrows",
    title: "Borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <SquareRoundedIcon fontSize="small" />,
  },
  {
    key: "myBorrowingPositions",
    title: "My borrow",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.success.main,
    icon: <CropDinRoundedIcon fontSize="small" />,
  },
  {
    key: "borrowingRate",
    title: "Borrow APY",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
  },
  {
    key: "utilizationRate",
    title: "Utilization",
    value: "-",
    unit: "%",
    color: theme.palette.info.main,
  },
];

export const getMetricsDataTrade = (marketInfo: MarketInfo) => [
  {
    key: "buyPrice",
    title: "Buy Price",
    value: "-",
    unit: marketInfo.quoteTokenSymbol,
    color: theme.palette.info.main,
    tooltipText: "The buy price of the pool",
  },
  {
    key: "availableSupply",
    title: "Available supply for trading",
    value: "-",
    unit: marketInfo.quoteTokenSymbol, // FIXEME need to changet the metric
    color: theme.palette.info.main,
    tooltipText: "",
  },
];
