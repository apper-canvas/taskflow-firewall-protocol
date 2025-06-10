import { motion } from 'framer-motion';

const CategoryPill = ({ category, taskCount, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? 'bg-primary text-white shadow-md'
          : 'bg-surface border border-surface-300 text-gray-700 hover:shadow-sm'
      }`}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span>{category.name}</span>
      {taskCount > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          isSelected
            ? 'bg-white/20 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {taskCount}
        </span>
      )}
    </motion.button>
  );
};
export default CategoryPill;