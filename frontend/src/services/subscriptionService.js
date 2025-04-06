const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 502 && i < retries - 1) {
          // Wait for 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
      return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export const subscriptionService = {
  async checkSubscriptionStatus(email) {
    return fetchWithRetry(`${API_URL}/subscription/status?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  async subscribe(email) {
    return fetchWithRetry(`${API_URL}/subscription/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });
  },

  async unsubscribe(email) {
    return fetchWithRetry(`${API_URL}/subscription/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });
  }
}; 