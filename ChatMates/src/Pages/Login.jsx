// import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Lock, EyeOff, Eye, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const {login, isLoggingIn} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-6 sm:p-12 bg-base-100 shadow-lg rounded-lg">
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Login</h1>
              {/* <p className="text-base-content/60">Create a new account</p> */}
            </div>
          </div>
  
          <form className="space-y-6" onSubmit={handleSubmit}>
          
  
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-6 text-base-content/60" />
                  
                </div>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
  
            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-6 text-base-content/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-6 text-base-content/40" />
                  ) : (
                    <Eye className="size-6 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
  
            {/* Submit Button */}
            <button className="btn btn-primary w-full" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
  
            {/* Signjp Link */}
            <div className="text-center">
              <p className="text-base-content/60">
                New to ChatMates?{" "}
                <Link to="/signup" className="text-primary font-medium">
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login