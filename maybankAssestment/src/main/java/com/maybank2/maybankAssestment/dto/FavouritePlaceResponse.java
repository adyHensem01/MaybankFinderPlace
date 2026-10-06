package com.maybank2.maybankAssestment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FavouritePlaceResponse(
        Long id,
        String googlePlaceId,
        String name,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        String note,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
