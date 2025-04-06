const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const toolService = {
  async getTrendingTools() {
    const response = await fetch(`${API_URL}/tools`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }
    return response.json();
  },

  async getToolCount() {
    const response = await fetch(`${API_URL}/tools/count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tool count');
    }
    return response.json();
  }
}; 