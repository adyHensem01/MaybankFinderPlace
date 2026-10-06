package com.maybank2.maybankAssestment.dto;

/** A favourite place combined with its current weather from Open-Meteo. */
public record WeatherResponse(
        FavouritePlaceResponse place,
        CurrentWeather weather) {

    public record CurrentWeather(
            String time,
            Double temperature,
            String temperatureUnit,
            Double windSpeed,
            String windSpeedUnit,
            Integer weatherCode,
            String description) {
    }
}
