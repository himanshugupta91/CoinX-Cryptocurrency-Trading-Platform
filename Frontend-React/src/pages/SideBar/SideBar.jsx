import { logout } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ExitIcon,
  HandIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  BellIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, SettingsIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: <DashboardIcon className="h-6 w-6" />,
  },

  {
    name: "Watchlist",
    path: "/watchlist",
    icon: <BookmarkIcon className="h-6 w-6" />,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: <ActivityLogIcon className="h-6 w-6" />,
  },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon /> },
  {
    name: "Payment Details",
    path: "/payment-details",
    icon: <LandmarkIcon className="h-6 w-6" />,
  },

  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: <CreditCardIcon className="h-6 w-6" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon className="h-6 w-6" />,
  },

  { name: "Logout", path: "/", icon: <ExitIcon className="h-6 w-6" /> },
];
const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name == "Logout") {
      handleLogout();
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="mt-10 space-y-3">
      {menu.map((item, index) => (
        <div key={item.name} className="animate-slideInLeft" style={{ animationDelay: `${index * 50}ms` }}>
          <SheetClose className="w-full">
            <Button
              onClick={() => handleMenuClick(item)}
              variant="outline"
              className="flex items-center gap-5 py-6 w-full hover-lift border-purple-500/20 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <span className="w-8 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>

              <p className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</p>
            </Button>
          </SheetClose>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
