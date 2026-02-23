/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/AssetSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAllOrdersForUser } from "@/Redux/Order/OrderSlice";
import { calculateProfite } from "@/Util/calculateProfite";
import { readableDate } from "@/Util/readableDate";
import { useTheme } from "@/context/ThemeContext";

const TreadingHistory = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, []);

  return (
    <div className="card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className={`hover:bg-transparent ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Date</TableHead>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Asset</TableHead>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Buy Price</TableHead>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Sell Price</TableHead>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Type</TableHead>
            <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>P/L</TableHead>
            <TableHead className={`text-right ${isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}`}>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.orders?.map((item) => (
            <TableRow key={item.id} className={isLight ? "border-gray-200 hover:bg-gray-50" : "border-neutral-800 hover:bg-neutral-800/50"}>
              <TableCell>
                <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{readableDate(item.timestamp).date}</p>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-neutral-500"}`}>{readableDate(item.timestamp).time}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={item.orderItem.coin.image}
                      alt={item.orderItem.coin.symbol}
                    />
                  </Avatar>
                  <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.orderItem.coin.name}</span>
                </div>
              </TableCell>
              <TableCell className={isLight ? "text-gray-700" : "text-neutral-300"}>${item.orderItem.buyPrice}</TableCell>
              <TableCell className={isLight ? "text-gray-700" : "text-neutral-300"}>{item.orderItem.sellPrice ? `$${item.orderItem.sellPrice}` : "-"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.orderType === "BUY"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
                  }`}>
                  {item.orderType}
                </span>
              </TableCell>
              <TableCell>
                {item.orderType === "SELL" ? (
                  <span className={calculateProfite(item) < 0 ? "text-red-500" : "text-green-500"}>
                    {calculateProfite(item) > 0 ? '+' : ''}{calculateProfite(item)}
                  </span>
                ) : (
                  <span className={isLight ? "text-gray-400" : "text-neutral-500"}>-</span>
                )}
              </TableCell>
              <TableCell className={`text-right font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!order.orders || order.orders.length === 0) && (
        <div className="py-16 text-center">
          <p className={isLight ? "text-gray-500" : "text-neutral-500"}>No trading history</p>
        </div>
      )}
    </div>
  );
};

export default TreadingHistory;
