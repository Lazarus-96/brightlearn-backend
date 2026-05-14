"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input  from "@/components/ui/Input";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [form,   setForm]   = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login(form.email, form.password);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-navy p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid" aria-hidden="true"/>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" aria-hidden="true"/>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" aria-hidden="true"/>

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18"><polygon points="9,1.5 11,7 16.5,7 12,10.5 14,16 9,13 4,16 6,10.5 1.5,7 7,7" fill="white"/></svg>
          </div>
          <span className="font-display font-bold text-lg text-white">BrightLearn</span>
        </Link>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"/>
            <span className="text-white/80 text-sm font-medium">Trusted by 500+ schools</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Welcome back to<br/><span className="text-gradient">BrightLearn</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed">
            Your students, teachers, and data — all waiting for you. Sign in to continue building better learning outcomes.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[["1.2M","Students"],["98%","Satisfaction"],["500+","Schools"]].map(([n,l]) => (
              <div key={l} className="bg-white/5 border border-white/8 rounded-xl p-4">
                <div className="font-display text-2xl font-bold text-white">{n}</div>
                <div className="text-white/45 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/25 text-xs">© {new Date().getFullYear()} BrightLearn, Inc.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-[9px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18"><polygon points="9,1.5 11,7 16.5,7 12,10.5 14,16 9,13 4,16 6,10.5 1.5,7 7,7" fill="white"/></svg>
            </div>
            <span className="font-display font-bold text-base text-navy-800">BrightLearn</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-navy-800 tracking-tight mb-2">Sign in</h1>
            <p className="text-slate-500">New here? <Link href="/signup" className="text-primary font-semibold hover:underline">Create an account</Link></p>
          </div>

          {/* Social sign-in placeholder */}
          <button className="w-full flex items-center justify-center gap-3 h-11 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-100"/>
            <span className="text-slate-400 text-xs font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-100"/>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input label="Email address" name="email" type="email" placeholder="you@school.edu"
              value={form.email} onChange={handleChange} error={errors.email}
              required autoComplete="email"/>

            <div>
              <Input label="Password" name="password" type="password" placeholder="Your password"
                value={form.password} onChange={handleChange} error={errors.password}
                required autoComplete="current-password"/>
              <div className="flex justify-end mt-1.5">
                <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center mt-2">
              Sign in
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline hover:text-slate-600">Terms of Service</Link> and{" "}
            <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
