import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/Action";
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
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
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
      console.log(paymentId, orderId);
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
    // Create a new element
    const element = document.createElement("textarea");
    element.value = text;
    document.body.appendChild(element);

    // Select the text content
    element.select();

    // Try copying the selection using Async Clipboard API
    try {
      const copied = navigator.clipboard.writeText(text);
      copied.then(
        () => {
          console.log("Text copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        }
      );
    } catch (err) {
      console.error(
        "Failed to copy text (fallback to deprecated execCommand): ",
        err
      );
    }

    // Cleanup
    document.body.removeChild(element);
  }

  console.log("order _ id", order_id);
  if (wallet.loading) {
    return <SpinnerBackdrop />
  }

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card className="glass-card border-purple-500/30 hover-lift">
          <CardHeader className="pb-9 ">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon className="h-8 w-8 text-purple-400" />
                <div>
                  <CardTitle className="text-2xl gradient-text">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>

                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-purple-400 hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  className="w-6 h-6 cursor-pointer hover:text-purple-400 hover:rotate-180 transition-all duration-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center glass-card p-4 rounded-xl border border-purple-500/30">
              <DollarSign className="text-green-400" />

              <span className="text-2xl font-semibold gradient-text">
                {wallet.userWallet?.balance}
              </span>
            </div>

            <div className="flex gap-7 mt-5">
              <Dialog className="">
                <DialogTrigger>
                  <div className="h-24 w-24 hover-lift cursor-pointer flex flex-col items-center justify-center rounded-xl glass-card border border-purple-500/30 hover:border-purple-500/60 group">
                    <UploadIcon className="group-hover:scale-110 transition-transform text-green-400" />
                    <span className="text-sm mt-2 ">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 glass-card border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl gradient-text">
                      Top Up Your Wallet
                    </DialogTitle>
                    <TopupForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover-lift cursor-pointer flex flex-col items-center justify-center rounded-xl glass-card border border-purple-500/30 hover:border-purple-500/60 group">
                    <DownloadIcon className="group-hover:scale-110 transition-transform text-orange-400" />
                    <span className="text-sm mt-2">Withdraw</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 glass-card border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl gradient-text">
                      Request Withdrawal
                    </DialogTitle>
                    <WithdrawForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover-lift cursor-pointer flex flex-col items-center justify-center rounded-xl glass-card border border-purple-500/30 hover:border-purple-500/60 group">
                    <ShuffleIcon className="group-hover:scale-110 transition-transform text-blue-400" />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 glass-card border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl gradient-text">
                      Transfer To Other Wallet
                    </DialogTitle>
                    <TransferForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold gradient-text">History</h1>
            <UpdateIcon
              onClick={hanldeFetchWalletTransactions}
              className="p-0 h-7 w-7 cursor-pointer hover:text-purple-400 hover:rotate-180 transition-all duration-500"
            />
          </div>

          {/* <Separator /> */}
          <div className="space-y-3">
            {wallet.transactions?.map((item, index) => (
              <div key={index} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
                <Card className="lg:w-[50] px-5 py-2 flex justify-between items-center glass-card border-purple-500/30 hover-lift">
                  <div className="flex items-center gap-5">
                    <Avatar className="bg-gradient-to-br from-purple-500 to-pink-500">
                      <AvatarFallback>
                        <ShuffleIcon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h1 className="font-semibold">{item.type || item.purpose}</h1>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center font-semibold">
                      {/* <DollarSign className="h-4 w-4" /> */}
                      <span className={`${item.amount > 0 ? "text-green-400" : "text-red-400"}`}>{item.amount} USD</span>
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Wallet;
