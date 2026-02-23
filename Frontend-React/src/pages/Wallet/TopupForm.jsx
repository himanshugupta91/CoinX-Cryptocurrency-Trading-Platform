import { paymentHandler } from "@/Redux/Wallet/WalletSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const { wallet } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(
      paymentHandler({
        jwt: localStorage.getItem("jwt"),
        paymentMethod,
        amount,
      })
    );
  };

  return (
    <div className="pt-6 space-y-6">
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Amount</label>
        <Input
          onChange={handleChange}
          value={amount}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500"
          placeholder="Enter amount in USD"
          type="number"
        />
      </div>

      <div>
        <label className="text-sm text-neutral-400 mb-3 block">Payment Method</label>
        <RadioGroup
          onValueChange={(value) => setPaymentMethod(value)}
          className="flex gap-3"
          defaultValue="RAZORPAY"
        >
          <div className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${paymentMethod === "RAZORPAY" ? "border-white bg-neutral-800" : "border-neutral-800"
            }`}>
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-5 w-5"
              value="RAZORPAY"
              id="r1"
            />
            <Label htmlFor="r1" className="cursor-pointer">
              <div className="bg-white rounded px-3 py-1">
                <img
                  className="h-5"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png"
                  alt="Razorpay"
                />
              </div>
            </Label>
          </div>
          <div className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${paymentMethod === "STRIPE" ? "border-white bg-neutral-800" : "border-neutral-800"
            }`}>
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-5 w-5"
              value="STRIPE"
              id="r2"
            />
            <Label htmlFor="r2" className="cursor-pointer">
              <div className="bg-white rounded px-3 py-1">
                <img
                  className="h-5"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/768px-Stripe_Logo%2C_revised_2016.svg.png"
                  alt="Stripe"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {wallet.loading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg"
        >
          Deposit
        </Button>
      )}
    </div>
  );
};

export default TopupForm;
