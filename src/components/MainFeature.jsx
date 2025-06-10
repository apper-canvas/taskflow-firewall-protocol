import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  
  // Task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Work');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  // Editing
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const taskData = {
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || null,
      completed: false
    };

    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (!task.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editingTask) return;

    try {
      const updatedTask = await taskService.update(editingTask, {
        title: editTitle.trim()
      });
      
      setTasks(prev => prev.map(t => t.id === editingTask ? updatedTask : t));
      setEditingTask(null);
      setEditTitle('');
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Statistics
  const todayCompleted = tasks.filter(task => 
    task.completed && task.completedAt && isToday(new Date(task.completedAt))
  ).length;

  const totalToday = tasks.filter(task => 
    !task.completed && (!task.dueDate || isToday(new Date(task.dueDate)))
  ).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-error text-white';
      case 'Medium': return 'bg-warning text-white';
      case 'Low': return 'bg-success text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#8B7FE8';
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDueDateOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Progress skeleton */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        
        {/* Task input skeleton */}
        <div className="bg-surface rounded-xl p-6 shadow-sm">
          <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
        </div>
        
        {/* Task list skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-lg p-4 shadow-sm"
            >
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load tasks</h3>
        <p className="mt-2 text-gray-500">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow-sm"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">Today's Progress</h2>
            <p className="opacity-90">Keep up the momentum!</p>
          </div>
          <motion.div
            key={todayCompleted}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="text-right"
          >
            <div className="text-3xl font-heading font-bold">{todayCompleted}</div>
            <div className="text-sm opacity-90">Tasks completed</div>
          </motion.div>
        </div>
        
        {totalToday > 0 && (
          <div className="mt-4 bg-white/20 rounded-lg p-3 flex items-center space-x-2">
            <ApperIcon name="Target" className="w-5 h-5" />
            <span className="text-sm">{totalToday} tasks remaining for today</span>
          </div>
        )}
      </motion.div>

      {/* Task Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200"
      >
        <form onSubmit={addTask} className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
            />
          </div>
        </form>
      </motion.div>

      {/* Filters */}
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map(category => {
          const taskCount = tasks.filter(task => task.category === category.name && !task.completed).length;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
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
                  selectedCategory === category.name
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {taskCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Task List */}
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
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-surface rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-success border-success text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <div className="flex-1 min-w-0">
                    {editingTask === task.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 rounded border border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={saveEdit}
                          className="text-success hover:bg-success/10 p-1 rounded"
                        >
                          <ApperIcon name="Check" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-error hover:bg-error/10 p-1 rounded"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDoubleClick={() => startEditing(task)}
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
                          
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          
                          {task.dueDate && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isDueDateOverdue(task.dueDate)
                                ? 'bg-error text-white'
                                : isToday(new Date(task.dueDate))
                                ? 'bg-accent text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEditing(task)}
                      className="text-gray-400 hover:text-primary p-1 rounded hover:bg-primary/10"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-error p-1 rounded hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;