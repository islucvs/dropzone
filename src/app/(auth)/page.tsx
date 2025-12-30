"use client"

import PassowordInputs from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginAction from "@/utils/auth/loginAction";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Shield, Lock, User, Terminal, AlertTriangle, HashIcon } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("IDLE");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("AUTHENTICATING");

    try {
      const data = new FormData(event.target as HTMLFormElement);
      const result = await loginAction(data);

      if (!result.success) {
        setStatus("FAILED");
        toast.error(result.message);
        setLoading(false);
        return;
      }

      setStatus("ACCESS_GRANTED");
      toast.success("Access authorized. Deploying to command center...");
      
      // Brief delay for visual feedback
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Authentication error:", error);
      setStatus("ERROR");
      toast.error("Security breach detected. System lockdown initiated.");
    } finally {
      if (status !== "ACCESS_GRANTED") {
        setTimeout(() => setLoading(false), 1000);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`v-${i}`} 
            className="absolute top-0 bottom-0 w-px bg-[#222222]/10"
            style={{ left: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute left-0 right-0 h-px bg-[#222222]/10"
            style={{ top: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* Terminal Scan Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#fc5c00] to-transparent animate-[scanline_4s_linear_infinite]" />

      {/* Glow Effects */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#fc5c00]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#dcdcdc]/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="container mx-auto p-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md relative">
          {/* Status Indicator */}
          <div className="absolute -top-16 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-3 px-4 py-2 border border-[#222222] bg-[#111111] rounded">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                status === "IDLE" ? "bg-[#ffaa00]" :
                status === "AUTHENTICATING" ? "bg-[#00aaff]" :
                status === "ACCESS_GRANTED" ? "bg-[#00ff88]" :
                status === "FAILED" ? "bg-[#ff4444]" :
                "bg-[#ff4444]"
              }`} />
              <span className="text-xs font-medium text-[#888888] tracking-widest">
                {status === "IDLE" ? "AWAITING CREDENTIALS" :
                 status === "AUTHENTICATING" ? "VALIDATING ACCESS" :
                 status === "ACCESS_GRANTED" ? "ACCESS AUTHORIZED" :
                 status === "FAILED" ? "AUTHENTICATION FAILED" :
                 "SYSTEM ERROR"}
              </span>
            </div>
          </div>

          {/* Login Card */}
          <div className="border border-[#222222] bg-[#111111] p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src="../images/dropzone_logo.png" className="h-13" alt="DROPZONE Logo" />
                <h1 className="text-2xl font-medium tracking-tight">DROPZONE</h1>
              </div>
              <Shield className="w-5 h-5 text-[#fc5c00]" />
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">SECURE ACCESS TERMINAL</h2>
              <p className="text-sm text-[#888888]">
                Tactical command interface. Authorized personnel only.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Operator ID */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                    <HashIcon className="w-4 h-4" />
                    TACTICAL ID
                  </Label>
                  <span className="text-xs text-[#555555] font-mono">REQUIRED</span>
                </div>
                <div className="relative">
                  <Input
                    name="username"
                    type="text"
                    id="username"
                    disabled={loading}
                    placeholder="Enter tactical ID"
                    required
                    className="pl-10 bg-[#0a0a0a] border-[#333333] focus:border-[#fc5c00] focus:ring-1 focus:ring-[#fc5c00]/20"
                  />
                  <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888888]" />
                </div>
              </div>

              {/* Security Key */}
              <div className="mb-8">
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
                  placeholder="Enter security key"
                  disabled={loading}
                />
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
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>INITIATE DEPLOYMENT</span>
                    </>
                  )}
                </div>
              </Button>

              <div className="text-[#666666] p-2 mt-2 text-center">
              <p className="text-xs mt-1">New to our game? <a href="/registration" className="text-[#fc5c00] hover:underline">Create your terminal</a></p>
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
              <p>© { new Date().getFullYear() } DROPZONE TACTICAL SYSTEMS. UNAUTHORIZED ACCESS PROHIBITED </p>
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}