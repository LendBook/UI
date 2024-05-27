import TableCustom from "../TableCustom";
import MetricCustom from "../MetricCustom";
import { userInfo } from "os";

const dataCollateral = [
  {
    "Sell Price": "5,000 USDC",
    "My Supply": "5 ETH",
    Action: "Withdraw / Supply more",
  },
];

const dataBorrowingPositions = [
  {
    "Liquidation Price": "4,000 USDC",
    "My Borrow": "6,000 USDC",
    "Interest Rate": "7.8%",
    Utilization: "80%",
    Action: "Repay",
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
        <TableCustom
          title="Collateral deposited as Sell Orders "
          data={dataCollateral}
          clickableRows={false}
        />
      </div>
      <div className="flex mt-10">
        <TableCustom
          title="Borrowing Positions"
          data={dataBorrowingPositions}
          clickableRows={false}
        />
      </div>
    </div>
  );
};

export default AsBorrower;
