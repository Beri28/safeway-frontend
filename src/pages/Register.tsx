import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../api';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const cameroonRegions = [
  'Adamawa', 'Centre', 'East', 'Far North', 'Littoral',
  'North', 'North-West', 'South', 'South-West', 'West'
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', region: '', agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string): boolean => /^((\+237|237)?[2368]\d{8})$/.test(phone.replace(/\s/g, ''));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    // if (!formData.phone) newErrors.phone = 'Phone number is required';
    // else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid Cameroon phone number';
    // if (!formData.region) newErrors.region = 'Please select your region';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setAlertMessage('');
    try {
      // Only use name, email, password for backend registration
      const name = formData.firstName + ' ' + formData.lastName;
      const res = await apiRegister(name, formData.email, formData.password);
      setAlertMessage('Registration successful! Redirecting...');
      setAlertType('success');
      login(res.user, res.token);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err: any) {
      setAlertMessage(err?.response?.data?.message || 'Registration failed. Please try again.');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-gray-700">Your trusted partner for bus travel across Cameroon</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#00796B] mb-2">Create Account</h2>
            <p className="text-gray-600 text-sm">Join thousands of travelers across Cameroon</p>
          </div>
          {alertMessage && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${alertType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {alertType === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm">{alertMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="text" value={formData.firstName} onChange={handleInputChange('firstName')} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter first name" />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={handleInputChange('lastName')} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter last name" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="tel" value={formData.phone} onChange={handleInputChange('phone')} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+237 6XX XXX XXX" />
                </div>
                {errors.phone ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p> : <p className="text-gray-500 text-xs mt-1">Format: +237XXXXXXXXX or 6XXXXXXXX</p>}
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select title="region" value={formData.region} onChange={handleInputChange('region')} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent bg-white ${errors.region ? 'border-red-500' : 'border-gray-300'}`}> 
                    <option value="">Select your region</option>
                    {cameroonRegions.map(region => <option key={region} value={region}>{region}</option>)}
                  </select>
                </div>
                {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
              </div> */}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              <div>
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={!!formData.agreeToTerms} onChange={handleInputChange('agreeToTerms')} className="mt-1 accent-[#00796B]" />
                  <span className="text-sm text-gray-700">I agree to the <a href="#" className="text-[#00796B] underline">terms and conditions</a></span>
                </label>
                {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-[#00796B] text-white font-semibold rounded-lg shadow-md hover:bg-[#005a4f] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <Link to="/login" className="text-[#00796B] hover:underline font-medium">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
