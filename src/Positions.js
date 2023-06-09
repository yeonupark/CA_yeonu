import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from "leaflet";
import proj4 from 'proj4';
import React, { useState, useEffect, useCallback } from 'react';

const position = [36.0761696194201, 129.382655928438] // 위,경도 직접 입력할때의 값

const crs2097 = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs';
const crs5174 = '+proj=tmerc +lat_0=38 +lon_0=127.00289 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs';
const crsWgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

// EPSG 2097 또는 EPSG 5174 좌표계 사용할 때 원본 x,y 좌표 값
const x = 414570.563877435;
const y = 288815.472861785;

// x,y 좌표 (EPSG 2097 or EPSG 5174) to 위,경도 (WGS84) 변환
const [lng, lat] = proj4(crs5174, crsWgs84, [x, y]);

function Positions() {
    
    const customMarker = L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'red',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    });
    
    return (
        <MapContainer center={position} zoom={30} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customMarker}>
                <Popup>
                </Popup>
            </Marker>
        </MapContainer>
    );

}

export default Positions;