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
  { name: "Jan", images: 260 },
  { name: "Feb", images: 158 },
  { name: "Mar", images: 302 },
  { name: "Apr", images: 195 },
  { name: "May", images: 215 },
  { name: "Jun", images: 125 },
  { name: "Jul", images: 248 },
]

const chartConfig = {
  images: {
    label: "Images",
    color: "yellow",
  },
} satisfies ChartConfig

export default function MonthlyImages() {
  return (
    <>
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            IMAGES PER MONTH
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
              <Bar dataKey="images" fill="yellow" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
