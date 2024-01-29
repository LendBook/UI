import React, { useEffect, useState } from 'react';
import { getEthPrice, orderbookContract } from '../../contracts';
import { ethers } from "ethers";
import "../../asserts/scss/custom.scss";
import { useTake } from "../../hooks/useTake";
import { Tabs, Tab, Box } from '@mui/material';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartData} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Order {
    id: number;
    limitPrice: string;
    size: string;
    isBorrowable: boolean;
}

const TabPanel = (props: { children: React.ReactNode, value: number, index: number }) => {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ minHeight: '400px' }}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const Orderbook = () => {
    const [buyOrders, setBuyOrders] = useState<Order[]>([]);
    const [sellOrders, setSellOrders] = useState<Order[]>([]);
    const [ethPrice, setEthPrice] = useState<string>("0");
    const [tabValue, setTabValue] = useState(0);

    const take = useTake();

    const initialDepthChartData: ChartData<"bar", number[], number> = {
        labels: [],
        datasets: [
            {
                label: 'Buy Orders',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Sell Orders',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const [depthChartData, setDepthChartData] = useState<ChartData<"bar", number[], number>>(initialDepthChartData);


    const handleTake = async (orderId: number, size: string) => {
        await take(orderId, size);
    };

    const buildDepthChartData = () => {
        // ... Logic to build depth chart data
        const buyPrices = buyOrders.map(order => parseFloat(order.limitPrice));
        const sellPrices = sellOrders.map(order => parseFloat(order.limitPrice));
        const buySizes = buyOrders.map(order => parseFloat(order.size));
        const sellSizes = sellOrders.map(order => parseFloat(order.size));

        const data = {
            labels: [...buyPrices, ...sellPrices],
            datasets: [
                {
                    label: 'Buy Orders',
                    data: buySizes,
                    backgroundColor: '#05754f',
                },
                {
                    label: 'Sell Orders',
                    data: sellSizes,
                    backgroundColor: '#411e22',
                },
            ],
        };

        setDepthChartData(data);
    };

    useEffect(() => {
        fetchOrders();
        buildDepthChartData();
    }, [buyOrders, sellOrders]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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
            {/*<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example"
                      sx={{ '& .MuiTab-root': { color: '#fff' } }}>
                    <Tab label="Orderbook" />
                    <Tab label="Depth" />
                </Tabs>
            </Box> */}
         {/*   <TabPanel value={tabValue} index={0}> */}
                <table className="orderbook-table rounded-lg border-[5px] border-solid border-[#191b1f] ">
                    <thead>
                    <tr>
                        <th>Price (USDC)</th>
                        <th>Amount (ETH)</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sellOrders.map(order => (
                        <tr key={order.id} className="sell-row">
                            <td>{order.limitPrice}</td>
                            <td>{order.size}</td>
                            <td>
                                <button className="buy-button" onClick={() => handleTake(order.id, order.size)}>BUY</button>
                            </td>
                        </tr>
                    ))}
                    {/* Display the current ETH price row */}
                    <tr className="eth-price-row">
                        <td colSpan={3}>${ethPrice}</td>
                    </tr>
                    {buyOrders.map(order => (
                        <tr key={order.id} className="buy-row">
                            <td>{order.limitPrice}</td>
                            <td>{order.size}</td>
                            <td>
                                <button className="sell-button" onClick={() => handleTake(order.id, order.size)}>SELL</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            {/* </TabPanel> */}
            {/* <TabPanel value={tabValue} index={1}>
                <table className="orderbook-table rounded-lg">
                    <Bar data={depthChartData} />
                </table>

            </TabPanel> */}
        </div>
    );
};

export default Orderbook;
