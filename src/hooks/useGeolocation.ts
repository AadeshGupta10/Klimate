import type { Coordinates } from "@/api/types"
import { useEffect, useState } from "react"

interface GeolocationState {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export const useGeolocation = () => {
    const [locationData, setLocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true,
    })

    const getLocation = () => {
        setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

        if (!navigator.geolocation) {
            setLocationData({
                coordinates: null,
                error: "Geolocation is not supported by your browser",
                isLoading: false
            })
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false
            })
        }, (error) => {
            let errMessage: string;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errMessage = "Location Permission Denied. Please enable location access."
                    break;
                case error.POSITION_UNAVAILABLE:
                    errMessage = "Location information is not available."
                    break;
                case error.TIMEOUT:
                    errMessage = "Location request timed out."
                    break;
                default:
                    errMessage = "An Unknown error occured."
            }

            setLocationData({
                coordinates: null,
                error: errMessage,
                isLoading: false
            });
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }

    useEffect(() => {
        getLocation();
    }, [])

    return {
        ...locationData,
        getLocation
    }
}