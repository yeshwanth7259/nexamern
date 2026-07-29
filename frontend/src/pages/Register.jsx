import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Register = () => {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { referredByCode: refCode }
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await api.post('/auth/register', data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (!error.response) {
        toast.error('Network Error: Cannot connect to the server.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative overflow-hidden py-12">
      {/* 3D ambient light orbs */}
      <div className="absolute top-[10%] left-[-5%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full p-8 glass-panel rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">Create Account</h1>
          <p className="text-slate-300/80 text-sm font-medium">Start your investment journey</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              {...register('fullName', { required: 'Name is required' })}
              className="w-full px-4 py-3 input-glass rounded-xl transition-all"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 input-glass rounded-xl transition-all"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mobile Number</label>
            <input 
              type="text" 
              {...register('mobile', { required: 'Mobile is required' })}
              className="w-full px-4 py-3 input-glass rounded-xl transition-all"
              placeholder="+1234567890"
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-400">{errors.mobile.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              className="w-full px-4 py-3 input-glass rounded-xl transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Referral Code (Optional)</label>
            <input 
              type="text" 
              {...register('referredByCode')}
              className="w-full px-4 py-3 input-glass rounded-xl transition-all"
              placeholder="REF1234"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all disabled:opacity-70 flex justify-center mt-6"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-white hover:text-blue-300 hover:underline transition-colors ml-1">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
