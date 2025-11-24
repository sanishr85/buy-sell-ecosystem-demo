import API_URL from './config';

export const needsAPI = {
  // Create a need
  create: async (token, needData) => {
    try {
      const response = await fetch(`${API_URL}/needs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(needData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create need error:', error);
      throw error;
    }
  },

  // Get all needs
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/needs?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get needs error:', error);
      throw error;
    }
  },

  // Get single need
  getById: async (needId) => {
    try {
      const response = await fetch(`${API_URL}/needs/${needId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get need by ID error:', error);
      throw error;
    }
  },

  // Get my posted needs
  getMyNeeds: async (token) => {
    try {
      const response = await fetch(`${API_URL}/needs/my/posted`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get my needs error:', error);
      throw error;
    }
  },

  // Update need
  update: async (token, needId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/needs/${needId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update need error:', error);
      throw error;
    }
  },

  // Delete need
  delete: async (token, needId) => {
    try {
      const response = await fetch(`${API_URL}/needs/${needId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete need error:', error);
      throw error;
    }
  },
};
