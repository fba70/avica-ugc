"use client"

import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { EventItem } from "@/types/types"
import axios from "axios"

type ChartDataItem = {
  name: string | undefined
  images: number
  videos: number
}

const chartConfig = {
  images: {
    label: "Images",
    color: "violet",
  },
  videos: {
    label: "Videos",
    color: "orange",
  },
} satisfies ChartConfig

export default function EventsCount({ userId }: { userId: string }) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    axios
      .get("/api/events", { params: { userId } })
      .then((res) => {
        const events = res.data as EventItem[]
        const data = events.map((event) => ({
          name:
            event.name && event.name.length > 12
              ? event.name.slice(0, 12) + "..."
              : event.name,
          images: (event.limitImages ?? 0) - (event.imagesCount ?? 0),
          videos: (event.limitVideos ?? 0) - (event.videosCount ?? 0),
        }))
        setChartData(data)
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [userId])

  const pageSize = 5
  const pageCount = Math.ceil(chartData.length / pageSize)
  const paginatedData = chartData.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Card className="bg-secondary w-[420px] shadow-md ">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            UGC PER EVENT
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-[400px]"
            >
              <BarChart
                accessibilityLayer
                data={paginatedData}
                margin={{ top: 0, right: 0, left: -25, bottom: 80 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-90}
                  textAnchor="start"
                  dy={95}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="images" fill="violet" radius={4} />
                <Bar dataKey="videos" fill="orange" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {!loading && pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-0">
          <Button
            className="text-gray-300 disabled:text-gray-300"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Prev
          </Button>
          <span className="px-2 py-1">
            {page + 1} / {pageCount}
          </span>
          <Button
            className="text-gray-300 disabled:text-gray-300"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
