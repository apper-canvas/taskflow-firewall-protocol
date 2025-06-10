import { toast } from 'react-toastify';

const taskService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // All fields for display purposes
      const tableFields = ['Id', 'Name', 'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'completed_at', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'];
      
      const params = {
        fields: tableFields,
        ...(filters.where && { where: filters.where }),
        ...(filters.orderBy && { orderBy: filters.orderBy }),
        ...(filters.pagingInfo && { pagingInfo: filters.pagingInfo })
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const tableFields = ['Id', 'Name', 'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'completed_at', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'];
      
      const params = {
        fields: tableFields
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to fetch task");
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const recordData = {};
      if (taskData.Name !== undefined) recordData.Name = taskData.Name;
      if (taskData.title !== undefined) recordData.title = taskData.title;
      if (taskData.completed !== undefined) recordData.completed = Boolean(taskData.completed);
      if (taskData.category !== undefined) recordData.category = parseInt(taskData.category);
      if (taskData.priority !== undefined) recordData.priority = taskData.priority;
      if (taskData.due_date !== undefined) recordData.due_date = taskData.due_date;
      if (taskData.created_at !== undefined) recordData.created_at = taskData.created_at;
      if (taskData.completed_at !== undefined) recordData.completed_at = taskData.completed_at;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Task created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const recordData = { Id: parseInt(id) };
      if (updates.Name !== undefined) recordData.Name = updates.Name;
      if (updates.title !== undefined) recordData.title = updates.title;
      if (updates.completed !== undefined) recordData.completed = Boolean(updates.completed);
      if (updates.category !== undefined) recordData.category = parseInt(updates.category);
      if (updates.priority !== undefined) recordData.priority = updates.priority;
      if (updates.due_date !== undefined) recordData.due_date = updates.due_date;
      if (updates.created_at !== undefined) recordData.created_at = updates.created_at;
      if (updates.completed_at !== undefined) recordData.completed_at = updates.completed_at;

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Task updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Task deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      throw error;
    }
  }
};

export default taskService;