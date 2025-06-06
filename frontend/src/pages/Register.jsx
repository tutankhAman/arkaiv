import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Squares } from '../components/ui/Squares';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: checked
          ? [...prev.preferences, value]
          : prev.preferences.filter(p => p !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-800/50 relative overflow-hidden group">
            {/* Glass morphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative">
              <h2 className="text-center text-3xl font-bold text-white">
                Create Account
              </h2>
              <p className="mt-2 text-center text-gray-400">
                Join our community today
              </p>
            </div>
            
            <form className="space-y-6 relative" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 group-hover:text-blue-400">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="block w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 group-hover:text-blue-400">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 group-hover:text-blue-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="block w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 group-hover:text-blue-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="block w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600/50"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">AI Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['NLP', 'CV', 'Audio', 'Image', 'Other'].map((preference) => (
                    <div
                      key={preference}
                      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                        formData.preferences.includes(preference) ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => {
                        const newPreferences = formData.preferences.includes(preference)
                          ? formData.preferences.filter(p => p !== preference)
                          : [...formData.preferences, preference];
                        setFormData(prev => ({ ...prev, preferences: newPreferences }));
                      }}
                    >
                      <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{preference}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.preferences.includes(preference)
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-600 group-hover:border-indigo-400'
                            }`}>
                              {formData.preferences.includes(preference) && (
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
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>

            <div className="text-center relative">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 