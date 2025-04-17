
import MainLayout from '@/components/layout/MainLayout';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

// Import Leaflet directly
import L from 'leaflet';

// Example data for safety zones
const safetyMarkers = [
  { 
    position: [28.6139, 77.2090],
    name: "Delhi",
    riskLevel: "Moderate Risk Area",
    riskColor: "yellow" 
  },
  { 
    position: [19.0760, 72.8777],
    name: "Mumbai",
    riskLevel: "Safe Zone",
    riskColor: "green" 
  },
  { 
    position: [13.0827, 80.2707],
    name: "Chennai",
    riskLevel: "High Risk Area",
    riskColor: "red" 
  },
];

const SafetyMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Fix the default icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map instance
      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add markers
      safetyMarkers.forEach(marker => {
        const { position, name, riskLevel, riskColor } = marker;
        
        L.marker(position as L.LatLngExpression)
          .addTo(map)
          .bindPopup(`<b>${name}</b><br>${riskLevel}`)
          .openPopup();
      });
      
      // Store map instance in ref
      mapInstanceRef.current = map;
    }
    
    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-police-navy">Safety Heatmap</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Card className="absolute left-4 top-4 z-[400] p-4 w-64">
            <h3 className="font-semibold mb-2">Safety Levels</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-500 mr-2" />
                <span className="text-sm">Safe Zone</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-500 mr-2" />
                <span className="text-sm">Moderate Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-500 mr-2" />
                <span className="text-sm">High Risk</span>
              </div>
            </div>
          </Card>

          {/* Map container using direct ref approach instead of react-leaflet */}
          <div className="h-full w-full">
            <div ref={mapRef} className="h-full w-full"></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SafetyMap;
