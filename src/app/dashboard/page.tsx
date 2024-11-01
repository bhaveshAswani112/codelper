"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { Question } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qstatus, setQStatus] = useState(false);
  const username = session?.user.username;

  useEffect(() => {
    const getQuestions = async () => {
      const response: any = await axios.get("/api/get-questions");
      setQuestions(response.data.questions);
    };
    getQuestions();
  }, []);

  const toggleIsDone = async (id: number, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    try {
      setQStatus(true);
      await axios.put(`/api/update-question/${id}`, { isDone: updatedStatus });
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id ? { ...question, isDone: updatedStatus } : question
        )
      );
    } catch (error: any) {
      console.error("Failed to update question status:", error);
      toast({
        title: "Failed",
        description:
          error.response.data.message || "Something went wrong while fetching questions",
        variant: "destructive",
      });
    } finally {
      setQStatus(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getLogo = (link: string) => {
    const updatedLink = link.toLowerCase();
    
    if (updatedLink.includes("leetcode")) {
      return (
        <img 
          src="/images/leetcode-logo.png" 
          alt="LeetCode Logo" 
          className="w-6 h-6"
        />
      );
    } else if (updatedLink.includes("geeks")) {
      return (
        <img 
          src="/images/gfg-logo.jpeg" 
          alt="GeeksforGeeks Logo" 
          className="w-6 h-6"
        />
      );
    } else if (updatedLink.includes("codechef")) {
      return (
        <img 
          src="/images/codechef-logo.png" 
          alt="CodeChef Logo" 
          className="w-6 h-6"
        />
      );
    } else if (updatedLink.includes("codeforces")) {
      return (
        <img 
          src="/images/codeforces-logo.png" 
          alt="Codeforces Logo" 
          className="w-6 h-6"
        />
      );
    }
    
    return (
      <img 
        src="/images/default.jpg" 
        alt="Codeforces Logo" 
        className="w-6 h-6"
      />
    );;
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            
            
            <Badge onClick={() => {
              router.push("/profile")
            }} className="p-2 bg-blue-500 text-white">{username}</Badge>
          
            
          </h1>
          <div className="hidden sm:flex">
            <Button
              className="mr-2 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => router.push("/add-question")}
            >
              Add Question
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => signOut()}
            >
              Log Out
            </Button>
          </div>
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/add-question")}>
                    Add Question
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <Table>
            <TableCaption className="text-lg font-semibold">
              A list of your questions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Link</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">IsDone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question: Question) => (
                <TableRow key={question.id} className="hover:bg-gray-100">
                  <TableCell className="font-medium">
                    <a
                      href={question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {getLogo(question.link)}
                    </a>
                  </TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.difficulty}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={"outline"}
                      onClick={() => toggleIsDone(question.id, question.isDone)}
                      className={question.isDone ? "bg-green-400" : ""}
                      disabled={qstatus}
                    >
                      {question.isDone ? "Done" : "Not Done"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
