import React, { useEffect, useState } from 'react';
import { getEthPrice, orderbookContract } from '../../contracts';
import { ethers } from "ethers";
import "../../asserts/scss/custom.scss";
import { useTake } from "../../hooks/useTake";
import { Tabs, Tab, Box } from '@mui/material';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartData} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useOrderContext} from "./Ordercontext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);


    const { setOrderId } = useOrderContext();
    const take = useTake();

    const handleTake = async (orderId: number, size: string) => {
        await take(orderId, size);
    };

    const handleRowClick = (orderId: number) => {
        setSelectedOrderId(orderId);
        setOrderId(orderId);
    };


    useEffect(() => {
        fetchOrders();
    }, [buyOrders, sellOrders]);


    const fetchOrders = async () => {
        try {
            const lastOrderId = await orderbookContract.lastOrderId();
            let fetchedBuyOrders: Order[] = [];
            let fetchedSellOrders: Order[] = [];

            const ethPriceInEther = await getEthPrice();
            const ethPriceNumber = ethPriceInEther ? parseFloat(String(ethPriceInEther)) : 0;

            for (let i = 1; i <= lastOrderId; i++) {
                const order = await orderbookContract.orders(i);
                if (!ethers.BigNumber.from(order.quantity).isZero()) {
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
        fetchEthPrice();
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <table className="orderbook-table border-[5px] border-solid border-[#191b1f] ">
                    <thead>
                    <tr>
                        <th>Price (USDC)</th>
                        <th>Amount (ETH)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sellOrders.map(order => (
                        <tr key={order.id}
                            className={`sell-row ${selectedOrderId === order.id ? 'selected-row' : ''}`}
                            onClick={() => handleRowClick(order.id)}> {/* Ici order.id est un number */}
                            <td>{order.limitPrice}</td>
                            <td>{order.size}</td>
                        </tr>
                    ))}
                    <tr className="eth-price-row">
                        <td colSpan={2}>${ethPrice}</td>
                    </tr>
                    {buyOrders.map(order => (
                        <tr key={order.id}
                            className={`buy-row ${selectedOrderId === order.id ? 'selected-row' : ''}`}
                            onClick={() => handleRowClick(order.id)}> {/* Ici order.id est un number */}
                            <td>{order.limitPrice}</td>
                            <td>{order.size}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
        </div>
    );
};

export default Orderbook;
