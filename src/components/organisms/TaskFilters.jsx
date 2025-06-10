import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import CategoryPill from '@/components/molecules/CategoryPill';

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  categories,
  tasks // needed for taskCount in CategoryPill
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface rounded-xl p-4 shadow-sm border border-surface-200"
    >
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2" // Override default input padding for search
            />
          </div>
        </div>
        
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
        
        <Select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
      </div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mt-4"
      >
        {categories.map(category => {
          const taskCount = tasks.filter(task => task.category === category.name && !task.completed).length;
          return (
            <CategoryPill
              key={category.id}
              category={category}
              taskCount={taskCount}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};
export default TaskFilters;