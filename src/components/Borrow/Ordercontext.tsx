import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextType {
    orderId: number | null;
    setOrderId: (id: number | null) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
    const [orderId, setOrderId] = useState<number | null>(null);

    return (
        <OrderContext.Provider value={{ orderId, setOrderId }}>
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
