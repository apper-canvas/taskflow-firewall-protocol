import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Pill from '@/components/atoms/Pill';
import Input from '@/components/atoms/Input';

const TaskCard = ({
  task,
  categories,
  editingTask,
  editTitle,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditTitleChange,
  getPriorityColor,
  getCategoryColor,
  formatDueDate,
  isDueDateOverdue,
  isToday, // Needed for conditional styling logic in Pill
  ...props // For motion.div props like initial, animate, exit, transition
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-surface rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all ${
        task.completed ? 'opacity-60' : ''
      }`}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <Checkbox checked={task.completed} onClick={() => onToggle(task.id)} />
        
        <div className="flex-1 min-w-0">
          {editingTask === task.id ? (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={editTitle}
                onChange={onEditTitleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit();
                  if (e.key === 'Escape') onCancelEdit();
                }}
                autoFocus
                className="flex-1 px-2 py-1 rounded border border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={onSaveEdit}
                className="text-success hover:bg-success/10 p-1 rounded"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
              </button>
              <button
                onClick={onCancelEdit}
                className="text-error hover:bg-error/10 p-1 rounded"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDoubleClick={() => onStartEdit(task)}
              className="cursor-pointer"
            >
              <h3 className={`font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              } break-words`}>
                {task.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(task.category) }}
                  />
                  <span className="text-xs text-gray-600">{task.category}</span>
                </div>
                
                <Pill className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Pill>
                
                {task.dueDate && (
                  <Pill className={`${
                    isDueDateOverdue(task.dueDate)
                      ? 'bg-error text-white'
                      : isToday(new Date(task.dueDate))
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                    {formatDueDate(task.dueDate)}
                  </Pill>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onStartEdit(task)}
            className="text-gray-400 hover:text-primary p-1 rounded hover:bg-primary/10"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-error p-1 rounded hover:bg-error/10"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
export default TaskCard;