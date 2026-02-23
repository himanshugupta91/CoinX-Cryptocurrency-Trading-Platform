import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google Login endpoint
    window.location.href = "http://localhost:5454/login/google";
  };

  return (
    <div>
      <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 bg-white text-black hover:bg-neutral-200 border-neutral-800">
        <FcGoogle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default LoginWithGoogle;
