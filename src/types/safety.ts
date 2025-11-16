export interface Ward {
  ward_id: string;
  name: string;
  safety_level: 'green' | 'yellow' | 'red';
  crime_probability: number;
  risk_factors: string[];
  latitude?: number;
  longitude?: number;
}

export interface Prediction {
  hour: number;
  timestamp: string;
  wards: Ward[];
}

export interface SearchResult {
  ward_id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  search_query: string;
  matched_location: string;
  search_lat: number;
  search_lng: number;
}

export interface SafetyTips {
  ward_id: string;
  safety_level: 'green' | 'yellow' | 'red';
  general_tips: string[];
  specific_tips: string[];
  time_tips: string[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    ward_id: string;
    name: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
