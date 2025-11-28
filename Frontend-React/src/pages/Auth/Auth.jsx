/* eslint-disable no-unused-vars */
import "./Auth.css";
import { Button } from "@/components/ui/button";

import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordForm from "./ForgotPassword";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import CustomeToast from "@/components/custome/CustomeToast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const { toast } = useToast();

  const [animate, setAnimate] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  console.log("---------- ", auth.error)


  return (
    <div className={`authContainer h-screen relative flex items-center justify-center overflow-hidden`}>
      {/* Subtle accent elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl"></div>

      {/* Main container with split layout */}
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center p-8">
        <div className="w-full h-[90vh] max-h-[700px] flex rounded-3xl overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10">

          {/* Left side - Branding/Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
              {/* Logo */}
              <div className="mb-8">
                <h1 className="text-7xl font-bold mb-4">
                  <span className="gradient-text-orange">Coin</span>
                  <span className="gradient-text">X</span>
                </h1>
              </div>

              {/* Tagline */}
              <div className="space-y-4 animate-slideUp">
                <h2 className="text-4xl font-bold text-white">
                  Crypto Trading
                </h2>
                <h3 className="text-3xl font-light text-white/90">
                  Made Simple
                </h3>
                <p className="text-lg text-white/70 mt-6 max-w-md">
                  Trade cryptocurrencies with confidence. Real-time data, secure transactions, and powerful analytics.
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-12 left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute top-12 right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900/95 to-slate-800/95 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md space-y-8">
              <CustomeToast show={auth.error} message={auth.error?.error} />

              {/* Mobile logo - only show on small screens */}
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-5xl font-bold">
                  <span className="gradient-text-orange">Coin</span>
                  <span className="gradient-text">X</span>
                </h1>
              </div>

              {location.pathname == "/signup" ? (
                <div className="w-full animate-slideUp">
                  <SignupForm />

                  <div className="flex items-center justify-center mt-6">
                    <span className="text-gray-400">Already have an account? </span>
                    <Button
                      onClick={() => handleNavigation("/signin")}
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              ) : location.pathname == "/forgot-password" ? (
                <div className="w-full animate-slideUp">
                  <ForgotPasswordForm />
                  <div className="flex items-center justify-center mt-6">
                    <span className="text-gray-400">Back to </span>
                    <Button onClick={() => navigate("/signin")} variant="ghost" className="text-purple-400 hover:text-purple-300">
                      Sign In
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full animate-slideUp">
                  <LoginForm />

                  <div className="flex items-center justify-center mt-6">
                    <span className="text-gray-400">Don't have an account? </span>
                    <Button
                      onClick={() => handleNavigation("/signup")}
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate("/forgot-password")}
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-purple-300"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
