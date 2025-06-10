import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';

const ProgressHeader = ({ todayCompleted, totalToday }) => {
  return (
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
        <StatCard 
          value={todayCompleted} 
          valueLabel="Tasks completed" 
        />
      </div>
      
      {totalToday > 0 && (
        <div className="mt-4 bg-white/20 rounded-lg p-3 flex items-center space-x-2">
          <ApperIcon name="Target" className="w-5 h-5" />
          <span className="text-sm">{totalToday} tasks remaining for today</span>
        </div>
      )}
    </motion.div>
  );
};
export default ProgressHeader;