import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const TaskInputForm = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskCategory,
  setNewTaskCategory,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  categories,
  onSubmit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <Button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          
          <Select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </Select>
          
          <Input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="px-3 py-2" // Override default input padding for date
          />
        </div>
      </form>
    </motion.div>
  );
};
export default TaskInputForm;