import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { type Shipment } from '@/data/shipments';
import 'leaflet/dist/leaflet.css';

interface ShipmentMapProps {
  shipment: Shipment;
}

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Use inline SVG markers to avoid CDN dependency
const markerSvg = `data:image/svg+xml;base64,${btoa(`
<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
  <path fill="#3388ff" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 6.9 12.5 28.5 12.5 28.5S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0z"/>
  <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
</svg>
`)}`;

L.Icon.Default.mergeOptions({
  iconUrl: markerSvg,
  iconRetinaUrl: markerSvg,
  shadowUrl: '',
});

const ShipmentMap = ({ shipment }: ShipmentMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      [shipment.currentLocation.lat, shipment.currentLocation.lng],
      6
    );

    mapInstanceRef.current = map;

    // Add tile layer with error handling
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    });
    
    tileLayer.on('tileerror', function(error) {
      console.warn('Map tile failed to load:', error);
    });
    
    tileLayer.addTo(map);

    // Create custom icons
    const currentIcon = L.divIcon({
      html: `
        <div style="
          background: hsl(var(--primary));
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-current-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const completedIcon = L.divIcon({
      html: `
        <div style="
          background: hsl(var(--success));
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        "></div>
      `,
      className: 'custom-completed-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const pendingIcon = L.divIcon({
      html: `
        <div style="
          background: hsl(var(--muted));
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        "></div>
      `,
      className: 'custom-pending-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add markers for checkpoints
    const markers: L.Marker[] = [];
    const routeCoordinates: [number, number][] = [];

    shipment.checkpoints.forEach((checkpoint) => {
      let icon = pendingIcon;
      if (checkpoint.status === 'completed') {
        icon = completedIcon;
      } else if (checkpoint.status === 'current') {
        icon = currentIcon;
      }

      const marker = L.marker([checkpoint.lat, checkpoint.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${checkpoint.location}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${checkpoint.date}</p>
            <p style="margin: 0; font-size: 12px;">${checkpoint.description}</p>
          </div>
        `);

      markers.push(marker);

      if (checkpoint.status === 'completed' || checkpoint.status === 'current') {
        routeCoordinates.push([checkpoint.lat, checkpoint.lng]);
      }
    });

    // Draw route line between completed checkpoints
    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: 'hsl(var(--primary))',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5'
      }).addTo(map);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [shipment]);

  return (
    <div 
      ref={mapRef} 
      className="h-96 w-full rounded-b-lg"
      style={{ minHeight: '384px' }}
    />
  );
};

export default ShipmentMap;