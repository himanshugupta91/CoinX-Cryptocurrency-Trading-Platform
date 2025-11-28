import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import AccountVarificationForm from "./AccountVarificationForm";
import { VerifiedIcon } from "lucide-react";
import { enableTwoStepAuthentication, verifyOtp, logout } from "@/Redux/Auth/Action";
import { ExitIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEnableTwoStepVerification = (otp) => {
    console.log("EnableTwoStepVerification", otp)
    dispatch(enableTwoStepAuthentication({ jwt: localStorage.getItem("jwt"), otp }))
  }

  const handleVerifyOtp = (otp) => {
    console.log("otp  - ", otp)
    dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }))
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Minimalist Header */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 ring-1 ring-gray-700">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-semibold">
              {auth.user?.fullName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{auth.user?.fullName || "User Profile"}</h1>
            <p className="text-gray-400 text-sm">{auth.user?.email}</p>
          </div>
        </div>
        {/* Personal Information */}
        <Card className="glass-card border-purple-500/20 mb-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Email</span>
                <span className="text-sm">{auth.user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Full Name</span>
                <span className="text-sm">{auth.user?.fullName || "John Doe"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Date of Birth</span>
                <span className="text-sm">25/09/2000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Nationality</span>
                <span className="text-sm">Indian</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Address</span>
                <span className="text-sm">123 Main Street</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">City</span>
                <span className="text-sm">Mumbai</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Postcode</span>
                <span className="text-sm">345020</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Country</span>
                <span className="text-sm">India</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* 2FA */}
          <Card className="glass-card border-purple-500/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">2-Step Verification</CardTitle>
                {auth.user.twoFactorAuth?.enabled ? (
                  <Badge className="bg-green-600 border-0 text-xs">Enabled</Badge>
                ) : (
                  <Badge className="bg-orange-600 border-0 text-xs">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-3">
                Add extra security to your account
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full btn-gradient">
                    Enable Verification
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-center gradient-text">
                      Verify Your Account
                    </DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="glass-card border-purple-500/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Account Status</CardTitle>
                {auth.user.verified ? (
                  <Badge className="bg-green-600 border-0 text-xs">Verified</Badge>
                ) : (
                  <Badge className="bg-orange-600 border-0 text-xs">Pending</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Email</span>
                  <span>{auth.user.email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Mobile</span>
                  <span>+918987667899</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full btn-gradient">Verify Account</Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-center gradient-text">
                      Verify Your Account
                    </DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Card className="glass-card border-red-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-red-400">Logout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-400 mb-3">
              Sign out of your account
            </p>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="border-red-500/50 hover:border-red-500 hover:bg-red-500/10 text-red-400"
            >
              <ExitIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
