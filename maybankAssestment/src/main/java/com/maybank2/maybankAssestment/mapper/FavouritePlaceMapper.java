package com.maybank2.maybankAssestment.mapper;

import com.maybank2.maybankAssestment.dto.FavouritePlaceRequest;
import com.maybank2.maybankAssestment.dto.FavouritePlaceResponse;
import com.maybank2.maybankAssestment.entity.FavouritePlace;

public final class FavouritePlaceMapper {

    private FavouritePlaceMapper() {
    }

    public static FavouritePlace toEntity(FavouritePlaceRequest request) {
        FavouritePlace entity = new FavouritePlace();
        updateEntity(entity, request);
        return entity;
    }

    public static void updateEntity(FavouritePlace entity, FavouritePlaceRequest request) {
        entity.setGooglePlaceId(request.googlePlaceId());
        entity.setName(request.name());
        entity.setAddress(request.address());
        entity.setLatitude(request.latitude());
        entity.setLongitude(request.longitude());
        entity.setNote(request.note());
    }

    public static FavouritePlaceResponse toResponse(FavouritePlace entity) {
        return new FavouritePlaceResponse(
                entity.getId(),
                entity.getGooglePlaceId(),
                entity.getName(),
                entity.getAddress(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getNote(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
