import type { ForecastData } from "@/api/types"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
    data: ForecastData
}

interface DailyForecast {
    date: number,
    temp_min: number,
    temp_max: number,
    humidity: number,
    wind: number,
    weather: {
        id: number,
        main: string,
        description: string,
        icon: string
    };
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {

    const dailyForecast = data.list.reduce((acc, forecast) => {
        const date = format(new Date(forecast.dt * 1000), "yyyy-mmd-dd");
        if (!acc[date]) {
            acc[date] = {
                temp_min: forecast.main.temp_min,
                temp_max: forecast.main.temp_max,
                humidity: forecast.main.humidity,
                wind: forecast.wind.speed,
                weather: forecast.weather[0],
                date: forecast.dt
            };
        }
        else {
            acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min)
            acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max)
        }
        return acc
    }, {} as Record<string, DailyForecast>)

    const nextDays = Object.values(dailyForecast).slice(0, 6);

    const formatTemp = (temp: number) => {
        return `${Math.round(temp)}°`
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>5 Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    {nextDays.map((day) => {
                        return (
                            <div key={day.date}
                                className="grid grid-cols-2 items-center gap-4 rounded-lg border p-4">
                                {/* Date and Weather Description */}
                                <div>
                                    <p className="font-medium">
                                        {format(new Date(day.date * 1000), "EEE, MMM d")}
                                    </p>
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {day.weather.description}
                                    </p>
                                </div>

                                <div className="flex gap-2 flex-col md:flex-row">
                                    {/* Min and Max Temperature */}
                                    <div className="flex justify-center gap-4">
                                        <span className="flex items-center text-blue-500">
                                            <ArrowDown className="mr-1 size-4" />
                                            {formatTemp(day.temp_min)}
                                        </span>
                                        <span className="flex items-center text-red-500">
                                            <ArrowUp className="mr-1 size-4" />
                                            {formatTemp(day.temp_max)}
                                        </span>
                                    </div>

                                    {/* Humidity and Wind */}
                                    <div className="flex justify-center gap-4">
                                        <span className="flex items-center">
                                            <Droplets className="mr-1 size-4 text-blue-500" />
                                            <span className="text-sm">
                                                {day.humidity}%
                                            </span>
                                        </span>
                                        <span className="flex items-center">
                                            <Wind className="mr-1 size-4 text-blue-500" />
                                            <span className="text-sm">
                                                {day.wind}m/s
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>

    )
}

export default WeatherForecast