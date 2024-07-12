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
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link

const formSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(1, "Password is required"),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (response?.error) {
        console.log(response);
        toast({
          title: "Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Sign in Success",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed",
        description: error.response.data.message || "Sign in failed",
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
            Submit
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
      <p>{`Don't have an account?`}</p>
        <Link href="/sign-up">
          <Button variant="link" className="text-blue-500">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
