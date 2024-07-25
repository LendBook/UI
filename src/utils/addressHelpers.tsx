import addresses from "../config/constants/contracts";
import { Address } from "../config/constants/types";

const chainId = 11155111;

export const getAddress = (address: Address): string => {
  return address[chainId];
};

export const getOrderAddress = () => {
  return addresses.orderbook[chainId];
};
export const getQuoteTokenAddress = () => {
  return getAddress(addresses.usdc);
};
export const getBaseTokenAddress = () => {
  return getAddress(addresses.weth);
};
