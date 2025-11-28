import { Input } from "@/components/ui/input";
// import "./Login.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/Auth/Action";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
// import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(login(data));
    console.log("login form", data);
  };
  return (
    <div className="space-y-5 animate-slideUp">
      <h1 className="text-center text-2xl font-bold gradient-text">Welcome Back</h1>
      <p className="text-center text-gray-400 text-sm">Sign in to continue to CoinX</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border w-full border-purple-500/30 py-5 px-5 bg-transparent focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300 placeholder:text-gray-500"
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password" // Added password field
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password" // Added type attribute for password input
                    className="border w-full border-purple-500/30 py-5 px-5 bg-transparent focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300 placeholder:text-gray-500"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {!auth.loading ? (
            <Button type="submit" className="w-full py-5 btn-gradient hover-lift hover-glow text-white font-semibold">
              Sign In
            </Button>
          ) : (
            <SpinnerBackdrop show={true} />
          )}
        </form>
      </Form>

      {/* {toast({
        title: "Scheduled: Catch up ",
        description: "Friday, February 10, 2023 at 5:57 PM",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      })} */}
    </div>
  );
};

export default LoginForm;
