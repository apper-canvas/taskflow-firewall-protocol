import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const TaskList = ({
  filteredTasks,
  searchQuery,
  selectedCategory,
  selectedPriority,
  categories,
  editingTask,
  editTitle,
  onToggleTask,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDeleteTask,
  onEditTitleChange,
  getPriorityColor,
  getCategoryColor,
  formatDueDate,
  isDueDateOverdue,
  isToday,
}) => {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="CheckCircle2" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || selectedCategory || selectedPriority 
                ? 'No tasks match your filters'
                : 'No tasks yet'
              }
            </h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || selectedCategory || selectedPriority
                ? 'Try adjusting your filters to see more tasks'
                : 'Add your first task to get started'
              }
            </p>
          </motion.div>
        ) : (
          filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              categories={categories}
              editingTask={editingTask}
              editTitle={editTitle}
              onToggle={onToggleTask}
              onStartEdit={onStartEditing}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDeleteTask}
              onEditTitleChange={onEditTitleChange}
              getPriorityColor={getPriorityColor}
              getCategoryColor={getCategoryColor}
              formatDueDate={formatDueDate}
              isDueDateOverdue={isDueDateOverdue}
              isToday={isToday}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
export default TaskList;