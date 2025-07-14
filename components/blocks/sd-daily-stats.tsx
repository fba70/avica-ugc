import { useState } from "react"
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

const chartDataEvent1 = [
  { name: "Week 1", images: 26, videos: 12 },
  { name: "Week 2", images: 23, videos: 10 },
  { name: "Week 3", images: 16, videos: 7 },
  { name: "Week 4", images: 10, videos: 3 },
  { name: "Week 5", images: 5, videos: 1 },
]

const chartDataEvent2 = [
  { name: "Week 1", images: 32, videos: 20 },
  { name: "Week 2", images: 28, videos: 14 },
  { name: "Week 3", images: 20, videos: 10 },
  { name: "Week 4", images: 13, videos: 6 },
  { name: "Week 5", images: 7, videos: 3 },
]

const chartDataEvent3 = [
  { name: "Week 1", images: 23, videos: 15 },
  { name: "Week 2", images: 20, videos: 11 },
  { name: "Week 3", images: 16, videos: 8 },
  { name: "Week 4", images: 9, videos: 4 },
  { name: "Week 5", images: 4, videos: 1 },
]

const chartDataEvent4 = [
  { name: "Week 1", images: 31, videos: 18 },
  { name: "Week 2", images: 23, videos: 11 },
  { name: "Week 3", images: 14, videos: 10 },
  { name: "Week 4", images: 9, videos: 5 },
  { name: "Week 5", images: 5, videos: 2 },
]

const chartDataEvent5 = [
  { name: "Week 1", images: 27, videos: 17 },
  { name: "Week 2", images: 20, videos: 14 },
  { name: "Week 3", images: 13, videos: 10 },
  { name: "Week 4", images: 10, videos: 5 },
  { name: "Week 5", images: 3, videos: 0 },
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

const dataSources = [
  { label: "Walz in Space", data: chartDataEvent1 },
  { label: "Tennis Esports", data: chartDataEvent2 },
  { label: "Football", data: chartDataEvent3 },
  { label: "VR Party", data: chartDataEvent4 },
  { label: "Gerage Rock", data: chartDataEvent5 },
]

export default function SDDailyStats() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const chartData = dataSources[selectedIndex].data

  return (
    <>
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            UGC PER EVENT / WEEK
          </CardTitle>
          <CardDescription className="text-center">
            <select
              className="mt-2 px-2 py-1 rounded bg-gray-800 text-white"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {dataSources.map((src, idx) => (
                <option value={idx} key={src.label}>
                  {src.label}
                </option>
              ))}
            </select>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[265px] w-[400px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 0, right: 0, left: -25, bottom: 35 }}
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
              <Bar dataKey="images" fill="red" radius={4} />
              <Bar dataKey="videos" fill="green" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
