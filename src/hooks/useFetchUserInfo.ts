import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

export const useFetchUserInfo = (provider: unknown, walletAddress: unknown) => {
    const [userInfo, setUserInfo] = useState({
        totalDepositsWithQuote: '',
        totalDepositsWithoutQuote: '',
    });
    const [loadingUser, setLoading] = useState(true);
    const [errorUser, setError] = useState<string | null>(null);

    useEffect(() => {
        if (walletAddress && provider) { 
            fetchUserInfo(walletAddress).catch(console.error);
        }
    }, [walletAddress, provider]);

    async function fetchUserInfo(address: any) {
        setLoading(true);
        try {
            const responseWithQuote = await axios.get(`/v1/request/viewUserTotalDeposits/${address}/true`);
            const responseWithoutQuote = await axios.get(`/v1/request/viewUserTotalDeposits/${address}/false`);

            const formattedTotalWithQuote = ethers.utils.formatEther(responseWithQuote.data.result);
            const formattedTotalWithoutQuote = ethers.utils.formatEther(responseWithoutQuote.data.result);
            
            setUserInfo({
                totalDepositsWithQuote: formattedTotalWithQuote,
                totalDepositsWithoutQuote: formattedTotalWithoutQuote,
            });
        } catch (err : any) {
            const errorMessage = `Failed to fetch user info: ${err.message}`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return { userInfo, loadingUser, errorUser };
};

