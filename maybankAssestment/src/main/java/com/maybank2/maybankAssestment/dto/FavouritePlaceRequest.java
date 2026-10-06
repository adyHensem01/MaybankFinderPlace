package com.maybank2.maybankAssestment.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Body for creating (POST) or updating (PUT) a favourite place. */
public record FavouritePlaceRequest(
        @NotBlank @Size(max = 255) String googlePlaceId,
        @NotBlank @Size(max = 255) String name,
        @Size(max = 500) String address,
        @NotNull @DecimalMin("-90") @DecimalMax("90") BigDecimal latitude,
        @NotNull @DecimalMin("-180") @DecimalMax("180") BigDecimal longitude,
        @Size(max = 500) String note) {
}
