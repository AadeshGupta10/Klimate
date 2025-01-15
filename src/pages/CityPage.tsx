import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemperature from "@/components/HourlyTemperature";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FavoriteButton from "@/components/ui/favorite-button";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useWeatherQuery, useForecastQuery } from "@/hooks/useWeather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"

const CityPage = () => {

    const [searchParams] = useSearchParams();
    const params = useParams();

    const lat = parseFloat(searchParams.get("lat") || "0")
    const lon = parseFloat(searchParams.get("lon") || "0")

    const coordinates = { lat, lon };

    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);

    if (weatherQuery.error || forecastQuery.error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">
                    <p>Failed to fetch weather data. Please try again.</p>
                </AlertDescription>
            </Alert>
        )
    }

    if (!weatherQuery.data || !forecastQuery.data || !params.city) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-4">
            {/* Favorite Cities */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">{params.city}, {weatherQuery.data.sys.country}</h1>

                {/* Add to Favorite */}
                <FavoriteButton data={{ ...weatherQuery.data, name: params.city }} />
            </div>

            <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                    {/*Current Weather*/}
                    <CurrentWeather data={weatherQuery.data} />
                    {/*Hourly Temperature*/}
                    <HourlyTemperature data={forecastQuery?.data} />
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-start">
                    {/* Details */}
                    <WeatherDetails data={weatherQuery.data} />
                    {/* Forecast */}
                    <WeatherForecast data={forecastQuery.data} />
                </div>
            </div>
        </div>
    )
}

export default CityPage