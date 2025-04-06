import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setPreferences(userData.preferences || []);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setPreferences(prev =>
      checked
        ? [...prev, value]
        : prev.filter(p => p !== value)
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.updatePreferences(user.id, preferences);
      const updatedUser = { ...user, preferences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">AI Preferences</h2>
              <div className="mt-4 space-y-2">
                {['NLP', 'CV', 'Audio', 'Image', 'Other'].map((preference) => (
                  <div key={preference} className="flex items-center">
                    <input
                      id={preference}
                      type="checkbox"
                      value={preference}
                      checked={preferences.includes(preference)}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={preference} className="ml-2 block text-sm text-gray-900">
                      {preference}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 