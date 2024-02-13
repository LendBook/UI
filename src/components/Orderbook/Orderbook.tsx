// Orderbook.tsx
import React, { useEffect, useRef, useState } from 'react';
import { getEthPrice, orderbookContract } from '../../contracts';
import { ethers } from "ethers";
import "../../asserts/scss/custom.scss";
import {Box, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, Menu, MenuItem, Select,
    SelectChangeEvent, Slider } from '@mui/material';
import { useTake } from '../../hooks/useTake';
import { useBorrow } from '../../hooks/useBorrow';
import { useChangePriceFeed } from '../../hooks/useChangePriceFeed';
import { useOrderContext } from './OrderContext';

interface OrderbookProps {
    isDeposit: boolean;
}

interface Order {
    id: number;
    limitPrice: string;
    size: string;
    isBorrowable: boolean;
}

const Orderbook = ({ isDeposit }: OrderbookProps) => {
    const PAGE_SIZE = 10;

    const [buyOrders, setBuyOrders] = useState<Order[]>([]);
    const [sellOrders, setSellOrders] = useState<Order[]>([]);

    // VARIABLES
    const [ethPrice, setEthPrice] = useState<string>("0");
    const [size, setSize] = useState<string | null>(null);
    const [limit, setLimit] = useState<string | null>(null);
    const [isBuy, setBuy] = useState<boolean | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newEthPrice, setNewEthPrice] = useState<string>(ethPrice);

    const [step, setStep] = useState(50); // Pour le pas
    const [nbOrders, setNbOrders] = useState(5); // Pour le nombre d'ordres


    // SELECT ORDER
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const { setOrderId, setLimitPrice, setAmount, setIsBuy } = useOrderContext();

    // HOOKS
    const take = useTake();
    const borrow = useBorrow();
    const changePrice = useChangePriceFeed();

    // LOADING
    const [showProgress, setShowProgress] = useState(true);

    const [numVisibleOrders, setNumVisibleOrders] = useState<number>(10);
    
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const openMenu = Boolean(anchorEl);

    const handleStepChange = (event: SelectChangeEvent) => {
        setStep(Number(event.target.value)); // Conversion correcte de string à number
    };

    const handleNbOrdersChange = (event: SelectChangeEvent) => {
        setNbOrders(Number(event.target.value));
        setNumVisibleOrders(Number(event.target.value));
    };


    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const fetchEthPrice = async () => {
        const price = await getEthPrice();
        if (price) setEthPrice(String(price));
    };

    const handleAction = async (orderId: number, size: string) => {
        if (isDeposit) {
            await take(orderId, size);
        } else {
            await borrow(orderId, size);
        }
    };


    const handleRowClick = (orderId: number, limitPrice: string, isBuy: boolean) => {
        setSelectedOrderId(orderId);
        setSize(size);
        setLimit(limitPrice);
        setBuy(isBuy);
        setIsBuy(isBuy);
        setOrderId(orderId);
        setLimitPrice(limitPrice);
        setAmount(size);

    };

    const handleEthPriceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEthPrice(event.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleOkClick = () => {
        setShowProgress(true);
        setEthPrice(newEthPrice);
        setIsEditing(false);
        changePrice(newEthPrice);

        setTimeout(() => {
            setShowProgress(false);
        }, 10000);
    };

    const fetchOrders = async () => {
        try {

            const lastOrderId = await orderbookContract.lastOrderId();
            const numPages = Math.ceil(lastOrderId / PAGE_SIZE);
            const ethPriceInEther = ethPrice;
            const ethPriceNumber = ethPriceInEther ? parseFloat(String(ethPriceInEther)) : 0;

            const fetchPromises = Array.from({ length: numPages }, async (_, pageIndex) => {
                const startId = pageIndex * PAGE_SIZE + 1;
                const endId = Math.min(startId + PAGE_SIZE - 1, lastOrderId);

                let fetchedBuyOrders: Order[] = [];
                let fetchedSellOrders: Order[] = [];

                for (let i = startId; i <= endId; i++) {
                    const order = await orderbookContract.orders(i);

                    const orderFormatted = {
                        id: i,
                        limitPrice: ethers.utils.formatUnits(order.price, 'ether'),
                        size: ethers.utils.formatUnits(order.quantity, 'ether'),
                        isBorrowable: order.isBorrowable,
                    };

                    const orderPriceNumber = parseFloat(orderFormatted.limitPrice);

                    if (parseFloat(orderFormatted.size) > 0) {
                        if (order.isBuyOrder && orderPriceNumber < ethPriceNumber)  {
                            fetchedBuyOrders.push(orderFormatted);
                        } else if (!order.isBuyOrder && orderPriceNumber > ethPriceNumber) {
                            fetchedSellOrders.push(orderFormatted);
                        }
                    }
                }

                return { fetchedBuyOrders, fetchedSellOrders };
            });

            const results = await Promise.all(fetchPromises);

            const allBuyOrders = results.flatMap(result => result.fetchedBuyOrders);
            const allSellOrders = results.flatMap(result => result.fetchedSellOrders);
            
            const adjustedBuyOrders = adjustOrdersToStep(allBuyOrders, Number(ethPriceNumber), step);
            const adjustedSellOrders = adjustOrdersToStep(allSellOrders, Number(ethPriceNumber), step);
            
            setBuyOrders(adjustedBuyOrders);
            setSellOrders(adjustedSellOrders);
            
            setShowProgress(false);
        } catch (error) {
            console.error("Erreur : ", error);
            setShowProgress(false);
        }
    };

    const adjustOrdersToStep = (orders: any[], currentPrice: number, step: number) => {
        let adjustedOrders = [];
        let buyThreshold = Math.ceil(currentPrice / step) * step; // Prochain palier au-dessus pour les achats
        let sellThreshold = Math.floor(currentPrice / step) * step; // Prochain palier en dessous pour les ventes

        // Trier les ordres pour faciliter la sélection
        let sortedBuyOrders = orders.filter(o => parseFloat(o.limitPrice) >= currentPrice)
            .sort((a, b) => parseFloat(a.limitPrice) - parseFloat(b.limitPrice));
        let sortedSellOrders = orders.filter(o => parseFloat(o.limitPrice) < currentPrice)
            .sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice));

        // Sélectionner les ordres d'achat ajustés
        for (let price = buyThreshold; sortedBuyOrders.length > 0; price += step) {
            const index = sortedBuyOrders.findIndex(o => parseFloat(o.limitPrice) >= price);
            if (index !== -1) {
                adjustedOrders.push(sortedBuyOrders[index]);
                sortedBuyOrders = sortedBuyOrders.slice(index + 1);
            } else {
                break;
            }
        }

        for (let price = sellThreshold; sortedSellOrders.length > 0; price -= step) {
            const index = sortedSellOrders.findIndex(o => parseFloat(o.limitPrice) <= price);
            if (index !== -1) {
                adjustedOrders.push(sortedSellOrders[index]);
                sortedSellOrders = sortedSellOrders.slice(index + 1);
            } else {
                break;
            }
        }

        return adjustedOrders.sort((a, b) => parseFloat(b.limitPrice) - parseFloat(a.limitPrice)); // Trier les ordres ajustés
    };




    useEffect(() => {
        fetchOrders();
    }, [buyOrders, sellOrders]);

    useEffect(() => {
        fetchEthPrice();
    }, []);


    return (
        <Card sx={{ maxWidth: '1300px', margin: 'auto', background: 'transparent', boxShadow: 'none',
            border: 'none' }}>
            <CardContent
                sx={{
                    width: '100%',
                    p: '1.5rem 2rem 1.5rem 2rem',
                    mb: '2rem',
                }}
            >
           <Box>
                    <table className="orderbook-table rounded-lg border-[5px] border-solid border-[#191b1f] ">
                        <thead>
                        {isDeposit && <tr>
                            <th>Price</th>
                            <th>Size (ETH)</th>
                            <th>Utilization rate</th>
                            <th>Apy</th>
                            <th></th>
                            {/*<th>Order type</th>*/}
                        </tr> }
                        </thead>
                        <tbody>
                        {isDeposit && sellOrders.slice(0, numVisibleOrders).map(order => (
                            <tr key={order.id}
                                className={`sell-row ${selectedOrderId === order.id ? 'selected-row' : ''}`}
                                onClick={() => handleRowClick(order.id, order.limitPrice, false)}
                                style={{ height: '20px' }}>
                                <td>{Number(order.limitPrice).toFixed(2)}</td>
                                <td>{Number(order.size).toFixed(2)}</td>
                                <td className="text-white">44%</td>
                                <td className="text-white">9%</td>
                                {/*{isDeposit && <td className="text-white">BUY</td>}*/}
                                <td className="text-white">{isDeposit ? 'DEPOSIT ETH' : 'BORROW'}</td>
                            </tr>
                        ))}
                        <tr className="eth-price-row">
                            {!isDeposit && <td colSpan={5}>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="number"
                                            value={newEthPrice}
                                            onChange={handleEthPriceChange}
                                            style={{ backgroundColor: 'transparent', color: 'white', border: 'none', width: '100px' }}
                                        />
                                        <button onClick={handleOkClick}>OK</button>
                                        
                                    </>
                                ) : (
                                    <>
                                        ${ethPrice}
                                        <button onClick={handleEditClick} style={{ marginLeft: '10px' }}>
                                            Edit
                                        </button>
                                        {showProgress && <CircularProgress size={10} style={{ marginLeft: '10px' }} />}
                                    </>
                                )}
                            </td> }
                            {isDeposit && <td colSpan={5} style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="number"
                                                value={newEthPrice}
                                                onChange={handleEthPriceChange}
                                                style={{ backgroundColor: 'transparent', color: 'white', border: 'none', width: '100px', marginRight: '10px' }}
                                            />
                                            <button onClick={handleOkClick} style={{ marginRight: '10px' }}>OK</button>
                                        </>
                                    ) : (
                                        <>
                                            ${ethPrice}
                                            <button onClick={handleEditClick} style={{ marginLeft: '10px', marginRight: '20px' }}>
                                                Edit
                                            </button>
                                            {showProgress && <CircularProgress size={10} style={{ marginRight: '20px' }} />}
                                        </>
                                    )}

                                    <div style={{ marginRight: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>Step by</div>
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                                        <Select
                                            id="step-select"
                                            value={step.toString()}
                                            onChange={handleStepChange}
                                            sx={{
                                                '.MuiSelect-select': { color: 'white', marginRight: '10px' },
                                                'svg': { color: 'white' },
                                                '& .MuiMenu-paper': {
                                                    backgroundColor: '#131518',
                                                    boxShadow: 'none', // Supprime les ombres portées qui pourraient inclure des bordures
                                                    // Vous pouvez également essayer 'border: none' si les bordures sont toujours visibles
                                                },
                                                // Styles pour les MenuItem
                                                '& .MuiMenuItem-root': {
                                                    backgroundColor: '#131518', // Couleur de fond par défaut
                                                    color: 'white', // Couleur du texte
                                                    '&:hover': {
                                                        backgroundColor: '#131518', // Garde la même couleur de fond au survol
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={200}>200</MenuItem>
                                            <MenuItem value={500}>500</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <div style={{ marginRight: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>Sort by :</div>
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                                        <Select
                                            id="sort-by-select"
                                            value={numVisibleOrders.toString()} 
                                            onChange={handleNbOrdersChange} 
                                            sx={{
                                                '.MuiSelect-select': { color: 'white', marginRight: '10px' },
                                                'svg': { color: 'white' },
                                                '& .MuiMenu-paper': {
                                                    backgroundColor: '#131518',
                                                    boxShadow: 'none',
                                                },
                                                '& .MuiMenuItem-root': {
                                                    backgroundColor: '#131518',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#131518',
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                        </Select>
                                    </FormControl>

                                </div>
                            </td>}
                            
                        </tr>
                        <tr>
                            <th>Price</th>
                            <th>Size (USDC)</th>
                            <th>Utilization rate</th>
                            <th>Apy</th>
                            {!isDeposit && <th>Max LTV</th> }

                           {/* {isDeposit &&  <th>Order type</th> }*/}
                        </tr>
                        {buyOrders.slice(0, numVisibleOrders).map(order => (
                            <tr key={order.id}
                                className={`buy-row ${selectedOrderId === order.id ? 'selected-row' : ''}`}
                                onClick={() => handleRowClick(order.id, order.limitPrice, true)}
                                style={{ height: '20px' }}>
                                <td>{Number(order.limitPrice).toFixed(2)}</td>
                                <td>{(Number(order.size)).toFixed(2)}</td>
                                <td className="text-white">56%</td>
                                <td className="text-white">{isDeposit ? '7%' : '5.89%'}</td>
                                <td className="text-white">{isDeposit ? 'DEPOSIT USDC' : 'BORROW'}</td>
                                {!isDeposit && <td className="text-white">98%</td> }
                                {/*{isDeposit && <td className="text-white">SELL</td>}*/}
                               {/* <td className="text-white">
                                    {!isDeposit ? '-' :
                                        <button className="sell-button opacity-30 pointer-events-none">
                                            BUY
                                        </button>
                                    }
                                </td> */}
                            </tr>
                        ))}

                        </tbody>
                    </table>
           </Box>
        </CardContent>
      </Card>

    );
};

export default Orderbook;
