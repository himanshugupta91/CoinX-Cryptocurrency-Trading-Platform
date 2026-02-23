import { Button } from "@/components/ui/button";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ExitIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Home, PieChart, Bookmark, Activity, Wallet } from "lucide-react";
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { logout } from "@/Redux/Auth/AuthSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Portfolio", path: "/portfolio", icon: <PieChart className="h-4 w-4" /> },
    { name: "Watchlist", path: "/watchlist", icon: <Bookmark className="h-4 w-4" /> },
    { name: "Activity", path: "/activity", icon: <Activity className="h-4 w-4" /> },
    { name: "Wallet", path: "/wallet", icon: <Wallet className="h-4 w-4" /> },
  ];

  return (
    <div className={`navbar sticky top-0 left-0 right-0 z-50 ${theme === "light"
      ? "bg-white/80 border-b border-neutral-200"
      : "bg-black/80 border-b border-neutral-800"
      } backdrop-blur-xl`}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9"
                >
                  <DragHandleHorizontalIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className={`w-72 border-r ${theme === "light"
                  ? "bg-white border-neutral-200"
                  : "bg-black border-neutral-800"
                  }`}
                side="left"
              >
                <SheetHeader>
                  <SheetTitle>
                    <span className={`text-xl font-semibold ${theme === "light" ? "text-black" : "text-white"}`}>
                      CoinX
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <SideBar />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className={`text-xl font-semibold ${theme === "light" ? "text-black" : "text-white"}`}>
                CoinX
              </span>
            </div>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                onClick={() => navigate(link.path)}
                variant="ghost"
                className={`h-9 px-4 rounded-lg text-sm font-medium ${theme === "light"
                  ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Button>
            ))}
          </nav>

          {/* Right: Theme Toggle + Search + Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-lg ${theme === "light"
                ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </Button>

            {/* Search */}
            <Button
              onClick={() => navigate("/search")}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-lg ${theme === "light"
                ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className={`h-9 w-9 cursor-pointer ring-2 ring-offset-2 transition-all hover:ring-violet-500 ${theme === "light"
                    ? "bg-neutral-200 ring-neutral-300 ring-offset-white"
                    : "bg-neutral-800 ring-neutral-700 ring-offset-black"
                    }`}
                >
                  {!auth.user ? (
                    <AvatarIcon className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <AvatarFallback className={`text-sm font-semibold ${theme === "light"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                      }`}>
                      {auth.user?.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className={`w-56 p-2 rounded-xl shadow-xl ${theme === "light"
                  ? "bg-white border-neutral-200"
                  : "bg-neutral-900 border-neutral-800"
                  }`}
              >
                {/* User Info Header */}
                <div className={`px-3 py-3 mb-2 rounded-lg ${theme === "light" ? "bg-neutral-50" : "bg-neutral-800/50"}`}>
                  <p className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {auth.user?.fullName}
                  </p>
                  <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-neutral-400"}`}>
                    {auth.user?.email}
                  </p>
                </div>

                <DropdownMenuItem
                  onClick={() => navigate(auth.user?.role === "ROLE_ADMIN" ? "/admin/withdrawal" : "/profile")}
                  className={`cursor-pointer rounded-lg px-3 py-2.5 ${theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                >
                  <PersonIcon className="mr-3 h-4 w-4" />
                  {auth.user?.role === "ROLE_ADMIN" ? "Admin Panel" : "Profile"}
                </DropdownMenuItem>

                <DropdownMenuSeparator className={`my-2 ${theme === "light" ? "bg-neutral-200" : "bg-neutral-800"}`} />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-red-500 hover:text-white hover:bg-red-500 transition-colors"
                >
                  <ExitIcon className="mr-3 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

