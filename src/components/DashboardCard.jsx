
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

// // export default DashboardCard;
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
//  * @param {string} [props.extraInfo] - Optional extra information to display below the title.
//  */
// function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
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
//       style={{
//         cursor: 'pointer',
//         backgroundColor: '#fff',
//         borderRadius: '12px',
//         padding: '16px',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//       }}
//     >
//       <div className="tooltip" style={{ position: 'relative' }}>
//         <div
//           className="dashboard-card-icon"
//           style={{
//             backgroundColor: color,
//             borderRadius: '50%',
//             width: '60px',
//             height: '60px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: '12px',
//           }}
//         >
//           <Icon className="icon" size={28} color="#fff" />
//         </div>
//         <span
//           className="tooltip-text"
//           style={{
//             position: 'absolute',
//             bottom: '-28px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             color: '#fff',
//             padding: '4px 8px',
//             borderRadius: '4px',
//             fontSize: '12px',
//             whiteSpace: 'nowrap',
//             opacity: 0,
//             transition: 'opacity 0.2s',
//           }}
//         >
//           View {category} data
//         </span>
//       </div>
//       <h3
//         className="dashboard-card-title"
//         style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}
//       >
//         {category}
//       </h3>
//       {extraInfo && (
//         <p
//           className="dashboard-card-extra"
//           style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}
//         >
//           {extraInfo}
//         </p>
//       )}
//       <p
//         className="dashboard-card-description"
//         style={{ fontSize: '13px', color: '#777' }}
//       >
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
//   extraInfo: PropTypes.string,
// };

// // export default DashboardCard;
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
//  * @param {string} [props.extraInfo] - Optional extra information to display below the title.
//  */
// function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
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
//       {extraInfo && <p className="dashboard-card-extra">{extraInfo}</p>}
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
//   extraInfo: PropTypes.string,
// };

// export default DashboardCard;

// //final report
// import React, { useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { motion } from 'framer-motion';

// function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
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

//       {extraInfo && (
//         <p className="dashboard-card-extra" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//           {extraInfo.icon && <extraInfo.icon className="w-4 h-4" />}
//           <span>{extraInfo.text}</span>
//         </p>
//       )}
//     </motion.div>
//   );
// }

// DashboardCard.propTypes = {
//   category: PropTypes.string.isRequired,
//   Icon: PropTypes.elementType.isRequired,
//   color: PropTypes.string.isRequired,
//   onSelect: PropTypes.func.isRequired,
//   extraInfo: PropTypes.shape({
//     text: PropTypes.string,
//     icon: PropTypes.elementType,
//   }),
// };

// export default DashboardCard;

//finalllllllyyyy
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Dashboard card component with real-time report and colored badges
 */
function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
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

      {extraInfo && extraInfo.badges && (
        <div className="dashboard-card-badges" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {extraInfo.badges.map((badge, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: badge.color,
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}
            >
              {badge.label}: {badge.value}
            </span>
          ))}
        </div>
      )}

      {extraInfo && extraInfo.icon && extraInfo.text && (
        <p className="dashboard-card-extra" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
          <extraInfo.icon className="w-4 h-4" />
          <span>{extraInfo.text}</span>
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
    icon: PropTypes.elementType,
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
