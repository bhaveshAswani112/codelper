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
import { useRouter } from "next/navigation";
import { difficulty } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { title } from "process";
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title : z.string({message : "title is required"}),
  link: z.string().url("URL is required"),
  difficulty: z.enum([difficulty.Easy, difficulty.Medium, difficulty.Hard]),
  isDone: z.boolean(),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title : "",
      link: "",
      difficulty: difficulty.Easy,
      isDone: true,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/create-question", data);
      toast({
        title: "Success",
        description: response?.data?.message,
      });
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed",
        description: error.response?.data?.message || "Error while adding question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Question</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Give a title to your question" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Paste your question link" {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select the difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Difficulty</SelectLabel>
                        <SelectItem value={difficulty.Easy}>Easy</SelectItem>
                        <SelectItem value={difficulty.Medium}>Medium</SelectItem>
                        <SelectItem value={difficulty.Hard}>Hard</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDone"
            render={({ field, fieldState }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                </div>
                </FormControl>
                <FormLabel className="ml-2">Is Done</FormLabel>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
