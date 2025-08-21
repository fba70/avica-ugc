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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { EventItem, SeenDropItem } from "@/types/types"
import { Button } from "@/components/ui/button"

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

export default function SDDailyStats({ userId }: { userId: string }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(0)
  const pageSize = 5

  useEffect(() => {
    if (events.length > 0) setSelectedIndex(0)
  }, [events])

  useEffect(() => {
    setPage(0)
  }, [chartData])

  const pageCount = Math.ceil(chartData.length / pageSize)
  const paginatedData = chartData.slice(page * pageSize, (page + 1) * pageSize)

  // 1. Fetch events for the user
  useEffect(() => {
    if (!userId) return
    axios
      .get("/api/events", { params: { userId } })
      .then((res) => {
        const sortedEvents = (res.data as EventItem[]).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setEvents(sortedEvents)
        setSelectedIndex(0) // default to earliest event
      })
      .catch(() => setEvents([]))
  }, [userId])

  // console.log("Events", events)

  // 2. Fetch seendrops for selected event only when selectedIndex or events change
  useEffect(() => {
    if (!events.length) return
    const event = events[selectedIndex]
    if (!event) return
    // console.log("Selected event:", event)
    setLoading(true)
    axios
      .get("/api/seendrops", { params: { eventId: event.id } })
      .then((res) => {
        const seendrops = res.data as SeenDropItem[]
        // console.log("SeenDrops for event:", seendrops)
        setChartData(prepareChartData(seendrops, event))
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [selectedIndex, events])

  // console.log("Chart Data", chartData)

  // 3. Prepare chart data: split seendrops by calendar week from event.startDate to event.endDate
  function prepareChartData(
    seendrops: SeenDropItem[],
    event: EventItem
  ): ChartDataItem[] {
    if (!event.startDate || !event.endDate) return []
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return []

    // Calculate week boundaries
    let weekStart = new Date(start)
    const weeks: { start: Date; end: Date }[] = []

    while (weekStart <= end) {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      if (weekEnd > end) weekEnd.setTime(end.getTime())
      weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) })
      weekStart = new Date(weekStart)
      weekStart.setDate(weekStart.getDate() + 7)
    }

    // Count images/videos per week
    const data: ChartDataItem[] = weeks.map((w, i) => {
      const weekDrops = seendrops.filter((sd) => {
        const d = new Date(sd.createdAt)
        return d >= w.start && d <= w.end
      })
      return {
        name: `Week ${i + 1}`,
        images: weekDrops.filter((sd) => sd.type === "image").length,
        videos: weekDrops.filter((sd) => sd.type === "video").length,
      }
    })
    return data
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
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
              disabled={loading || !events.length}
            >
              {events.map((event, idx) => (
                <option value={idx} key={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {loading ? (
            <div className="text-gray-500">Loading data...</div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[265px] w-[400px]"
            >
              <BarChart
                accessibilityLayer
                data={paginatedData}
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
