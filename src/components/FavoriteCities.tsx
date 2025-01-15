import { useFavorite } from "@/hooks/useFavorite"
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
    id: string,
    name: string,
    lat: number,
    lon: number,
    onRemove: (id: string) => void
}

const FavoriteCities = () => {

    const { favorites, removeFavorite } = useFavorite();

    if (!favorites.length) {
        return null
    }

    return (
        <div className="text-xl font-bold tracking-tight">
            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {favorites.map((city) => {
                        return <FavoriteCityTablet
                            key={city.id}
                            {...city}
                            onRemove={() => removeFavorite.mutate(city.id)}
                        />
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}

const FavoriteCityTablet = ({ id, name, lat, lon, onRemove }: FavoriteCityTabletProps) => {
    const navigate = useNavigate();

    const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

    return (
        <div
            onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
            role="button"
            tabIndex={0}
            className="relative flex min-w-250x cursor-pointer items-center gap-3 rounded-lg border bg-card p-5 pr-8 shadow-sm transition-all hover:shadow-md"
        >
            <Button
                className="absolute right-1 top-1 size-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                    toast.error(`Removed ${name} from Favorites`);
                }}
            >
                <X className="size-4" />
            </Button>

            {isLoading ? (
                <div className="flex h-8 items-center justify-center">
                    <Loader2 className="size-4 animate-spin" />
                </div>
            ) : weather ? (
                <div className="flex gap-10">
                    <div className="flex items-center gap-2">
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                            className="size-8" />
                        <div>
                            <p className="font-medium">
                                {name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {weather.sys.country}
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-xl font-bold">
                            {Math.round(weather.main.temp)}°
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                            {weather.weather[0].description}
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default FavoriteCities