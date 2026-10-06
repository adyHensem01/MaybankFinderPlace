package com.maybank2.maybankAssestment.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.maybank2.maybankAssestment.dto.FavouritePlaceResponse;
import com.maybank2.maybankAssestment.dto.WeatherResponse;
import com.maybank2.maybankAssestment.exception.ThirdPartyApiException;

/**
 * Nested 3rd-party call: Client -> our API -> Open-Meteo (https://open-meteo.com, free, no API key).
 */
@Service
public class WeatherService {

    private final RestClient weatherRestClient;
    private final FavouritePlaceService favouritePlaceService;

    public WeatherService(@Qualifier("weatherRestClient") RestClient weatherRestClient,
            FavouritePlaceService favouritePlaceService) {
        this.weatherRestClient = weatherRestClient;
        this.favouritePlaceService = favouritePlaceService;
    }

    /** Not @Transactional on purpose: the DB read has its own short transaction, the HTTP call runs outside it. */
    public WeatherResponse getWeatherForFavourite(Long favouriteId) {
        FavouritePlaceResponse place = favouritePlaceService.findById(favouriteId);
        OpenMeteoResponse result = fetchCurrentWeather(place);

        OpenMeteoResponse.Current current = result.currentWeather();
        Map<String, String> units = result.units() != null ? result.units() : Map.of();
        WeatherResponse.CurrentWeather weather = new WeatherResponse.CurrentWeather(
                current.time(),
                current.temperature(),
                units.get("temperature"),
                current.windSpeed(),
                units.get("windspeed"),
                current.weatherCode(),
                describe(current.weatherCode()));
        return new WeatherResponse(place, weather);
    }

    private OpenMeteoResponse fetchCurrentWeather(FavouritePlaceResponse place) {
        try {
            OpenMeteoResponse result = weatherRestClient.get()
                    .uri(uri -> uri.path("/forecast")
                            .queryParam("latitude", place.latitude())
                            .queryParam("longitude", place.longitude())
                            .queryParam("current_weather", true)
                            .build())
                    .retrieve()
                    .body(OpenMeteoResponse.class);
            if (result == null || result.currentWeather() == null) {
                throw new ThirdPartyApiException("Weather service returned no data", null);
            }
            return result;
        } catch (RestClientException ex) {
            throw new ThirdPartyApiException("Weather service unavailable", ex);
        }
    }

    /** WMO weather interpretation codes used by Open-Meteo. */
    private static String describe(Integer code) {
        if (code == null) {
            return "Unknown";
        }
        return switch (code) {
            case 0 -> "Clear sky";
            case 1, 2, 3 -> "Partly cloudy";
            case 45, 48 -> "Fog";
            case 51, 53, 55, 56, 57 -> "Drizzle";
            case 61, 63, 65, 66, 67 -> "Rain";
            case 71, 73, 75, 77 -> "Snow";
            case 80, 81, 82 -> "Rain showers";
            case 85, 86 -> "Snow showers";
            case 95, 96, 99 -> "Thunderstorm";
            default -> "Unknown";
        };
    }

    /** Only the fields we need from Open-Meteo's /forecast response. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record OpenMeteoResponse(
            @JsonProperty("current_weather") Current currentWeather,
            @JsonProperty("current_weather_units") Map<String, String> units) {

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Current(
                String time,
                Double temperature,
                @JsonProperty("windspeed") Double windSpeed,
                @JsonProperty("weathercode") Integer weatherCode) {
        }
    }
}
