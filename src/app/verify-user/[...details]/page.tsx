"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";

// Define the validation schema using Zod
const VerifySchema = z.object({
  code: z.string().length(6, "Your one-time password must be 6 characters."),
});

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (params.details) {
      setEmail(decodeURIComponent(params.details[0]));
      setOrderId(decodeURIComponent(params.details[1]));
    }
  }, [params.details]);

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    const finaldata = {
      email,
      code: data.code,
      orderId,
    };

    try {
      setDisable(true);
      const resp = await axios.post("/api/verify-user", finaldata);
      toast({
        title: "Success",
        description: resp?.data?.message,
      });
      router.replace("/sign-in");
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.response?.data?.message || "OTP verification failed",
        variant: "destructive",
      });
    } finally {
      setDisable(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const resp = await axios.post("/api/resend-otp", { orderId });
      if (resp.status === 200) {
        toast({
          title: "Success",
          description: "OTP sent successfully",
        });
      } else {
        toast({
          title: "Failed",
          description: resp.data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-black">
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button disabled={disable} type="submit" className="w-full bg-blue-500 text-white">
              Submit
            </Button>
          </form>
        </Form>
        <Button
          disabled={disable}
          onClick={handleResendOTP}
          className="w-full mt-4 bg-gray-500 text-white"
        >
          Resend OTP
        </Button>
      </div>
    </div>
  );
};

