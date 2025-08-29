
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

//final codes
// // src/components/DashboardCard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { motion } from 'framer-motion';
// import { Sparklines, SparklinesLine } from 'react-sparklines';

// function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
//   const [hover, setHover] = useState(false);
//   const [sparkData, setSparkData] = useState([]);

//   // Update sparkline in real-time
//   useEffect(() => {
//     if (extraInfo?.badges) {
//       const total = extraInfo.badges.reduce((sum, b) => sum + b.value, 0);
//       setSparkData(prev => [...prev.slice(-9), total]);
//     }
//   }, [extraInfo]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === 'Enter' || e.key === ' ') onSelect(category);
//     },
//     [category, onSelect]
//   );

//   const total = extraInfo?.badges?.reduce((sum, b) => sum + b.value, 0) || 0;

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
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{
//         background: '#1f2937',
//         color: '#f9fafb',
//         borderRadius: '12px',
//         padding: '16px',
//         boxShadow: hover ? '0 8px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative',
//         minHeight: '200px',
//       }}
//     >
//       {/* Tooltip */}
//       {hover && extraInfo?.text && (
//         <div style={{
//           position: 'absolute',
//           top: '-48px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           background: '#111827',
//           color: '#f9fafb',
//           padding: '6px 12px',
//           borderRadius: '6px',
//           fontSize: '0.75rem',
//           whiteSpace: 'nowrap',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
//           zIndex: 10,
//         }}>
//           {extraInfo.text}
//         </div>
//       )}

//       {/* Icon */}
//       <div style={{
//         backgroundColor: color,
//         borderRadius: '8px',
//         padding: '12px',
//         width: '48px',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: '12px'
//       }}>
//         <Icon style={{ width: '24px', height: '24px', color: '#fff' }} />
//       </div>

//       {/* Category Title */}
//       <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>{category}</h3>

//       {/* Badges */}
//       {total > 0 && (
//         <div style={{ marginBottom: '12px' }}>
//           {extraInfo.badges.map((badge, idx) => {
//             const widthPercent = total ? (badge.value / total) * 100 : 0;
//             return (
//               <div key={idx} style={{ marginBottom: '6px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
//                   <span>{badge.label}</span>
//                   <span>{badge.value}</span>
//                 </div>
//                 <div style={{ background: '#374151', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
//                   <div style={{ width: `${widthPercent}%`, backgroundColor: badge.color, height: '100%', transition: 'width 0.5s' }} />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Mini Line Sparkline */}
//       {sparkData.length > 0 && (
//         <div style={{ marginBottom: '8px' }}>
//           <Sparklines data={sparkData} limit={10} width={100} height={30}>
//             <SparklinesLine style={{ stroke: color, fill: 'rgba(0,0,0,0.1)' }} />
//           </Sparklines>
//         </div>
//       )}

//       {/* Extra Text */}
//       {extraInfo?.text && (
//         <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: 'auto' }}>
//           {extraInfo.text}
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
//     badges: PropTypes.arrayOf(
//       PropTypes.shape({
//         label: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         color: PropTypes.string.isRequired,
//       })
//     ),
//   }),
// };

// export default DashboardCard;


// ///arc gis
// // src/components/DashboardCard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Sparklines, SparklinesLine } from 'react-sparklines';

// function DashboardCard({ category, Icon, color, onSelect, extraInfo }) {
//   const [hover, setHover] = useState(false);
//   const [sparkData, setSparkData] = useState([]);

//   // Update sparkline whenever extraInfo changes
//   useEffect(() => {
//     if (extraInfo?.badges) {
//       const total = extraInfo.badges.reduce((sum, b) => sum + b.value, 0);
//       setSparkData(prev => [...prev.slice(-9), total]);
//     }
//   }, [extraInfo]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === 'Enter' || e.key === ' ') onSelect(category);
//     },
//     [category, onSelect]
//   );

//   const total = extraInfo?.badges?.reduce((sum, b) => sum + b.value, 0) || 0;

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
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{
//         background: '#1f2937',
//         color: '#f9fafb',
//         borderRadius: '12px',
//         padding: '16px',
//         boxShadow: hover ? '0 8px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '220px',
//         position: 'relative',
//       }}
//     >
//       {/* Tooltip */}
//       <AnimatePresence>
//         {hover && extraInfo?.text && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             style={{
//               position: 'absolute',
//               top: '-48px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               background: '#111827',
//               color: '#f9fafb',
//               padding: '6px 12px',
//               borderRadius: '6px',
//               fontSize: '0.75rem',
//               whiteSpace: 'nowrap',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
//               zIndex: 10,
//             }}
//           >
//             {extraInfo.text}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Icon */}
//       <div style={{
//         backgroundColor: color,
//         borderRadius: '8px',
//         padding: '12px',
//         width: '48px',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: '12px'
//       }}>
//         <Icon style={{ width: '24px', height: '24px', color: '#fff' }} />
//       </div>

//       {/* Category Title */}
//       <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>{category}</h3>

//       {/* Animated Badges */}
//       {total > 0 && (
//         <div style={{ marginBottom: '12px' }}>
//           {extraInfo.badges.map((badge, idx) => {
//             const widthPercent = total ? (badge.value / total) * 100 : 0;
//             return (
//               <div key={idx} style={{ marginBottom: '6px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
//                   <span>{badge.label}</span>
//                   <span>{badge.value}</span>
//                 </div>
//                 <div style={{ background: '#374151', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${widthPercent}%` }}
//                     transition={{ duration: 0.5 }}
//                     style={{ height: '100%', backgroundColor: badge.color }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Mini Line Sparkline */}
//       {sparkData.length > 0 && (
//         <div style={{ marginBottom: '8px' }}>
//           <Sparklines data={sparkData} limit={10} width={100} height={30}>
//             <SparklinesLine style={{ stroke: color, fill: 'rgba(0,0,0,0.1)' }} />
//           </Sparklines>
//         </div>
//       )}

//       {/* Extra Text */}
//       {extraInfo?.text && (
//         <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: 'auto' }}>
//           {extraInfo.text}
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
//     badges: PropTypes.arrayOf(
//       PropTypes.shape({
//         label: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         color: PropTypes.string.isRequired,
//       })
//     ),
//   }),
// };

// export default DashboardCard;

//final professinal
// src/components/DashboardCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparklines, SparklinesLine } from 'react-sparklines';

/**
 * Combined ArcGIS + tooltip DashboardCard component
 */
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
        textAlign: 'center',
      }}
    >
      {/* Tooltip on hover */}
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
            View {category} data
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div style={{
        backgroundColor: color,
        borderRadius: '50%',
        padding: '12px',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 12px',
      }}>
        <Icon style={{ width: '28px', height: '28px', color: '#fff' }} />
      </div>

      {/* Category Title */}
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '6px' }}>{category}</h3>

      {/* Extra info text */}
      {extraInfo?.text && (
        <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginBottom: '8px' }}>
          {extraInfo.text}
        </p>
      )}

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

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <Sparklines data={sparkData} limit={10} width={100} height={30}>
            <SparklinesLine style={{ stroke: color, fill: 'rgba(0,0,0,0.1)' }} />
          </Sparklines>
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: '13px', color: '#777', marginTop: 'auto' }}>
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
