import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-surface border-b border-surface-200 px-6 py-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md"
            >
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">Organize your day</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ApperIcon name="TrendingUp" className="w-4 h-4" />
            <span className="font-medium text-sm">Stay Focused</span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;