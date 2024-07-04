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





export default function Page() {
  const [questions,setQuestions] = useState<Question[]>([])

  useEffect(() => {
    const getQuestions = async () => {
      const response = await axios.get("/api/get-questions")
      //@ts-ignore
      setQuestions(response.data.questions)
    }
    getQuestions()
  }, [])
  return (
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
        {questions.map((question : Question) => (
          <TableRow key={question.id}>
            <TableCell className="font-medium">{question.link}</TableCell>
            <TableCell>{question.difficulty}</TableCell>
            <TableCell>{question.isDone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
  )
}
