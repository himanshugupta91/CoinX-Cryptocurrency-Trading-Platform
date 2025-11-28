import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  DashboardIcon,
  BookmarkIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useSelector } from "react-redux";
import { WalletIcon, CreditCardIcon, LandmarkIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const handleNavigate = () => {
    if (auth.user) {
      auth.user.role === "ROLE_ADMIN" ? navigate("/admin/withdrawal") : navigate("/profile")
    }
  }

  // Main navigation items
  const navLinks = [
    { name: "Home", path: "/", icon: <HomeIcon className="h-4 w-4" /> },
    { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-4 w-4" /> },
    { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-4 w-4" /> },
    { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-4 w-4" /> },
    { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-4 w-4" /> },
    { name: "Payment Details", path: "/payment-details", icon: <LandmarkIcon className="h-4 w-4" /> },
    { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-4 w-4" /> },
  ];

  return (
    <>
      <div className="glass-navbar backdrop-blur-xl border-b border-purple-500/10 sticky top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-10 w-10 rounded-xl hover:bg-purple-500/10"
                  >
                    <DragHandleHorizontalIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-72 glass-panel border-r border-purple-500/20" side="left">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="text-2xl flex justify-center items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png" />
                        </Avatar>
                        <div>
                          <span className="font-bold gradient-text-orange">Coin</span>
                          <span className="gradient-text">X</span>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <SideBar />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all">
                  <AvatarImage src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png" />
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-base font-bold leading-tight">
                    <span className="gradient-text-orange">Coin</span>
                    <span className="gradient-text">X</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <Button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  variant="ghost"
                  className="h-9 px-3 rounded-lg hover:bg-purple-500/10 transition-all duration-300 group animate-fadeIn relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <span className="mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{link.icon}</span>
                  <span className="text-sm relative z-10">{link.name}</span>

                  {/* Bottom border animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                </Button>
              ))}
            </nav>

            {/* Right: Search + Profile */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                onClick={() => navigate("/search")}
                variant="ghost"
                className="h-11 px-5 rounded-xl hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-base font-medium">Search</span>
              </Button>

              {/* Profile */}
              <Avatar
                onClick={handleNavigate}
                className="h-9 w-9 cursor-pointer ring-2 ring-purple-500/20 hover:ring-purple-500/50 transition-all hover:scale-105"
              >
                {!auth.user ? (
                  <AvatarIcon className="h-5 w-5" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold">
                    {auth.user?.fullName[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Navbar;
