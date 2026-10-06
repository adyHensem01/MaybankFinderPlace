package com.maybank2.maybankAssestment.controller;

import java.net.URI;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.maybank2.maybankAssestment.dto.FavouritePlaceRequest;
import com.maybank2.maybankAssestment.dto.FavouritePlaceResponse;
import com.maybank2.maybankAssestment.dto.PageResponse;
import com.maybank2.maybankAssestment.service.FavouritePlaceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/favourites")
public class FavouritePlaceController {

    private final FavouritePlaceService service;

    public FavouritePlaceController(FavouritePlaceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FavouritePlaceResponse> create(@Valid @RequestBody FavouritePlaceRequest request) {
        FavouritePlaceResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/favourites/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public FavouritePlaceResponse update(@PathVariable Long id, @Valid @RequestBody FavouritePlaceRequest request) {
        return service.update(id, request);
    }

    @GetMapping("/{id}")
    public FavouritePlaceResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    /** Lets the UI check whether a Google place is already a favourite (404 if not). */
    @GetMapping("/by-place")
    public FavouritePlaceResponse findByGooglePlaceId(@RequestParam String googlePlaceId) {
        return service.findByGooglePlaceId(googlePlaceId);
    }

    /** Paginated list, 10 records per page. Example: ?page=0&sort=name,asc */
    @GetMapping
    public PageResponse<FavouritePlaceResponse> findAll(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.findAll(pageable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
