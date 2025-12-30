"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import registerAction from "@/utils/auth/registerAction";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Shield, User, Lock, Mail, Hash, AlertTriangle, Check } from "lucide-react";
import PassowordInputs from "@/components/form/password-input";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);
  
  try {

    // Prepare form data for backend
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('username', formData.username.trim());
    data.append('email', formData.email.trim());
    data.append('password', formData.password);

    // Call the register action
    const result = await registerAction(data, false);

    if (!result.success) {
      // Just call toast.error, don't return it
      toast.error(result.message, { duration: result.duration || 4000 });
      setLoading(false);
      return;
    }

    // Just call toast.success, don't return it
    toast.success("Operational unit created successfully! Redirecting to command center...");
    
    // Redirect to dashboard after successful registration
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 2000);
    
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Security protocol violation detected. Please try again.");
  } finally {
    setLoading(false);
  }
  };
  
  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={`v-${i}`} 
            className="absolute top-0 bottom-0 w-px bg-[#222222]/10"
            style={{ left: `${i * 4}%` }}
          />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute left-0 right-0 h-px bg-[#222222]/10"
            style={{ top: `${i * 4}%` }}
          />
        ))}
      </div>

      {/* Terminal Scan Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#fc5c00] to-transparent animate-[scanline_5s_linear_infinite]" />

      {/* Glow Effects */}
      <div className="absolute top-1/4 -left-60 w-[800px] h-[800px] bg-[#fc5c00]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] bg-[#dcdcdc]/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-md relative">
          {/* Registration Card */}
          <div className="border border-[#222222] bg-[#111111] p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src="../images/dropzone_logo.png" className="h-13" alt="DROPZONE Logo" />
                <div>
                  <h1 className="text-2xl font-medium tracking-tight">DROPZONE</h1>
                  <p className="text-sm text-[#888888]">Tactical Warfare Platform</p>
                </div>
              </div>
              <Shield className="w-6 h-6 text-[#fc5c00]" />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">UNIT CREATION PROTOCOL</h2>
              <p className="text-sm text-[#888888]">
                Register your operational unit for battlefield deployment. All fields are required.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    OPERATOR NAME
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">REQUIRED</span>
                </div>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your full name"
                  required
                  className="bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20"
                />
              </div>

              {/* Username Field */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    TACTICAL ID
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">UNIQUE IDENTIFIER</span>
                </div>
                <Input
                  name="username"
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., GHOST-01"
                  required
                  className="bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20 font-mono"
                />
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    EMAIL ADDRESS
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">REQUIRED FOR COMMS</span>
                </div>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="secure@comms.dropzone"
                  required
                  className="bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    SECURITY KEY
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">ENCRYPTED</span>
                </div>
                <PassowordInputs
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create your security key"
                  disabled={loading}
                  className="bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className={`text-xs ${formData.password.length >= 8 ? 'text-[#00ff88]' : 'text-[#888888]'}`}>
                    {formData.password.length >= 8 ? '✓ 8+ characters' : '• 8+ characters'}
                  </div>
                  <div className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-[#00ff88]' : 'text-[#888888]'}`}>
                    {/[A-Z]/.test(formData.password) ? '✓ Uppercase letter' : '• Uppercase letter'}
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    CONFIRM SECURITY KEY
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">MATCH REQUIRED</span>
                </div>
                <PassowordInputs 
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your security key"
                  disabled={loading}
                  className="bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20"
                />
                {formData.password && formData.confirmPassword && (
                  <div className={`mt-2 text-xs ${formData.password === formData.confirmPassword ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
                    {formData.password === formData.confirmPassword ? '✓ Encryption keys match' : '✗ Encryption keys do not match'}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#fc5c00] to-[#d44a00] group-hover:from-[#d44a00] group-hover:to-[#fc5c00] transition-all" />
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin w-4 h-4" />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ACTIVATE OPERATIONAL UNIT</span>
                    </>
                  )}
                </div>
              </Button>

              <div className="text-[#666666] p-2 mt-2 text-center">
                <p className="text-xs mt-1">Already have an operational unit? <a href="/" className="text-[#fc5c00] hover:underline">Access command terminal</a></p>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-4 border border-[#333333] bg-[#0a0a0a]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#ffaa00] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">BETA ACCESS</h4>
                    <p className="text-xs text-[#888888]">
                      This terminal is part of our open beta program.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-[#555555] mb-4">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                SYSTEMS: ACTIVE
              </span>
              <span>•</span>
              <span>SECURITY: LEVEL 4</span>
              <span>•</span>
              <span>vDEMO</span>
            </div>
            
            <div className="text-xs text-[#444444]">
              <p>© { new Date().getFullYear() } DROPZONE TACTICAL SYSTEMS. UNAUTHORIZED REGISTRATION PROHIBITED.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}