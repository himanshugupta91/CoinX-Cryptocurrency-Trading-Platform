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
import { enableTwoStepAuthentication, verifyOtp, logout } from "@/Redux/Auth/AuthSlice";
import {
  ExitIcon,
  PersonIcon,
  LockClosedIcon,
  CheckCircledIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  GlobeIcon,
  HomeIcon
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Shield, MapPin, Calendar, Flag } from "lucide-react";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleEnableTwoStepVerification = (otp) => {
    dispatch(enableTwoStepAuthentication({ jwt: localStorage.getItem("jwt"), otp }))
  }

  const handleVerifyOtp = (otp) => {
    dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }))
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const personalInfo = [
    { icon: EnvelopeClosedIcon, label: "Email", value: auth.user?.email },
    { icon: PersonIcon, label: "Full Name", value: auth.user?.fullName },
    { icon: Calendar, label: "Date of Birth", value: "25/09/2000" },
    { icon: Flag, label: "Nationality", value: "Indian" },
  ];

  const addressInfo = [
    { icon: HomeIcon, label: "Address", value: "123 Main Street" },
    { icon: MapPin, label: "City", value: "Mumbai" },
    { icon: GlobeIcon, label: "Country", value: "India" },
    { icon: null, label: "Postcode", value: "345020" },
  ];

  return (
    <div className="min-h-screen animate-fadeIn">
      {auth.loading && <SpinnerBackdrop />}
      {auth.error && <div className="flex justify-center items-center h-screen text-red-500">Error: {auth.error}</div>}
      {!auth.user && !auth.loading && !auth.error && <div className="flex justify-center items-center h-screen">Please login to view profile</div>}
      {auth.user && (
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Profile Header */}
          <div className={`relative rounded-2xl p-8 mb-8 overflow-hidden ${isLight ? "bg-gradient-to-br from-gray-100 to-gray-50" : "bg-gradient-to-br from-neutral-900 to-neutral-800"}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? '#000' : '#fff'} 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Large Avatar */}
              <div className="relative">
                <Avatar className={`h-24 w-24 ring-4 ${isLight ? "ring-white shadow-lg" : "ring-neutral-700"}`}>
                  <AvatarFallback className={`text-3xl font-bold ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                    {auth.user?.fullName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {auth.user?.verified && (
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white dark:ring-neutral-900">
                    <CheckCircledIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className={`text-3xl font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                  {auth.user?.fullName}
                </h1>
                <p className={`text-base mb-4 ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                  {auth.user?.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className={`px-3 py-1 ${auth.user?.verified
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"}`}>
                    {auth.user?.verified ? "✓ Verified Account" : "⏳ Pending Verification"}
                  </Badge>
                  <Badge className={`px-3 py-1 ${auth.user?.twoFactorAuth?.enabled
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"}`}>
                    {auth.user?.twoFactorAuth?.enabled ? "🔒 2FA Enabled" : "2FA Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className={`rounded-xl ${isLight
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-red-500/30 text-red-500 hover:bg-red-500/10"}`}
                >
                  <ExitIcon className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">

            {/* Personal Information */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <PersonIcon className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {personalInfo.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? "border-gray-100" : "border-neutral-800"}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-neutral-500"}`} />}
                      <span className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-400"}`}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {addressInfo.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? "border-gray-100" : "border-neutral-800"}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-neutral-500"}`} />}
                      <span className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-400"}`}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Security Section */}
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            <Shield className="h-5 w-5" />
            Security Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 2FA Card */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${auth.user?.twoFactorAuth?.enabled
                    ? "bg-green-500/10"
                    : isLight ? "bg-gray-100" : "bg-neutral-800"
                    }`}>
                    <LockClosedIcon className={`h-6 w-6 ${auth.user?.twoFactorAuth?.enabled ? "text-green-500" : isLight ? "text-gray-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Two-Factor Authentication
                      </h3>
                      <Badge className={`text-xs ${auth.user?.twoFactorAuth?.enabled
                        ? "bg-green-500/10 text-green-500"
                        : "bg-orange-500/10 text-orange-500"} border-0`}>
                        {auth.user?.twoFactorAuth?.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                      {auth.user?.twoFactorAuth?.enabled
                        ? "Your account is protected with 2FA"
                        : "Add an extra layer of security to your account"}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className={`rounded-lg ${isLight
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black hover:bg-neutral-200"}`}
                        >
                          {auth.user?.twoFactorAuth?.enabled ? "Manage 2FA" : "Enable 2FA"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`rounded-2xl ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
                        <DialogHeader>
                          <DialogTitle className={`text-center ${isLight ? "text-gray-900" : "text-white"}`}>
                            Verify Your Account
                          </DialogTitle>
                        </DialogHeader>
                        <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Verification Card */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${auth.user?.verified
                    ? "bg-green-500/10"
                    : isLight ? "bg-gray-100" : "bg-neutral-800"
                    }`}>
                    <CheckCircledIcon className={`h-6 w-6 ${auth.user?.verified ? "text-green-500" : isLight ? "text-gray-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Account Verification
                      </h3>
                      <Badge className={`text-xs ${auth.user?.verified
                        ? "bg-green-500/10 text-green-500"
                        : "bg-orange-500/10 text-orange-500"} border-0`}>
                        {auth.user?.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                      {auth.user?.verified
                        ? "Your identity has been verified"
                        : "Verify your identity to unlock all features"}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className={`rounded-lg ${isLight
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black hover:bg-neutral-200"}`}
                        >
                          {auth.user?.verified ? "View Status" : "Verify Now"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`rounded-2xl ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
                        <DialogHeader>
                          <DialogTitle className={`text-center ${isLight ? "text-gray-900" : "text-white"}`}>
                            Verify Your Account
                          </DialogTitle>
                        </DialogHeader>
                        <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default Profile;
