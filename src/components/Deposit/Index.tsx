import Trade from './Trade';
import Orderbook from '../Orderbook/Orderbook';
import { OrderProvider} from "../Orderbook/OrderContext";

const Index = () => {
    return (
        <OrderProvider>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: '100vh' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                    <Orderbook isTrade={true} />
                </div>
                <div style={{ flex: 1 }}>
                    <Trade />
                </div>
            </div>
        </OrderProvider>
    );
};

export default Index;
