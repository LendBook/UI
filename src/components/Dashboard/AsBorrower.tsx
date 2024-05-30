import MetricCustom from "../MetricCustom";
import CustomTable from "../CustomTable";

const collateralWithdrawClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};
const collateralSupplyClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};

const collateralDataColumnsConfig = [
  { key: "sellPrice", title: "Sell Price" },
  { key: "mySupply", title: "My Supply" },
  {
    key: "withdraw",
    title: "",
    isButton: true,
    onButtonClick: collateralWithdrawClick,
  },
  {
    key: "supply",
    title: "",
    isButton: true,
    onButtonClick: collateralSupplyClick,
  },
];

const collateralData = [
  {
    id: 1,
    sellPrice: "5,000 USDC",
    mySupply: "5 WETH",
    withdraw: "Withdraw",
    supply: "Supply more",
  },
];

const borrowRepayClick = (id: number) => {
  console.log(`Button clicked! ${id}`);
};

const borrowDataColumnsConfig = [
  { key: "liquidationPrice", title: "Liquidation Price" },
  { key: "myBorrow", title: "My Borrow" },
  { key: "interestRate", title: "Interest Rate" },
  { key: "utilization", title: "Utilization" },
  { key: "repay", title: "", isButton: true, onButtonClick: borrowRepayClick },
];

const borrowData = [
  {
    id: 1,
    liquidationPrice: "4,000 USDC",
    myBorrow: "6,000 USDC",
    interestRate: "7.8%",
    utilization: "80%",
    repay: "Repay",
  },
];

const AsBorrower = () => {
  return (
    <div>
      <div className="flex mt-10 ">
        <MetricCustom
          data={[
            {
              title: "My total Collateral",
              value: "2",
              unit: "WETH",
            },
            {
              title: "My total Borrows",
              value: "6,000",
              unit: "USDC",
            },
            {
              title: "My Excess Collateral",
              value: "0.12",
              unit: "WETH",
            },
          ]}
        />
      </div>
      <div className="flex mt-10">
        <CustomTable
          title="Collateral deposited as Sell Orders "
          columnsConfig={collateralDataColumnsConfig}
          data={collateralData}
          clickableRows={false}
        />
      </div>
      <div className="flex mt-10">
        <CustomTable
          title="Borrowing Positions"
          columnsConfig={borrowDataColumnsConfig}
          data={borrowData}
          clickableRows={false}
        />
      </div>
    </div>
  );
};

export default AsBorrower;
