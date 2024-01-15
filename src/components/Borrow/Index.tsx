import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import BorrowModule from "./BorrowModule";
import Orderbook from "./BorrowOrder";
import {OrderProvider} from "./Ordercontext";

const Index = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <OrderProvider>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? <CircularProgress /> : <Orderbook />
                    }
            </div>
            <div style={{ flex: 1}}>
                <BorrowModule />
            </div>
        </div>
        </OrderProvider>
    );
};

export default Index;
