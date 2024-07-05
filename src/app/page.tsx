"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import axios from "axios"
import { Question } from "@prisma/client"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {Loader2} from "lucide-react"

export default function Page() {

  const { data: session, status } = useSession()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const username = session?.user.username
  
  useEffect(() => {
    const getQuestions = async () => {
      const response = await axios.get("/api/get-questions")
      //@ts-ignore
      setQuestions(response.data.questions)
    }
    getQuestions()
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Hello <Badge>{username}</Badge>
        </h1>
        <div>
          <Button className="mr-2" onClick={() => router.push("/add-question")}>
            Create Question
          </Button>
          <Button
            onClick={() => signOut()}
          >
            Log Out
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <Table>
          <TableCaption>A list of your questions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Link</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">IsDone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question: Question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {question.link}
                  </a>
                </TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.note}</TableCell>
                <TableCell className="text-right">
                  {question.isDone ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
