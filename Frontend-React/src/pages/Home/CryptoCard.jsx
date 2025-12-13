import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CryptoCard({ coin, index }) {
    const navigate = useNavigate();

    // Format large numbers with abbreviations
    const formatNumber = (num) => {
        if (num >= 1e9) {
            return `$${(num / 1e9).toFixed(2)}B`;
        } else if (num >= 1e6) {
            return `$${(num / 1e6).toFixed(2)}M`;
        } else if (num >= 1e3) {
            return `$${(num / 1e3).toFixed(2)}K`;
        }
        return `$${num?.toFixed(2)}`;
    };

    const formatPrice = (price) => {
        if (price >= 1) {
            return `$${price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
        return `$${price?.toFixed(6)}`;
    };

    const isPositive = coin.market_cap_change_percentage_24h >= 0;

    return (
        <div
            onClick={() => navigate(`/market/${coin.id}`)}
            className="glass-card p-5 rounded-xl hover-lift cursor-pointer border border-purple-500/20 modern-card animate-fadeIn"
        >
            {/* Top Section - Rank, Logo, Name */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold text-sm">#{index + 1}</span>
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
                        <AvatarImage src={coin.image} alt={coin.symbol} />
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-lg gradient-text">{coin.name}</h3>
                        <p className="text-sm text-gray-400 uppercase font-medium">{coin.symbol}</p>
                    </div>
                </div>
            </div>

            {/* Middle Section - Price and Change */}
            <div className="mb-4 pb-4 border-b border-purple-500/20">
                <p className="text-2xl font-bold text-white mb-2">
                    {formatPrice(coin.current_price)}
                </p>
                <div
                    className={`flex items-center gap-2 ${isPositive ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {isPositive ? (
                        <TrendingUp className="h-5 w-5" />
                    ) : (
                        <TrendingDown className="h-5 w-5" />
                    )}
                    <span className="font-semibold text-lg">
                        {isPositive ? "+" : ""}
                        {coin.market_cap_change_percentage_24h?.toFixed(2)}%
                    </span>
                    <span className="text-sm text-gray-400">24h</span>
                </div>
            </div>

            {/* Bottom Section - Market Cap and Volume */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase font-medium">Market Cap</p>
                    <p className="text-sm font-bold text-gray-300">
                        {formatNumber(coin.market_cap)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase font-medium">24h Volume</p>
                    <p className="text-sm font-bold text-gray-300">
                        {formatNumber(coin.total_volume)}
                    </p>
                </div>
            </div>
        </div>
    );
}
