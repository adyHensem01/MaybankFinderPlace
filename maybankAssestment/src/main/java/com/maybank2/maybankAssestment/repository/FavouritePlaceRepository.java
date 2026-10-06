package com.maybank2.maybankAssestment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maybank2.maybankAssestment.entity.FavouritePlace;

public interface FavouritePlaceRepository extends JpaRepository<FavouritePlace, Long> {

    boolean existsByGooglePlaceId(String googlePlaceId);

    Optional<FavouritePlace> findByGooglePlaceId(String googlePlaceId);
}
