import TableCustom from "../TableCustom";

const dataWithdraw = [
  {
    "Sell Price": "4,200 USDC",
    "My Supply": "3.3 WETH",
    Action: "WithdrawButton",
  },
];

const dataBuyOrders = [
  {
    "Buy Price": "4,000 USDC",
    "My Supply": "30,000 USDC",
    "NET APY": "3.4%",
    Utilization: "60%",
    Action: "Withdraw / Supply more",
  },
  {
    "Buy Price": "3,636 USDC",
    "My Supply": "20,000 USDC",
    "NET APY": "3.0%",
    Utilization: "60%",
    Action: "Withdraw / Supply more",
  },
];

const AsLender = () => {
  return (
    <div>
      <div className="flex mt-10">
        <TableCustom
          title="Sell orders which can be withdraw"
          data={dataWithdraw}
          clickableRows={false}
        />
      </div>
      <div className="flex mt-10">
        <TableCustom
          title="Buy Orders which earn interest"
          data={dataBuyOrders}
          clickableRows={false}
        />
      </div>
    </div>
  );
};

export default AsLender;
