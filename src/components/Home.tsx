import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Trade from './Trade';
import Orderbook from './Deposit/Orderbook';

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? <CircularProgress /> : <Orderbook />}
            </div>
            <div style={{ flex: 1 }}>
                <Trade />
            </div>
        </div>
    );
};

export default Home;
