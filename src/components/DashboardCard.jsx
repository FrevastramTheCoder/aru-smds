
// import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { motion } from 'framer-motion';

// /**
//  * Dashboard card component for displaying a category.
//  * @param {Object} props - Component props.
//  * @param {string} props.category - Category name.
//  * @param {React.Component} props.Icon - Icon component from lucide-react.
//  * @param {string} props.color - Icon background color.
//  * @param {Function} props.onSelect - Callback for selecting the category.
//  */
// function DashboardCard({ category, Icon, color, onSelect }) {
//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === 'Enter' || e.key === ' ') {
//         onSelect(category);
//       }
//     },
//     [category, onSelect]
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       whileInView={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.4 }}
//       viewport={{ once: true }}
//       onClick={() => onSelect(category)}
//       onKeyDown={handleKeyDown}
//       role="button"
//       tabIndex={0}
//       className="dashboard-card"
//     >
//       <div className="tooltip">
//         <div className="dashboard-card-icon" style={{ backgroundColor: color }}>
//           <Icon className="icon" />
//         </div>
//         <span className="tooltip-text">View {category} data</span>
//       </div>
//       <h3 className="dashboard-card-title">{category}</h3>
//       <p className="dashboard-card-description">
//         Explore and analyze {category.toLowerCase()} data for urban planning.
//       </p>
//     </motion.div>
//   );
// }

// DashboardCard.propTypes = {
//   category: PropTypes.string.isRequired,
//   Icon: PropTypes.elementType.isRequired,
//   color: PropTypes.string.isRequired,
//   onSelect: PropTypes.func.isRequired,
// };

// export default DashboardCard;
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Dashboard card component for displaying a category.
 * Props:
 * - category: string
 * - Icon: lucide-react component
 * - color: Tailwind background color string (e.g., 'bg-red-400')
 * - onSelect: function
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
      className="cursor-pointer flex flex-col items-center justify-center rounded-xl shadow-lg p-6
                 transition-transform transform hover:scale-105 hover:shadow-2xl
                 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
    >
      {/* Icon with tooltip */}
      <div className="relative group mb-4 w-16 h-16 flex items-center justify-center rounded-full text-white">
        <div className={`${color} w-full h-full flex items-center justify-center rounded-full`}>
          <Icon className="w-8 h-8" />
        </div>
        <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100
                         bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900
                         text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg
                         transition-opacity duration-200">
          View {category} data
        </span>
      </div>

      <h3 className="text-lg font-semibold text-center mb-1">{category}</h3>
      <p className="text-center text-sm text-gray-500 dark:text-gray-300">
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
