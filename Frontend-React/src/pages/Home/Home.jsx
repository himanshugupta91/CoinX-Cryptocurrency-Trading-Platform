/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import StockChart from "../StockDetails/StockChart";
import {
  ChatBubbleIcon,
  ChevronLeftIcon,
  Cross1Icon,
  DotIcon,
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
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { sendMessage } from "@/Redux/Chat/Action";
import { ScrollArea } from "@/components/ui/scroll-area";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const { coin, chatBot, auth } = useSelector((store) => store);
  const [isBotRelease, setIsBotRelease] = useState(false); //

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

  const handleBotRelease = () => setIsBotRelease(!isBotRelease);

  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed:", inputValue);
      dispatch(
        sendMessage({
          prompt: inputValue,
          jwt: auth.jwt || localStorage.getItem("jwt"),
        })
      );
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBot.messages]);



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
      <div className="lg:flex">
        <div className="lg:w-[50%] border-r border-purple-500/20">
          <div className="p-3 flex items-center gap-4 ">
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
          <AssetTable
            category={category}
            coins={category == "all" ? coin.coinList : coin.top50}
          />
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

        <div className="hidden lg:block lg:w-[50%] p-5 animate-slideInRight">
          <StockChart coinId={"bitcoin"} />
          <div className="flex gap-5 items-center glass-card card-shine p-4 rounded-xl mt-4 hover-lift border border-purple-500/20">
            <div>
              <Avatar className="h-12 w-12 ring-2 ring-purple-500/50 shadow-lg">
                <AvatarImage src={coin.coinDetails?.image?.large} />
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">{coin.coinDetails?.symbol?.toUpperCase()}</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">{coin.coinDetails?.name}</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold gradient-text">
                  ${coin.coinDetails?.market_data.current_price.usd}
                </p>
                <p
                  className={`font-semibold ${coin.coinDetails?.market_data.market_cap_change_24h < 0
                    ? "text-red-500"
                    : "text-green-500"
                    }`}
                >
                  <span className="">
                    {coin.coinDetails?.market_data.market_cap_change_24h}
                  </span>
                  <span>
                    (
                    {
                      coin.coinDetails?.market_data
                        .market_cap_change_percentage_24h
                    }
                    %)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-2xl w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] glass-card animate-slideUp">
            <div className="flex justify-between items-center border-b border-purple-500/30 px-6 h-[12%]">
              <p className="font-semibold gradient-text">Chat Bot</p>
              <Button onClick={handleBotRelease} size="icon" variant="ghost" className="hover-glow">
                <Cross1Icon />
              </Button>
            </div>

            <div className="h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container">
              <div
                className={`self-start pb-5 w-auto animate-slideInLeft`}
              >
                <div className="justify-end self-end px-5 py-3 rounded-xl glass-card border border-purple-500/30 w-auto">
                  <p className="font-semibold">{`Hi, ${auth.user?.fullName}!`}</p>
                  <p className="text-sm text-gray-400">You can ask crypto related questions</p>
                  <p className="text-sm text-gray-400">like price, market cap, etc...</p>
                </div>

              </div>
              {chatBot.messages.map((item, index) => (
                <div
                  ref={chatContainerRef}
                  key={index}
                  className={`${item.role == "user" ? "self-end" : "self-start"
                    } pb-5 w-auto animate-slideUp`}
                >

                  {item.role == "user" ? (
                    <div className="justify-end self-end px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 w-auto">
                      {item.prompt}
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="glass-card flex gap-2 py-4 px-4 rounded-xl min-w-[15rem] w-full border border-purple-500/20">
                        <p className="">{item.ans}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {chatBot.loading && <p className="text-purple-400 animate-pulse-slow">Fetching data...</p>}
            </div>

            <div className="h-[12%] border-t border-purple-500/30">
              <Input
                className="w-full h-full border-none outline-none bg-transparent focus:ring-2 focus:ring-purple-500/50 rounded-none"
                placeholder="Ask me anything about crypto..."
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        {/* Modern Floating Action Button for Chatbot */}
        <div
          onClick={handleBotRelease}
          className="fixed bottom-8 right-8 z-50 cursor-pointer group"
        >
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-lg opacity-60 group-hover:opacity-100 animate-pulse-slow"></div>

          {/* Main FAB button */}
          <div className="relative">
            <Button
              size="icon"
              className="h-16 w-16 rounded-full btn-gradient shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20"
            >
              {isBotRelease ? (
                <Cross1Icon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <MessageCircle
                  className="h-7 w-7 group-hover:scale-110 transition-transform duration-300"
                />
              )}
            </Button>

            {/* Notification badge */}
            {!isBotRelease && chatBot.messages.length > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                {chatBot.messages.length}
              </div>
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-xl border border-cyan-400/30">
              {isBotRelease ? 'Close Chat' : 'AI Assistant'}
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
