import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/WalletSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  ReloadIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/WithdrawalSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const orderId = query.get("order_id");
  const { order_id } = useParams();

  useEffect(() => {
    if (orderId || order_id) {
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId: orderId || order_id,
          paymentId: razorpayPaymentId || "AuedkfeuUe",
          navigate,
        })
      );
    }
  }, [paymentId, orderId, razorpayPaymentId]);

  useEffect(() => {
    handleFetchUserWallet();
    hanldeFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  };

  const hanldeFetchWalletTransactions = () => {
    dispatch(getWalletTransactions({ jwt: localStorage.getItem("jwt") }));
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  if (wallet.loading) {
    return <SpinnerBackdrop />
  }

  if (wallet.error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {wallet.error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Wallet</h1>
        <p className="text-neutral-500">Manage your funds</p>
      </div>

      {/* Balance Card */}
      <Card className="card mb-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                <WalletIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-medium text-white">Balance</CardTitle>
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                  <span>#{wallet.userWallet?.id}</span>
                  <CopyIcon
                    onClick={() => copyToClipboard(wallet.userWallet?.id)}
                    className="h-3 w-3 cursor-pointer hover:text-white"
                  />
                </div>
              </div>
            </div>
            <ReloadIcon
              onClick={handleFetchUserWallet}
              className="w-4 h-4 cursor-pointer text-neutral-500 hover:text-white transition-colors"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-4xl font-semibold text-white">
              ${wallet.userWallet?.balance?.toLocaleString() || '0.00'}
            </span>
          </div>

          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 h-20 card-hover flex flex-col items-center justify-center gap-2">
                  <ArrowDownRight className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-neutral-400">Deposit</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-neutral-800">
                <DialogHeader>
                  <DialogTitle className="text-center text-white">Deposit Funds</DialogTitle>
                </DialogHeader>
                <TopupForm />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 h-20 card-hover flex flex-col items-center justify-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-neutral-400">Withdraw</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-neutral-800">
                <DialogHeader>
                  <DialogTitle className="text-center text-white">Withdraw Funds</DialogTitle>
                </DialogHeader>
                <WithdrawForm />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex-1 h-20 card-hover flex flex-col items-center justify-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-neutral-400">Transfer</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-neutral-800">
                <DialogHeader>
                  <DialogTitle className="text-center text-white">Transfer Funds</DialogTitle>
                </DialogHeader>
                <TransferForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">History</h2>
          <UpdateIcon
            onClick={hanldeFetchWalletTransactions}
            className="h-4 w-4 cursor-pointer text-neutral-500 hover:text-white"
          />
        </div>

        <div className="space-y-2">
          {wallet.transactions?.map((item, index) => (
            <div
              key={index}
              className="card p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                  {item.amount > 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.type || item.purpose}</p>
                  <p className="text-xs text-neutral-500">{item.date}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${item.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                {item.amount > 0 ? '+' : ''}{item.amount} USD
              </span>
            </div>
          ))}

          {(!wallet.transactions || wallet.transactions.length === 0) && (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
