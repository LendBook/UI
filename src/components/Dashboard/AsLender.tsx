import CustomTable from "../CustomTable";

const sellOrdersWithdrawClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};

const sellOrdersDataColumnsConfig = [
  { key: "sellPrice", title: "Sell Price" },
  { key: "mySupply", title: "My Supply" },
  {
    key: "action",
    title: "",
    isButton: true,
    onButtonClick: sellOrdersWithdrawClick,
  },
];

const sellOrdersData = [
  {
    id: 1,
    sellPrice: "4,200 USDC",
    mySupply: "3.3 WETH",
    action: "Withdraw",
  },
];

const buyOrdersWithdrawClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};
const buyOrdersSupplyClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};

const buyOrdersDataColumnsConfig = [
  { key: "buyPrice", title: "Buy Price" },
  { key: "mySupply", title: "My Supply" },
  { key: "netApy", title: "Net APY" },
  { key: "utilization", title: "Utilization" },
  {
    key: "withdraw",
    title: "",
    isButton: true,
    onButtonClick: buyOrdersWithdrawClick,
  },
  {
    key: "supply",
    title: "",
    isButton: true,
    onButtonClick: buyOrdersSupplyClick,
  },
];
const buyOrdersData = [
  {
    id: 1,
    buyPrice: "4,000 USDC",
    mySupply: "30,000 USDC",
    netApy: "3.4%",
    utilization: "60%",
    withdraw: "Withdraw",
    supply: "Supply More",
  },
  {
    id: 2,
    buyPrice: "3,636 USDC",
    mySupply: "20,000 USDC",
    netApy: "3.0%",
    utilization: "60%",
    withdraw: "Withdraw",
    supply: "Supply More",
  },
];

const AsLender = () => {
  return (
    <div>
      <div className="flex mt-10">
        <CustomTable
          title="Sell orders which can be withdraw"
          columnsConfig={sellOrdersDataColumnsConfig}
          data={sellOrdersData}
          clickableRows={false}
        />
      </div>
      <div className="flex mt-10">
        <CustomTable
          title="Buy Orders which earn interest"
          columnsConfig={buyOrdersDataColumnsConfig}
          data={buyOrdersData}
          clickableRows={false}
        />
      </div>
    </div>
  );
};

export default AsLender;
