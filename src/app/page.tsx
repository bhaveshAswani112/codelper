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
import { Loader2 } from "lucide-react"

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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Badge className="p-2 bg-blue-500 text-white">{username}</Badge>
          </h1>
          <div>
            <Button
              className="mr-2 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => router.push("/add-question")}
            >
              Create Question
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => signOut()}
            >
              Log Out
            </Button>
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
                      {question.link}
                    </a>
                  </TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>{question.difficulty}</TableCell>
                  <TableCell className="text-right">
                    {question.isDone ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
