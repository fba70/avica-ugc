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
  { name: "Jan", videos: 160 },
  { name: "Feb", videos: 226 },
  { name: "Mar", videos: 201 },
  { name: "Apr", videos: 151 },
  { name: "May", videos: 200 },
  { name: "Jun", videos: 115 },
  { name: "Jul", videos: 98 },
]

const chartConfig = {
  videos: {
    label: "Videos",
    color: "orange",
  },
} satisfies ChartConfig

export default function MonthlyVideos() {
  return (
    <>
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            VIDEOS PER MONTH
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
              <Bar dataKey="videos" fill="orange" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
