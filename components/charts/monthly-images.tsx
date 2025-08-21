"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
import { EventItem, SeenDropItem } from "@/types/types"

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

type ChartDataItem = {
  name: string
  images: number
  videos: number
}

export default function MonthlyImagesVideos({ userId }: { userId: string }) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pageSize = 5

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    axios
      .get("/api/events", { params: { userId } })
      .then(async (res) => {
        const events = res.data as EventItem[]
        if (!events.length) {
          setChartData([])
          setLoading(false)
          return
        }
        const allSeenDrops: SeenDropItem[] = []
        await Promise.all(
          events.map(async (event) => {
            const dropsRes = await axios.get("/api/seendrops", {
              params: { eventId: event.id },
            })
            allSeenDrops.push(...(dropsRes.data as SeenDropItem[]))
          })
        )
        const monthMap = new Map<string, { images: number; videos: number }>()
        allSeenDrops.forEach((drop) => {
          const date = new Date(drop.createdAt)
          const month = date
            .toLocaleString("en-US", { month: "short" })
            .toUpperCase()
          const year = date.getFullYear().toString().slice(-2)
          const key = `${month}-${year}`
          if (!monthMap.has(key)) {
            monthMap.set(key, { images: 0, videos: 0 })
          }
          const prev = monthMap.get(key)!
          if (drop.type === "image") {
            monthMap.set(key, { ...prev, images: prev.images + 1 })
          } else if (drop.type === "video") {
            monthMap.set(key, { ...prev, videos: prev.videos + 1 })
          }
        })
        const months = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ]
        const data: ChartDataItem[] = Array.from(monthMap.entries())
          .map(([name, { images, videos }]) => ({ name, images, videos }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split("-")
            const [bMonth, bYear] = b.name.split("-")
            if (aYear !== bYear) return Number(aYear) - Number(bYear)
            return months.indexOf(aMonth) - months.indexOf(bMonth)
          })
        setChartData(data)
        setPage(0) // Reset to first page on new data
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    setPage(0)
  }, [chartData])

  const pageCount = Math.ceil(chartData.length / pageSize)
  const paginatedData = chartData.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Card className="bg-secondary w-[420px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            UGC PER MONTH
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {loading ? (
            <div className="text-gray-500">Loading data...</div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-[400px]"
            >
              <BarChart
                accessibilityLayer
                data={paginatedData}
                margin={{ top: 0, right: 0, left: -25, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
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
