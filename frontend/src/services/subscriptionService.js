const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const subscriptionService = {
  async checkSubscriptionStatus(email) {
    const response = await fetch(`${API_URL}/subscription/status?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }
    return response.json();
  },

  async subscribe(email) {
    const response = await fetch(`${API_URL}/subscription/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe');
    }
    return response.json();
  },

  async unsubscribe(email) {
    const response = await fetch(`${API_URL}/subscription/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unsubscribe');
    }
    return response.json();
  }
}; 