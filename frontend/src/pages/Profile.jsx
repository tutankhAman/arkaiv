import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Squares } from '../components/ui/Squares';

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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333" 
          hoverFillColor="#222"
        />
      </div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl transform transition-all duration-500 hover:scale-[1.02]">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-800/50 relative overflow-hidden group">
            {/* Glass morphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-900/50 border border-green-800 text-green-200 px-4 py-3 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]">
                  {success}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-white">Personal Information</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 transition-colors duration-200 group-hover:text-indigo-400">Username</label>
                      <p className="mt-1 text-sm text-white">{user.username}</p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 transition-colors duration-200 group-hover:text-indigo-400">Email</label>
                      <p className="mt-1 text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-white">AI Preferences</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {['NLP', 'CV', 'Audio', 'Image', 'Other'].map((preference) => (
                      <div
                        key={preference}
                        className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                          preferences.includes(preference) ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => {
                          const newPreferences = preferences.includes(preference)
                            ? preferences.filter(p => p !== preference)
                            : [...preferences, preference];
                          setPreferences(newPreferences);
                        }}
                      >
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{preference}</span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                preferences.includes(preference)
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-gray-600 group-hover:border-indigo-400'
                              }`}>
                                {preferences.includes(preference) && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                              {preference === 'NLP' && 'Natural Language Processing'}
                              {preference === 'CV' && 'Computer Vision'}
                              {preference === 'Audio' && 'Audio Processing'}
                              {preference === 'Image' && 'Image Generation'}
                              {preference === 'Other' && 'Other AI Technologies'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 