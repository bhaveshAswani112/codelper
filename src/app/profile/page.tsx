"use client"

import * as React from "react"
import { Loader2, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Question } from "@prisma/client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  type: string
  questions: number
  fill: string
}

const chartConfig = {
  questions: {
    label: "Questions",
  },
  Easy: {
    label: "Easy",
    color: "hsl(var(--chart-1))",
  },
  Medium: {
    label: "Medium",
    color: "hsl(var(--chart-2))",
  },
  Hard: {
    label: "Hard",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig

export default function Page() {
  const { data: session, status } = useSession()
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [totalQuestions, setTotalQuestions] = React.useState(0)

  React.useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get("/api/get-questions")
        const questions: Question[] = response.data.questions

        // Process the questions to get counts of each type
        const counts = { Easy: 0, Medium: 0, Hard: 0 }
        questions.forEach(question => {
          counts[question.difficulty] += 1
        })

        // Prepare the chart data
        const data: ChartData[] = [
          { type: "Easy", questions: counts.Easy, fill: "hsl(var(--chart-1))" },
          { type: "Medium", questions: counts.Medium, fill: "hsl(var(--chart-2))" },
          { type: "Hard", questions: counts.Hard, fill: "hsl(var(--chart-3))" },
        ]

        setChartData(data)
        setTotalQuestions(questions.length)
      } catch (error) {
        console.error("Error fetching questions:", error)
      }
    }

    getQuestions()
  }, [])

  if (status === "loading") {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="h-12 animate-spin" />
      </div>
    )
  }

  if(status != 'authenticated'){
    return (
        <div>
            You are not authorized to view this page
        </div>
    )
  }

  return (
    <Card className="flex flex-col shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="items-center pb-0 bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-semibold">User Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 p-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="questions"
              nameKey="type"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalQuestions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-lg"
                        >
                          Questions
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm p-4 bg-secondary text-secondary-foreground">
        <div className="flex items-center gap-2 font-medium leading-none">
          Increase the number <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
