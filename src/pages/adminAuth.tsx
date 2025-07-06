import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin, login as apiLogin } from '../api';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const AdminAuth: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const { user,login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setAlertMessage('');
    try {
      const res = await adminLogin(formData.email, formData.password);
      setAlertMessage('Login successful! Redirecting...');
      setAlertType('success');
      login(res.user, res.token);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err: any) {
      console.log(err)
      setAlertMessage(err?.response?.data?.message || 'Login failed. Please check your credentials.');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    if(user && user.role==='admin'){
      navigate('/admin')
      return
    }
  },[user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#00796B] p-4 rounded-full shadow-lg">
              <DirectionsBusFilledIcon sx={{ fontSize: 48, color: '#fff' }} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-[#111] mb-2 tracking-tight drop-shadow-sm">SafeWay</h1>
          <p className="text-gray-700">Admin authentication</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#00796B] mb-2">Welcome</h2>
            <p className="text-gray-600 text-sm">Fill in info to access admin dashboard</p>
          </div>
          {alertMessage && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${alertType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {alertType === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm">{alertMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="email" value={formData.email} onChange={handleInputChange('email')} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your email" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange('password')} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-[#00796B] text-white font-semibold rounded-lg shadow-md hover:bg-[#005a4f] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;