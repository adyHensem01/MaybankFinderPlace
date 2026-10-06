package com.maybank2.maybankAssestment.service;

import org.springframework.data.domain.Pageable;

import com.maybank2.maybankAssestment.dto.FavouritePlaceRequest;
import com.maybank2.maybankAssestment.dto.FavouritePlaceResponse;
import com.maybank2.maybankAssestment.dto.PageResponse;

public interface FavouritePlaceService {

    FavouritePlaceResponse create(FavouritePlaceRequest request);

    FavouritePlaceResponse update(Long id, FavouritePlaceRequest request);

    FavouritePlaceResponse findById(Long id);

    FavouritePlaceResponse findByGooglePlaceId(String googlePlaceId);

    PageResponse<FavouritePlaceResponse> findAll(Pageable pageable);

    void delete(Long id);
}
