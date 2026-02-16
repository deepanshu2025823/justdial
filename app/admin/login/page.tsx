// app/admin/login/page.tsx

"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ChevronLeft, ShieldCheck, ArrowRight, Loader2, Globe } from "lucide-react";

export default function AdminLogin() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email, password }),
      });

      if (res.ok) {
        setStep("otp");
      } else {
        const msg = await res.text();
        setError(msg || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join(""); 
    
    if (finalOtp.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email, otp: finalOtp }),
      });

      if (res.ok) {
        router.push("/admin/dashboard"); 
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; 

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6); 
    if (!/^\d+$/.test(pastedData)) return; 

    const digits = pastedData.split("");
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
    
    const focusIndex = Math.min(digits.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative font-sans">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-[#0073c1] font-medium transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md border border-slate-100 z-50"
      >
        <ChevronLeft size={18} />
        <span className="text-sm">Back to Homepage</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[1000px] flex overflow-hidden border border-slate-100 min-h-[600px] relative z-10">
        
        <div className="hidden md:flex flex-col justify-between w-1/2 relative p-12 text-white">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
               alt="JustDial Office" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-[#0073c1] mix-blend-multiply opacity-90"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-80"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="text-blue-200" size={28} />
              <span className="text-lg font-bold tracking-wide uppercase">Admin Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Manage Your <br/> Business Empire.
            </h1>
            <p className="text-blue-100 text-base leading-relaxed opacity-90">
              Access real-time analytics, manage listings, and track leads securely from one centralized dashboard.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShieldCheck size={24} className="text-green-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Security Status</p>
                <p className="text-sm font-semibold text-white">256-bit SSL Encryption Active</p>
              </div>
            </div>
            <p className="text-[10px] text-blue-200 mt-6 opacity-60">© 2026 JustDial. Authorized Personnel Only.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">
              {step === "credentials" ? "Welcome Back" : "Security Check"}
            </h2>
            <p className="text-slate-500 mt-2">
              {step === "credentials" ? "Please enter your details to sign in." : `We've sent a 6-digit verification code to:`}
            </p>
            {step === "otp" && (
                <p className="text-[#0073c1] font-semibold text-sm mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">{email}</p>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-600 px-4 py-3 rounded-r-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#0073c1] transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#0073c1] outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                    placeholder="admin@justdial.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  <Link href="#" className="text-xs text-[#0073c1] font-semibold hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#0073c1] transition-colors" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#0073c1] outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0073c1] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify Credentials <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">Enter Verification Code</label>
                
                <div className="flex justify-between gap-2 md:gap-3" onPaste={handlePaste}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={el => { otpInputRefs.current[index] = el; }} 
                            value={data}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            className="w-10 h-12 md:w-14 md:h-16 border-2 border-slate-200 rounded-xl text-center text-xl md:text-2xl font-bold text-slate-700 focus:border-[#0073c1] focus:bg-blue-50/30 outline-none transition-all shadow-sm focus:shadow-md focus:-translate-y-1"
                        />
                    ))}
                </div>

                <div className="flex justify-between items-center mt-6 text-sm">
                  <span className="text-slate-400">Code expires in 04:59</span>
                  <button type="button" onClick={() => setStep("credentials")} className="text-[#0073c1] font-bold hover:underline">Resend Code</button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Access Dashboard <ShieldCheck size={18} /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}