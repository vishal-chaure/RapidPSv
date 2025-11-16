import React, { useState, useEffect } from 'react';
import { safetyAPI } from '../../services/safetyAPI';
import type { SafetyTips as SafetyTipsType } from '../../types/safety';

interface SafetyTipsProps {
  wardId: string | null;
  hour: number;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ wardId, hour }) => {
  const [tips, setTips] = useState<SafetyTipsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wardId) {
      fetchTips();
    } else {
      setTips(null);
    }
  }, [wardId, hour]);

  const fetchTips = async () => {
    if (!wardId) return;
    
    setLoading(true);
    try {
      const data = await safetyAPI.getSafetyTips(wardId, hour);
      setTips(data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyBadgeColor = (level: string): string => {
    const colors: Record<string, string> = {
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444'
    };
    return colors[level] || '#6b7280';
  };

  const styles = {
    container: {
      padding: '20px',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    } as React.CSSProperties,
    placeholder: {
      textAlign: 'center' as const,
      color: '#6b7280',
      padding: '40px 20px'
    } as React.CSSProperties,
    header: {
      marginBottom: '20px'
    } as React.CSSProperties,
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#1f2937'
    } as React.CSSProperties,
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      textTransform: 'uppercase' as const
    } as React.CSSProperties,
    section: {
      marginBottom: '24px'
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#374151',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '8px'
    } as React.CSSProperties,
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    } as React.CSSProperties,
    listItem: {
      padding: '10px 12px',
      marginBottom: '8px',
      background: '#f9fafb',
      borderRadius: '6px',
      borderLeft: '3px solid #3b82f6',
      fontSize: '14px',
      color: '#4b5563',
      lineHeight: '1.5'
    } as React.CSSProperties
  };

  if (!wardId) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          Click on any region on the map to view safety tips
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>Loading safety tips...</div>
      </div>
    );
  }

  if (!tips) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Safety Tips for {wardId}</div>
        <div style={{
          ...styles.badge,
          background: getSafetyBadgeColor(tips.safety_level)
        }}>
          {tips.safety_level}
        </div>
      </div>

      {tips.general_tips && tips.general_tips.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>General Safety Tips</div>
          <ul style={styles.list}>
            {tips.general_tips.map((tip, i) => (
              <li key={i} style={styles.listItem}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {tips.specific_tips && tips.specific_tips.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Area-Specific Tips</div>
          <ul style={styles.list}>
            {tips.specific_tips.map((tip, i) => (
              <li key={i} style={styles.listItem}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {tips.time_tips && tips.time_tips.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Time-Specific Tips</div>
          <ul style={styles.list}>
            {tips.time_tips.map((tip, i) => (
              <li key={i} style={styles.listItem}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SafetyTips;
