import { AdvancedMarker, InfoWindow, Map, useAdvancedMarkerRef, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedPlace } from '../../search/selectors';

const KUALA_LUMPUR = { lat: 3.139, lng: 101.6869 };

/** Google map with a marker on the place selected in Redux. */
export default function PlaceMap() {
  const place = useSelector(selectSelectedPlace);

  return (
    <Map
      defaultCenter={KUALA_LUMPUR}
      defaultZoom={11}
      mapId="DEMO_MAP_ID" // Advanced Markers need a map id; DEMO_MAP_ID is Google's id for development
      gestureHandling="greedy"
      style={{ width: '100%', height: '100%' }}
    >
      {place && <SelectedPlaceMarker key={place.placeId} place={place} />}
      <CameraFollower place={place} />
    </Map>
  );
}

function SelectedPlaceMarker({ place }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: place.lat, lng: place.lng }}
        title={place.name}
        onClick={() => setInfoOpen((open) => !open)}
      />
      {infoOpen && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)} headerContent={<strong>{place.name}</strong>}>
          {place.address}
        </InfoWindow>
      )}
    </>
  );
}

/** Pans and zooms to the selected place, while still letting the user drag the map freely. */
function CameraFollower({ place }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;
    map.panTo({ lat: place.lat, lng: place.lng });
    map.setZoom(16);
  }, [map, place]);

  return null;
}
