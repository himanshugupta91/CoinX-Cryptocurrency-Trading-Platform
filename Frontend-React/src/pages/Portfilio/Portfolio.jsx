/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "../Home/AssetTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TreadingHistory from "./TreadingHistory";
import { useNavigate } from "react-router-dom";

const tab = ["portfolio", "history"];
const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset } = useSelector((store) => store);
  // const [activeTab, setActiveTab] = useState("portfolio");

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
  }, []);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  console.log("currentTab-----", currentTab);
  return (
    <div className="px-10 py-5 mt-10 animate-fadeIn">
      <div className="pb-5 flex items-center gap-5">
        <Select
          onValueChange={handleTabChange}
          defaultValue="portfolio"
          className=""
        >
          <SelectTrigger className="w-[180px] py-[1.2rem] glass-card border-purple-500/30 hover:border-purple-500/60">
            <SelectValue placeholder="Select Portfolio" />
          </SelectTrigger>
          <SelectContent className="glass-card border-purple-500/30">
            <SelectItem value="portfolio" className="hover:bg-purple-500/20">Portfolio</SelectItem>
            <SelectItem value="history" className="hover:bg-purple-500/20">History</SelectItem>
          </SelectContent>
        </Select>

        {/* {tab.map((item) => (
          <Button
          key={item}
            className="rounded-full"
            size="lg"
            onClick={() => setActiveTab(item)}
            variant={activeTab == item ? "secondary" : "outline"}
          >
            {item.toUpperCase()}
          </Button>
        ))} */}
      </div>
      {
        currentTab == "portfolio" ? (
          <Table className="px-5 relative glass-card rounded-xl border border-purple-500/30">
            <TableHeader className="py-9">
              <TableRow className="sticky top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-purple-500/30">
                <TableHead className="py-3 font-semibold">Assets</TableHead>
                <TableHead className="font-semibold">PRICE</TableHead>
                <TableHead className="font-semibold">UNIT</TableHead>
                <TableHead className="font-semibold">CHANGE</TableHead>
                <TableHead className="font-semibold">CHANGE(%)</TableHead>
                <TableHead className="text-right font-semibold">VALUE</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {asset.userAssets?.map((item, index) => (
                <TableRow
                  onClick={() => navigate(`/market/${item.coin.id}`)}
                  key={item.id}
                  className="hover:bg-purple-500/10 cursor-pointer transition-colors border-purple-500/20 animate-slideUp"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Avatar className="-z-50 ring-2 ring-purple-500/50">
                      <AvatarImage
                        src={item.coin.image}
                        alt={item.coin.symbol}
                      />
                    </Avatar>
                    <span className="font-semibold"> {item.coin.name}</span>
                  </TableCell>
                  <TableCell className="font-semibold">${item.coin.current_price}</TableCell>
                  <TableCell className="font-semibold">{item.quantity}</TableCell>
                  <TableCell
                    className={`font-semibold ${item.coin.price_change_percentage_24h < 0
                      ? "text-red-400"
                      : "text-green-400"
                      }`}
                  >
                    {item.coin.price_change_24h}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${item.coin.price_change_percentage_24h < 0
                      ? "text-red-400"
                      : "text-green-400"
                      }`}
                  >
                    {item.coin.price_change_percentage_24h}%
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    ${(item.coin.current_price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <TreadingHistory />
        )
        // <div className="flex items-center justify-center h-[70vh]">
        //   <h1 className="text-3xl font-semibold">No History Available</h1>
        //   </div>
      }
    </div>
  );
};

export default Portfolio;
