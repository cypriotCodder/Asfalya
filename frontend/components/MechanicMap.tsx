"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js/Webpack
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

export default function MechanicMap() {
    useEffect(() => {
        // This fixes the missing icon issue
        (async function init() {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl,
                iconUrl,
                shadowUrl,
            });
        })();
    }, []);

    const mechanics = [
        { id: 1, name: "FixIt Fast", lat: 35.351186, lng: 33.142995, address: "123 Main St" }
    ];

    const tireChange = [
        { id: 1, name: "Lastikci", lat: 35.351186, lng: 33.142995, address: "123 Main St" }
    ];

    return (
        <MapContainer
            center={[35.351186, 33.142998]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-[400px] w-full rounded-lg z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mechanics.map((mech) => (
                <Marker key={mech.id} position={[mech.lat, mech.lng]}>
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-bold">{mech.name}</h3>
                            <p>{mech.address}</p>
                            <button className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs w-full">
                                Book specifics
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
