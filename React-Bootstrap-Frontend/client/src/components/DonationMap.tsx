import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Donation } from "../../../shared/schema";
import { useEffect, useState } from 'react';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DonationMapProps {
  donations: Donation[];
  center?: [number, number];
  zoom?: number;
}

export default function DonationMap({ donations, center = [20.5937, 78.9629], zoom = 5 }: DonationMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] w-full bg-muted animate-pulse rounded-2xl" />;

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(donations) && donations.map((donation) => (
          <Marker 
            key={donation.id} 
            position={[20.5937 + (Math.random() - 0.5) * 2, 78.9629 + (Math.random() - 0.5) * 2]} 
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{donation.title}</h3>
                <p className="text-sm">{donation.pickupAddress}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
