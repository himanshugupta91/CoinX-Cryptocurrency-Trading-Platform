/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { AssetTable } from "./AssetTable";
import { CryptoCard } from "./CryptoCard";
import { Button } from "@/components/ui/button";
import StockChart from "../StockDetails/StockChart";
import {
  ChevronLeftIcon,
} from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const { coin, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchCoinList(page));
  }, [page]);

  useEffect(() => {
    dispatch(fetchCoinDetails({
      coinId: "bitcoin",
      jwt: auth.jwt || localStorage.getItem("jwt"),
    }))

  }, []);

  useEffect(() => {
    if (category == "top50") {
      dispatch(getTop50CoinList());
    } else if (category == "trading") {
      dispatch(fetchTreadingCoinList())
    }
  }, [category]);

  const handlePageChange = (page) => {
    setPage(page);
  };



  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="relative animate-fadeIn">
      {/* Hero Section */}
      <div className="px-5 pt-8 pb-6 relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300/10 via-cyan-300/10 to-yellow-200/10 blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slideUp">
            <span className="gradient-text">Welcome to CoinX</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Your premier destination for cryptocurrency trading and market analysis.
            Track real-time prices, analyze market trends, and make informed trading decisions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-gray-400 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full hover-lift">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span>Live Market Data</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full hover-lift">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(81,226,245,0.5)]"></div>
              <span>Real-time Charts</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full hover-lift">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,168,182,0.5)]"></div>
              <span>Secure Trading</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full">
          <div className="p-3 flex items-center gap-4 border-b border-purple-500/20">
            <Button
              variant={category == "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
              className={`rounded-full hover-lift ${category == "all" ? "btn-gradient" : "border-purple-500/30"
                }`}
            >
              All
            </Button>
            <Button
              variant={category == "top50" ? "default" : "outline"}
              onClick={() => setCategory("top50")}
              className={`rounded-full hover-lift ${category == "top50" ? "btn-gradient" : "border-purple-500/30"
                }`}
            >
              Top 50
            </Button>
          </div>

          {/* Responsive Grid Layout for Crypto Cards */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
              {(category == "all" ? coin.coinList : coin.top50).map((item, index) => (
                <CryptoCard key={item.id} coin={item} index={index} />
              ))}
            </div>
          </div>

          {category == "all" && (
            <Pagination className="border-t border-purple-500/20 py-3">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page == 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="hover-lift"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(1)}
                    isActive={page == 1}
                    className="hover-lift"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(2)}
                    isActive={page == 2}
                    className="hover-lift"
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(3)}
                    isActive={page == 3}
                    className="hover-lift"
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                {page > 3 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(3)}
                      isActive
                      className="hover-lift"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer hover-lift"
                    onClick={() => handlePageChange(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
