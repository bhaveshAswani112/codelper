"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter()
  return (
    <div className="flex justify-center mt-20">
      <Card className="w-[500px] shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to Codelper</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Organize all your favorite and important DSA questions in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Get started by adding your first question or login to manage your collection.
          </p>
          
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
        <Button onClick={() => {
          router.push("/sign-in")
        }} className="">Login</Button>
        <Button onClick={() => {
          router.push("/sign-up")
        }} >Signup</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
