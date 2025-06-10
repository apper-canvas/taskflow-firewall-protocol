import { motion } from 'framer-motion';

const StatCard = ({ value, valueLabel, className = '' }) => {
  return (
    <motion.div
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      className={`text-right ${className}`}
    >
      <div className="text-3xl font-heading font-bold">{value}</div>
      <div className="text-sm opacity-90">{valueLabel}</div>
    </motion.div>
  );
};
export default StatCard;