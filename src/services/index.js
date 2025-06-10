import * as taskService from '@/services/api/taskService';
import * as categoryService from '@/services/api/categoryService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export { taskService, categoryService, delay };