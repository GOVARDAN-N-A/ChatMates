import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { MessageSquare, User, Lock, EyeOff, Eye, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const isTemporaryEmail = async (email) => {
    const domain = email.split("@")[1];
  
    try {
      const response = await fetch(`https://open.kickbox.com/v1/disposable/${domain}`);
      const result = await response.json();
  
      return result.disposable;
    } catch (error) {
      console.error("Error checking disposable email:", error);
      return false;
    }
  };

  const validateForm = async (formData) => {
    const { fullname, email, password } = formData;
  
    if (!fullname.trim()) return toast.error("Full name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");
  
    let isTempEmail = false;
    try {
      isTempEmail = await isTemporaryEmail(email);
    } catch (error) {
      console.warn("Temporary email check failed. Proceeding without validation.");
    }
  
    if (isTempEmail) return toast.error("Temporary email addresses are not allowed");
    if (!password.trim()) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password should be at least 6 characters long");
  
    return true; 
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = await validateForm(formData); // Ensure async validation

    if (isFormValid) {
      console.log("Form data:", formData);
      
        await signup(formData); // Call the `signup` function
    }
};


  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-6 sm:p-12 bg-base-100 shadow-lg rounded-lg">
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              {/* <p className="text-base-content/60">Create a new account</p> */}
            </div>
          </div>
  
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-6 text-base-content/60" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
              </div>
            </div>
  
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
            <button className="btn btn-primary w-full" type="submit" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
  
            {/* Login Link */}
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default Signup