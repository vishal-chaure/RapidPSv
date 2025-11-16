import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { safetyAPI } from '../../services/safetyAPI';
import type { Prediction, Ward, GeoJSONCollection, SearchResult } from '../../types/safety';
import '../../utils/leafletFix';

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

interface SafetyMapProps {
  hour: number;
  searchedWard: SearchResult | null;
  onWardClick?: (ward: Ward) => void;
}

const SafetyMap: React.FC<SafetyMapProps> = ({ hour, searchedWard, onWardClick }) => {
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [wards, setWards] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.076, 72.8777]);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    fetchData();
  }, [hour]);

  useEffect(() => {
    if (searchedWard) {
      setMapCenter([searchedWard.latitude, searchedWard.longitude]);
      setMapZoom(14);
    }
  }, [searchedWard]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [predictionsData, wardsData] = await Promise.all([
        safetyAPI.getPredictions(hour),
        safetyAPI.getWards()
      ]);
      
      setPredictions(predictionsData);
      setWards(wardsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (safetyLevel: string): string => {
    const colors: Record<string, string> = {
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444'
    };
    return colors[safetyLevel] || '#6b7280';
  };

  const getWardCoordinates = (wardId: string): [number, number] | null => {
    if (!wards || !wards.features) return null;
    
    const ward = wards.features.find(
      f => f.properties.ward_id === wardId
    );
    
    if (!ward || !ward.geometry.coordinates) return null;
    
    const coords = ward.geometry.coordinates[0];
    if (!coords || coords.length === 0) return null;
    
    const lats = coords.map(c => c[1]).filter(Boolean);
    const lngs = coords.map(c => c[0]).filter(Boolean);
    
    if (lats.length === 0 || lngs.length === 0) return null;
    
    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length
    ];
  };

  const isWardVisible = (wardId: string): boolean => {
    if (!searchedWard) return true;
    return wardId === searchedWard.ward_id;
  };

  if (loading) {
    return (
      <div style={{ 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f3f4f6'
      }}>
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '600px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <MapUpdater center={mapCenter} zoom={mapZoom} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {predictions?.wards.map((ward) => {
        const coordinates = getWardCoordinates(ward.ward_id);
        if (!coordinates) return null;
        if (!isWardVisible(ward.ward_id)) return null;

        return (
          <Circle
            key={ward.ward_id}
            center={coordinates}
            radius={500}
            fillColor={getMarkerColor(ward.safety_level)}
            fillOpacity={0.7}
            color={getMarkerColor(ward.safety_level)}
            weight={1}
            eventHandlers={{
              click: () => onWardClick && onWardClick(ward)
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong style={{ fontSize: '16px' }}>{ward.name}</strong>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: getMarkerColor(ward.safety_level),
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {ward.safety_level.toUpperCase()}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Risk Level:</strong> {(ward.crime_probability * 100).toFixed(1)}%
                </div>
                {ward.risk_factors && ward.risk_factors.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Risk Factors:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {ward.risk_factors.map((factor, i) => (
                        <li key={i} style={{ fontSize: '12px' }}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
};

export default SafetyMap;
