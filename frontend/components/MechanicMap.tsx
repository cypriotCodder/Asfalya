"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icons in Leaflet with Next.js/Webpack
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

interface Mechanic {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    phone?: string;
}

export default function MechanicMap() {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);

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

        // Fetch mechanics
        async function fetchMechanics() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8000/api/mechanics", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMechanics(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch mechanics", error);
            }
        }

        fetchMechanics();
    }, []);

    return (
        <MapContainer
            center={[35.1856, 33.3823]} // Default roughly center of Cyprus/Nicosia
            zoom={9}
            scrollWheelZoom={true}
            className="h-[400px] w-full rounded-lg z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mechanics?.map((mech) => {
                let lat = parseFloat(mech.latitude);
                let lng = parseFloat(mech.longitude);

                // Heuristic to fix missing decimal points from Excel import (e.g. 353370 -> 35.3370)
                if (lat > 90) lat = lat / 10000;
                if (lng > 180) lng = lng / 10000;

                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                    <Marker key={mech.id} position={[lat, lng]}>
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-bold">{mech.name}</h3>
                                <p>{mech.address}</p>
                                {mech.phone && <p className="text-xs text-zinc-500">{mech.phone}</p>}
                                <button className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs w-full">
                                    Book specifics
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
