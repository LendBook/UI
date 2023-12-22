import React, { useEffect, useState } from 'react';
import { getEthPrice, orderbookContract } from '../contracts';
import { ethers } from "ethers";
import "../asserts/scss/custom.scss";
import ethIcon from "../asserts/images/coins/eth.svg";
import {useTake} from "../hooks/useTake";

interface Order {
    id: number;
    limitPrice: string;
    size: string;
    isBorrowable: boolean;
}

const Orderbook = () => {
    const [buyOrders, setBuyOrders] = useState<Order[]>([]);
    const [sellOrders, setSellOrders] = useState<Order[]>([]);
    const [ethPrice, setEthPrice] = useState<string>("0");

    const take = useTake();

    const handleTake = async (orderId: number, size: string) => {
        await take(orderId, size);
    };

    const fetchOrders = async () => {
        try {
            const lastOrderId = await orderbookContract.lastOrderId();
            let fetchedBuyOrders: Order[] = [];
            let fetchedSellOrders: Order[] = [];

            const ethPriceInEther = await getEthPrice();
            const ethPriceNumber = ethPriceInEther ? parseFloat(String(ethPriceInEther)) : 0;

            for (let i = 1; i <= lastOrderId; i++) {
                const order = await orderbookContract.orders(i);
                if (!ethers.BigNumber.from(order.quantity).isZero()) { // Vérifier si la taille de l'ordre est > 0 et si l'ordre est empruntable
                    const orderFormatted = {
                        id: i,
                        limitPrice: ethers.utils.formatUnits(order.price, 'ether'),
                        size: ethers.utils.formatUnits(order.quantity, 'ether'),
                        isBorrowable: order.isBorrowable
                    };

                    const orderPriceNumber = parseFloat(orderFormatted.limitPrice);

                    if (order.isBuyOrder && orderPriceNumber < ethPriceNumber) {
                        fetchedBuyOrders.push(orderFormatted);
                    } else if (!order.isBuyOrder && orderPriceNumber > ethPriceNumber) {
                        fetchedSellOrders.push(orderFormatted);
                    }
                }
            }

            setBuyOrders(fetchedBuyOrders.sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice)));
            setSellOrders(fetchedSellOrders.sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice)));
        } catch (error) {
            console.error("Error : ", error);
        }
    };



    const fetchEthPrice = async () => {
        const price = await getEthPrice();
        if (price) setEthPrice(String(price));
    };

    useEffect(() => {
        fetchOrders();
        fetchEthPrice();
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>

            <table className="orderbook-table">
                <tr>
                    <th>Price (USDC)</th>
                    <th>Amount (ETH)</th>
                    <th></th>
                </tr>
                <tbody>
                {sellOrders.map(order => (
                    <tr key={order.id} className="sell-row">
                        <td><b>{Math.floor(Number(order.limitPrice)).toLocaleString('en-US')}</b></td>
                        <td><b>{order.size}</b></td>
                        <td>
                            {order.isBorrowable && (
                            <button
                                className="buy-button"
                                onClick={() => handleTake(order.id, order.size)}
                            >
                                BUY
                            </button>
                            )}
                        </td>
                    </tr>
                ))}

                <tr className="eth-price-row">
                    <div className="relative flex flex-row items-center px-[18px] ">
                    <td colSpan={3}>${Math.floor(Number(ethPrice)).toLocaleString('en-US')}</td>
                    </div>
                </tr>
                {buyOrders.map(order => (
                    <tr key={order.id} className="buy-row">
                        <td><b>{Math.floor(Number(order.limitPrice)).toLocaleString('en-US')}</b></td>
                        <td><b>{order.size}</b></td>
                        <td>
                            {order.isBorrowable && (
                            <button className="sell-button"
                                    onClick={() => handleTake(order.id, order.size)}
                            >
                                SELL
                            </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orderbook;
