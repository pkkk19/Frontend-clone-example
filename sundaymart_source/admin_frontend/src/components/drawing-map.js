import {
  GoogleApiWrapper,
  Map,
  Marker,
  Polygon,
  Polyline,
} from 'google-maps-react';
import React from 'react';
import { useState } from 'react';
import { MAP_API_KEY } from '../configs/app-global';

const DrawingManager = (props) => {
  const [triangleCoords, settriangleCoords] = useState([]);
  const [center, setCenter] = useState({ lat: 34.0207305, lng: -118.6919155 });
  const [polygon, setPolygon] = useState([]);
  const [finish, setFinish] = useState(false);

  console.log('triangleCoords: ', triangleCoords);
  console.log('triangleCoords: ', triangleCoords);

  console.log('triangleCoords: ', triangleCoords);
  console.log('triangleCoords: ', triangleCoords);
  console.log('triangleCoords: ', triangleCoords);
  console.log('triangleCoords: ', triangleCoords);
  console.log('triangleCoords: ', triangleCoords);
  console.log('polygon: ', polygon);
  console.log('finish: ', finish);
  const onClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (finish) {
      settriangleCoords([{ lat, lng }]);
      setCenter({ lat, lng });
      setFinish(false);
      setPolygon([]);
    } else settriangleCoords((prev) => [...prev, { lat, lng }]);
  };

  const onFinish = (e) => {
    console.log('e', e);
    if (
      triangleCoords[0]?.lat === e.position?.lat &&
      triangleCoords.length > 1
    ) {
      setPolygon(triangleCoords);
      setFinish(true);
    }
  };
  return (
    <div style={{ height: 500 }}>
      <Map
        onClick={onClick}
        google={props.google}
        zoom={8}
        initialCenter={center}
        center={center}
        className='clickable'
      >
        {triangleCoords.map((item, idx) => (
          <Marker
            onClick={(e) => onFinish(e)}
            key={idx}
            position={item}
            icon={{
              url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Circle-image.svg',
              scaledSize: new props.google.maps.Size(10, 10),
            }}
            className='marker'
          />
        ))}

        {!polygon?.length ? (
          <Polyline
            key={triangleCoords.length}
            path={triangleCoords}
            strokeColor='black'
            strokeOpacity={0.8}
            strokeWeight={3}
            fillColor='black'
            fillOpacity={0.35}
          />
        ) : (
          <Polygon
            key={polygon.length}
            path={triangleCoords}
            strokeColor='black'
            strokeOpacity={0.8}
            strokeWeight={3}
            fillColor='black'
            fillOpacity={0.35}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: MAP_API_KEY,
  libraries: ['places'],
})(DrawingManager);
