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
  { name: "Walz in Space", images: 26, videos: 12 },
  { name: "Tennis Esports", images: 18, videos: 10 },
  { name: "Football", images: 32, videos: 20 },
  { name: "VR Party", images: 19, videos: 6 },
  { name: "Garage Rock", images: 25, videos: 9 },
]

const chartConfig = {
  images: {
    label: "Images",
    color: "violet",
  },
  videos: {
    label: "Videos",
    color: "blue",
  },
} satisfies ChartConfig

export default function EventsCount() {
  return (
    <>
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            UGC PER EVENT
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[300px] w-[400px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 0, right: 0, left: -25, bottom: 80 }}
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
              <Bar dataKey="images" fill="violet" radius={4} />
              <Bar dataKey="videos" fill="blue" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
