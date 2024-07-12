"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/sign-up", data);
      console.log(response)
      if (!response.data.success) {
        toast({
          title: "Failed",
          description: response.data.message,
          variant: "destructive",
        });
        return;
      }
      const orderId = response.data.orderId
      toast({
        title: "Success",
        description: "Enter the otp sent to your email",
      });
      router.push(`/verify-user/${data.email}/${orderId}`)
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed",
        description: error.response.data.message || "Sign-Up failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" type="password" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <p>Already have an account?</p>
        <Link href="/sign-in">
          <Button variant="link" className="text-blue-500">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  );
}
