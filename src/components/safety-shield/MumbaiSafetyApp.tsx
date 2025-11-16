import React, { useState, useRef, useEffect } from 'react';
import SafetyMap from './SafetyMap';
import SafetyControls from './SafetyControls';
import LocationSearch from './LocationSearch';
import SafetyTips from './SafetyTips';
import type { SearchResult, Ward } from '../../types/safety';

const MumbaiSafetyApp: React.FC = () => {
  const [hour, setHour] = useState(new Date().getHours());
  const [searchedWard, setSearchedWard] = useState<SearchResult | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePlay = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    playTimer.current = setInterval(() => {
      setHour((prevHour) => (prevHour + 1) % 24);
    }, 1500);
  };

  const handlePause = () => {
    if (playTimer.current) {
      clearInterval(playTimer.current);
      playTimer.current = null;
    }
    setIsPlaying(false);
  };

  const handleHourChange = (newHour: number) => {
    if (isPlaying) {
      handlePause();
    }
    setHour(newHour);
  };

  const handlePresetSelect = (presetHour: number) => {
    if (isPlaying) {
      handlePause();
    }
    setHour(presetHour);
  };

  useEffect(() => {
    return () => {
      if (playTimer.current) {
        clearInterval(playTimer.current);
      }
    };
  }, []);

  const handleLocationFound = (wardData: SearchResult) => {
    setSearchedWard(wardData);
    setSelectedWard(wardData.ward_id);
    setError(null);
  };

  const handleReset = () => {
    setSearchedWard(null);
    setSelectedWard(null);
  };

  const handleWardClick = (ward: Ward) => {
    setSelectedWard(ward.ward_id);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px'
    } as React.CSSProperties,
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    } as React.CSSProperties,
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    } as React.CSSProperties,
    subtitle: {
      fontSize: '16px',
      color: '#6b7280'
    } as React.CSSProperties,
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '20px',
      marginBottom: '20px'
    } as React.CSSProperties,
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    } as React.CSSProperties,
    error: {
      padding: '16px',
      background: '#fee2e2',
      border: '1px solid #ef4444',
      borderRadius: '8px',
      color: '#991b1b',
      marginBottom: '20px',
      fontSize: '14px'
    } as React.CSSProperties
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mumbai Safety Zone Predictor</h1>
        <p style={styles.subtitle}>
          Real-time crime prediction and safety visualization for Smart Policing
        </p>
      </div>

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      <div style={styles.grid}>
        <div style={styles.sidebar}>
          <LocationSearch 
            onLocationFound={handleLocationFound}
            onError={handleError}
          />
          <SafetyControls 
            hour={hour}
            onHourChange={handleHourChange}
            onReset={searchedWard ? handleReset : undefined}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onPresetSelect={handlePresetSelect}
          />
          <SafetyTips 
            wardId={selectedWard}
            hour={hour}
          />
        </div>

        <div>
          <SafetyMap 
            hour={hour}
            searchedWard={searchedWard}
            onWardClick={handleWardClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MumbaiSafetyApp;
