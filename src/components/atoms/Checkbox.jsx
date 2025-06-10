import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        checked
          ? 'bg-success border-success text-white'
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <ApperIcon name="Check" className="w-4 h-4" />
        </motion.div>
      )}
    </motion.button>
  );
};
export default Checkbox;