
// src/components/DashboardCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparklines, SparklinesLine } from 'react-sparklines';

function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
  const [hover, setHover] = useState(false);
  const [sparkData, setSparkData] = useState([]);

  // Update sparkline whenever extraInfo changes
  useEffect(() => {
    if (extraInfo?.badges) {
      const total = extraInfo.badges.reduce((sum, b) => sum + b.value, 0);
      setSparkData(prev => [...prev.slice(-9), total]);
    }
  }, [extraInfo]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') onSelect(category);
    },
    [category, onSelect]
  );

  const total = extraInfo?.badges?.reduce((sum, b) => sum + b.value, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      onClick={() => onSelect(category)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#1f2937',
        color: '#f9fafb',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: hover ? '0 8px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '220px',
        position: 'relative',
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hover && extraInfo?.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '-48px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#111827',
              color: '#f9fafb',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
          >
            {extraInfo.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div style={{
        backgroundColor: color,
        borderRadius: '8px',
        padding: '12px',
        width: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <Icon style={{ width: '24px', height: '24px', color: '#fff' }} />
      </div>

      {/* Category Title */}
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>{category}</h3>

      {/* Animated Badges */}
      {total > 0 && (
        <div style={{ marginBottom: '12px' }}>
          {extraInfo.badges.map((badge, idx) => {
            const widthPercent = total ? (badge.value / total) * 100 : 0;
            return (
              <div key={idx} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
                  <span>{badge.label}</span>
                  <span>{badge.value}</span>
                </div>
                <div style={{ background: '#374151', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', backgroundColor: badge.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini Line Sparkline */}
      {sparkData.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <Sparklines data={sparkData} limit={10} width={100} height={30}>
            <SparklinesLine style={{ stroke: color, fill: 'rgba(0,0,0,0.1)' }} />
          </Sparklines>
        </div>
      )}

      {/* Extra Text */}
      {extraInfo?.text && (
        <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: 'auto' }}>
          {extraInfo.text}
        </p>
      )}
    </motion.div>
  );
}

DashboardCard.propTypes = {
  category: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  extraInfo: PropTypes.shape({
    text: PropTypes.string,
    badges: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default DashboardCard;
