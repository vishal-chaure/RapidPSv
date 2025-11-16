import React from 'react';

interface SafetyControlsProps {
  hour: number;
  onHourChange: (hour: number) => void;
  onReset?: () => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPresetSelect: (hour: number) => void;
}

const SafetyControls: React.FC<SafetyControlsProps> = ({ 
  hour, 
  onHourChange, 
  onReset,
  isPlaying,
  onPlay,
  onPause,
  onPresetSelect
}) => {
  const formatTime = (h: number): string => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:00 ${period}`;
  };

  const getTimeOfDay = (h: number): string => {
    if (h >= 6 && h < 12) return 'Morning';
    if (h >= 12 && h < 17) return 'Afternoon';
    if (h >= 17 && h < 21) return 'Evening';
    return 'Night';
  };

  const presets = [
    { label: 'Midnight', hour: 0 },
    { label: 'Morning', hour: 6 },
    { label: 'Noon', hour: 12 },
    { label: 'Evening', hour: 18 },
    { label: 'Night', hour: 21 }
  ];

  const styles = {
    container: {
      padding: '20px',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    } as React.CSSProperties,
    header: {
      marginBottom: '16px'
    } as React.CSSProperties,
    title: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#1f2937'
    } as React.CSSProperties,
    timeDisplay: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2563eb',
      marginBottom: '4px'
    } as React.CSSProperties,
    timeOfDay: {
      fontSize: '14px',
      color: '#6b7280'
    } as React.CSSProperties,
    slider: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      outline: 'none',
      marginBottom: '16px'
    } as React.CSSProperties,
    hourLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '20px'
    } as React.CSSProperties,
    presetButtons: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
      marginBottom: '16px'
    } as React.CSSProperties,
    presetButton: {
      padding: '6px 12px',
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.2s'
    } as React.CSSProperties,
    playbackControls: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    } as React.CSSProperties,
    playButton: {
      flex: 1,
      padding: '10px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    } as React.CSSProperties,
    pauseButton: {
      flex: 1,
      padding: '10px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    } as React.CSSProperties,
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    } as React.CSSProperties,
    resetButton: {
      padding: '10px 20px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s',
      width: '100%'
    } as React.CSSProperties,
    legend: {
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb'
    } as React.CSSProperties,
    legendTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#1f2937'
    } as React.CSSProperties,
    legendItems: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap' as const
    } as React.CSSProperties,
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    } as React.CSSProperties,
    legendCircle: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    } as React.CSSProperties,
    legendText: {
      fontSize: '13px',
      color: '#4b5563'
    } as React.CSSProperties
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Select Time</div>
        <div style={styles.timeDisplay}>{formatTime(hour)}</div>
        <div style={styles.timeOfDay}>{getTimeOfDay(hour)}</div>
      </div>

      <input
        type="range"
        min="0"
        max="23"
        value={hour}
        onChange={(e) => onHourChange(parseInt(e.target.value))}
        style={styles.slider}
      />

      <div style={styles.hourLabels}>
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>

      <div style={styles.presetButtons}>
        {presets.map((preset) => (
          <button
            key={preset.hour}
            onClick={() => onPresetSelect(preset.hour)}
            style={styles.presetButton}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div style={styles.playbackControls}>
        <button
          onClick={onPlay}
          disabled={isPlaying}
          style={{
            ...styles.playButton,
            ...(isPlaying ? styles.buttonDisabled : {})
          }}
          onMouseOver={(e) => {
            if (!isPlaying) {
              e.currentTarget.style.background = '#059669';
            }
          }}
          onMouseOut={(e) => {
            if (!isPlaying) {
              e.currentTarget.style.background = '#10b981';
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>▶</span>
          Play
        </button>
        <button
          onClick={onPause}
          disabled={!isPlaying}
          style={{
            ...styles.pauseButton,
            ...(!isPlaying ? styles.buttonDisabled : {})
          }}
          onMouseOver={(e) => {
            if (isPlaying) {
              e.currentTarget.style.background = '#dc2626';
            }
          }}
          onMouseOut={(e) => {
            if (isPlaying) {
              e.currentTarget.style.background = '#ef4444';
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>⏸</span>
          Pause
        </button>
      </div>

      {onReset && (
        <button 
          onClick={onReset}
          style={styles.resetButton}
          onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
        >
          Show All Regions
        </button>
      )}

      <div style={styles.legend}>
        <div style={styles.legendTitle}>Safety Levels</div>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendCircle, background: '#10b981'}} />
            <span style={styles.legendText}>Safe (Green)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendCircle, background: '#f59e0b'}} />
            <span style={styles.legendText}>Moderate (Yellow)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendCircle, background: '#ef4444'}} />
            <span style={styles.legendText}>High Risk (Red)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyControls;
