/* eslint-disable no-unused-vars */
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/Redux/Auth/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
});
const SignupForm = () => {
  const { auth } = useSelector(store => store)

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });
  const onSubmit = (data) => {
    data.navigate = navigate
    dispatch(register(data))
    console.log("signup form", data);
  };
  return (
    <div className="space-y-5 animate-slideUp">
      <h1 className="text-center text-2xl font-bold gradient-text">Create Account</h1>
      <p className="text-center text-gray-400 text-sm">Join CoinX and start trading</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-purple-500/30 py-5 px-5 bg-transparent focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300 placeholder:text-gray-500"
                    placeholder="Enter your full name"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border w-full border-purple-500/30 py-5 px-5 bg-transparent focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300 placeholder:text-gray-500"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          {!auth.loading ? <Button type="submit" className="w-full py-5 btn-gradient hover-lift hover-glow text-white font-semibold">
            Create Account
          </Button> : <SpinnerBackdrop show={true} />}
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
