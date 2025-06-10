import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { taskService, categoryService } from '@/services';
import ProgressHeader from '@/components/organisms/ProgressHeader';
import TaskInputForm from '@/components/organisms/TaskInputForm';
import TaskFilters from '@/components/organisms/TaskFilters';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';

const MainFeatureOrganism = () => {
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

  // Utility functions passed to molecules
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
        <Button
          onClick={loadData}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow-sm"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <ProgressHeader todayCompleted={todayCompleted} totalToday={totalToday} />
      <TaskInputForm
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskCategory={newTaskCategory}
        setNewTaskCategory={setNewTaskCategory}
        newTaskPriority={newTaskPriority}
        setNewTaskPriority={setNewTaskPriority}
        newTaskDueDate={newTaskDueDate}
        setNewTaskDueDate={setNewTaskDueDate}
        categories={categories}
        onSubmit={addTask}
      />
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        categories={categories}
        tasks={tasks}
      />
      <TaskList
        filteredTasks={filteredTasks}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        categories={categories}
        editingTask={editingTask}
        editTitle={editTitle}
        onToggleTask={toggleTask}
        onStartEditing={startEditing}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
        onDeleteTask={deleteTask}
        onEditTitleChange={(e) => setEditTitle(e.target.value)}
        getPriorityColor={getPriorityColor}
        getCategoryColor={getCategoryColor}
        formatDueDate={formatDueDate}
        isDueDateOverdue={isDueDateOverdue}
        isToday={isToday} // Pass date-fns isToday for conditional styling in TaskCard
      />
    </div>
  );
};

export default MainFeatureOrganism;