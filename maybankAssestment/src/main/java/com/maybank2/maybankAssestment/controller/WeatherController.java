package com.maybank2.maybankAssestment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maybank2.maybankAssestment.dto.WeatherResponse;
import com.maybank2.maybankAssestment.service.WeatherService;

@RestController
@RequestMapping("/api/v1/favourites")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    /** Client -> this API -> Open-Meteo (3rd party) -> combined response. */
    @GetMapping("/{id}/weather")
    public WeatherResponse getWeather(@PathVariable Long id) {
        return weatherService.getWeatherForFavourite(id);
    }
}
