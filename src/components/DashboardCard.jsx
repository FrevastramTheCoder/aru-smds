
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Dashboard card component for displaying a category.
 * @param {Object} props - Component props.
 * @param {string} props.category - Category name.
 * @param {React.Component} props.Icon - Icon component from lucide-react.
 * @param {string} props.color - Icon background color.
 * @param {Function} props.onSelect - Callback for selecting the category.
 */
function DashboardCard({ category, Icon, color, onSelect }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onSelect(category);
      }
    },
    [category, onSelect]
  );

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
      className="dashboard-card"
    >
      <div className="tooltip">
        <div className="dashboard-card-icon" style={{ backgroundColor: color }}>
          <Icon className="icon" />
        </div>
        <span className="tooltip-text">View {category} data</span>
      </div>
      <h3 className="dashboard-card-title">{category}</h3>
      <p className="dashboard-card-description">
        Explore and analyze {category.toLowerCase()} data for urban planning.
      </p>
    </motion.div>
  );
}

DashboardCard.propTypes = {
  category: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DashboardCard;
