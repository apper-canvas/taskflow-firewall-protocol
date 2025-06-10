import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-96 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h2 className="mt-4 text-xl font-heading font-semibold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
        <Button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md"
        >
          Back to Tasks
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;