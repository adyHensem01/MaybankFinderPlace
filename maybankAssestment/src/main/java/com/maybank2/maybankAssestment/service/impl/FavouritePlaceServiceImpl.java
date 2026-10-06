package com.maybank2.maybankAssestment.service.impl;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maybank2.maybankAssestment.dto.FavouritePlaceRequest;
import com.maybank2.maybankAssestment.dto.FavouritePlaceResponse;
import com.maybank2.maybankAssestment.dto.PageResponse;
import com.maybank2.maybankAssestment.entity.FavouritePlace;
import com.maybank2.maybankAssestment.exception.DuplicateResourceException;
import com.maybank2.maybankAssestment.exception.ResourceNotFoundException;
import com.maybank2.maybankAssestment.mapper.FavouritePlaceMapper;
import com.maybank2.maybankAssestment.repository.FavouritePlaceRepository;
import com.maybank2.maybankAssestment.service.FavouritePlaceService;

@Service
@Transactional(readOnly = true) // default for GET (read) methods
public class FavouritePlaceServiceImpl implements FavouritePlaceService {

    private final FavouritePlaceRepository repository;

    public FavouritePlaceServiceImpl(FavouritePlaceRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional // INSERT
    public FavouritePlaceResponse create(FavouritePlaceRequest request) {
        if (repository.existsByGooglePlaceId(request.googlePlaceId())) {
            throw new DuplicateResourceException(
                    "Place " + request.googlePlaceId() + " is already a favourite");
        }
        FavouritePlace saved = repository.save(FavouritePlaceMapper.toEntity(request));
        return FavouritePlaceMapper.toResponse(saved);
    }

    @Override
    @Transactional // UPDATE
    public FavouritePlaceResponse update(Long id, FavouritePlaceRequest request) {
        FavouritePlace entity = getOrThrow(id);
        repository.findByGooglePlaceId(request.googlePlaceId())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new DuplicateResourceException(
                            "Place " + request.googlePlaceId() + " is already favourite " + other.getId());
                });
        FavouritePlaceMapper.updateEntity(entity, request);
        // flush so @PreUpdate sets updatedAt before we build the response
        return FavouritePlaceMapper.toResponse(repository.saveAndFlush(entity));
    }

    @Override // GET (readOnly transaction from class level)
    public FavouritePlaceResponse findById(Long id) {
        return FavouritePlaceMapper.toResponse(getOrThrow(id));
    }

    @Override // GET (readOnly transaction from class level)
    public FavouritePlaceResponse findByGooglePlaceId(String googlePlaceId) {
        return repository.findByGooglePlaceId(googlePlaceId)
                .map(FavouritePlaceMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Place " + googlePlaceId + " is not a favourite"));
    }

    @Override // GET with pagination (readOnly transaction from class level)
    public PageResponse<FavouritePlaceResponse> findAll(Pageable pageable) {
        return PageResponse.from(repository.findAll(pageable), FavouritePlaceMapper::toResponse);
    }

    @Override
    @Transactional // DELETE
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private FavouritePlace getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Favourite place " + id + " not found"));
    }
}
