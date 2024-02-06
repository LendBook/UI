// OrderContext.tsx
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface OrderContextType {
    orderId: number | null;
    setOrderId: Dispatch<SetStateAction<number | null>>;
    limitPrice: string | null;
    setLimitPrice: Dispatch<SetStateAction<string | null>>;
    amount: string | null;
    setAmount: Dispatch<SetStateAction<string | null>>;
    isBuy: boolean | null;
    setIsBuy : Dispatch<SetStateAction<boolean | null>>;
}

const OrderContext = createContext<OrderContextType | null>(null);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
    const [orderId, setOrderId] = useState<number | null>(null);
    const [limitPrice, setLimitPrice] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | null>(null);
    const [isBuy, setIsBuy] = useState<boolean | null>(null);

    return (
        <OrderContext.Provider value={{ orderId, setOrderId, limitPrice, setLimitPrice, amount, setAmount, isBuy, setIsBuy}}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within a OrderProvider');
    }
    return context;
};
