import React, { useState } from 'react';
import { safetyAPI } from '../../services/safetyAPI';
import type { SearchResult } from '../../types/safety';

interface LocationSearchProps {
  onLocationFound: (result: SearchResult) => void;
  onError?: (message: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationFound, onError }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onError?.('Please enter a location');
      return;
    }

    setLoading(true);

    try {
      const result = await safetyAPI.searchLocation(query);
      onLocationFound(result);
      setQuery('');
    } catch (error) {
      console.error('Search failed:', error);
      onError?.('Location not found in Mumbai area. Try searching for areas like Dadar, Bandra, Andheri, etc.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    } as React.CSSProperties,
    title: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#1f2937'
    } as React.CSSProperties,
    form: {
      display: 'flex',
      gap: '8px'
    } as React.CSSProperties,
    input: {
      flex: 1,
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    } as React.CSSProperties,
    button: {
      padding: '12px 24px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      opacity: loading ? 0.7 : 1,
      transition: 'background 0.2s',
      whiteSpace: 'nowrap'
    } as React.CSSProperties,
    examples: {
      marginTop: '12px',
      fontSize: '12px',
      color: '#6b7280'
    } as React.CSSProperties,
    exampleLink: {
      color: '#3b82f6',
      cursor: 'pointer',
      textDecoration: 'underline',
      marginRight: '8px'
    } as React.CSSProperties
  };

  const exampleLocations = ['Dadar', 'Bandra', 'Andheri', 'Colaba'];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Search Location</div>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter location (e.g., Dadar, Bandra)"
          disabled={loading}
          style={styles.input}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={styles.button}
          onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div style={styles.examples}>
        Try: {exampleLocations.map((loc, i) => (
          <span key={i}>
            <span
              style={styles.exampleLink}
              onClick={() => !loading && setQuery(loc)}
            >
              {loc}
            </span>
            {i < exampleLocations.length - 1 && '• '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;
