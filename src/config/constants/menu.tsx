import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RepeatIcon from "@mui/icons-material/Repeat";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";

const MENU_LINKS = [
  { id: 1, label: "Markets", to: "/markets" },
  {
    id: 2,
    label: "Lend to Earn",
    to: "/lend",
    icon: <TrendingUpIcon fontSize="small" />,
  },
  {
    id: 3,
    label: "Borrow",
    to: "/borrow",
    icon: <RepeatIcon fontSize="small" />,
  },
  {
    id: 4,
    label: "(Trade)",
    to: "/trade",
    icon: <SwapHorizIcon fontSize="small" />,
  },
  // {
  //   id: 5,
  //   label: "Analytics",
  //   to: "/analytics",
  //   icon: <AlignVerticalBottomIcon fontSize="small" />,
  // },
  { id: 6, label: "(Mint tokens)", to: "/mint" },
  { id: 7, label: "Other links", to: "/ecosystem" },
  //{ id: 7, label: "(Change Price Feed)", to: "/updateprice" },
];

export default MENU_LINKS;
