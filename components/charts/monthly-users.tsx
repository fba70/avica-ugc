import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { name: "Jan", users: 560 },
  { name: "Feb", users: 458 },
  { name: "Mar", users: 602 },
  { name: "Apr", users: 695 },
  { name: "May", users: 235 },
  { name: "Jun", users: 425 },
  { name: "Jul", users: 548 },
]

const chartConfig = {
  users: {
    label: "Users",
    color: "fuchsia",
  },
} satisfies ChartConfig

export default function MonthlyUsers() {
  return (
    <>
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            USERS PER MONTH
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[300px] w-[400px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 0, right: 0, left: -25, bottom: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-90}
                textAnchor="end"
                dy={10}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="users" fill="fuchsia" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
