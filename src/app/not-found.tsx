"use client"
import Link from "next/link";
import { Shield, AlertTriangle, Home, ArrowLeft, HomeIcon } from "lucide-react";

export default function Page() {
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
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fc5c00]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-2/3 w-96 h-96 bg-[#dcdcdc]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <img src="../images/dropzone_logo.png" className="h-13" alt="DROPZONE Logo" />
              <span className="text-xl font-medium tracking-tight">DROPZONE</span>
            </Link>
            
            <div className="flex items-center gap-3 px-3 py-1.5 border border-[#222222] rounded">
              <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-[#888888] tracking-widest">SYSTEM STATUS</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#fc5c00]/30 bg-[#fc5c00]/5 rounded mb-8">
              <AlertTriangle className="w-4 h-4 text-[#fc5c00]" />
              <span className="text-xs font-medium text-[#fc5c00] tracking-widest">
                OPERATIONAL ERROR 404
              </span>
            </div>

            <h1 className="text-7xl md:text-5xl font-light tracking-tight mb-6">
              <span className="text-white">TARGET</span>
              <span className="text-[#fc5c00]"> NOT</span>
              <span className="text-white"> FOUND</span>
            </h1>
            
            <p className="text-xl text-[#888888] max-w-2xl mx-auto mb-12 leading-relaxed">
              The requested operational coordinates could not be located. 
              The sector may have been compromised or intelligence is outdated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Error Code Panel */}
            <div className="border border-[#222222] bg-[#111111] p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-[#fc5c00]" />
                <h3 className="text-lg font-medium">ERROR DIAGNOSTICS</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-[#fc5c00]/20 animate-ping rounded-lg" />
                  <div className="relative border border-[#333333] bg-black p-6 rounded">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <div className="absolute inset-0 border-2 border-[#fc5c00] rounded-full animate-pulse" />
                        <div className="absolute inset-4 border-2 border-[#fc5c00]/50 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#fc5c00]">404</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#888888] tracking-widest">SECTOR NOT FOUND</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-[#888888]">Timestamp</span>
                  <span suppressHydrationWarning className="font-mono">
                    {new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '')} UTC
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="border border-[#222222] bg-[#111111] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-5 border border-[#fc5c00] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#dcdcdc] rounded-full" />
                </div>
                <h3 className="text-lg font-medium">RECOMMENDED ACTIONS</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border bg-[#fc5c00] border-[#222222] hover:border-[#333333] transition-colors group cursor-pointer">
                  <a href="./" className="flex items-center justify-left gap-3 mb-2">
                    <HomeIcon className="w-4 h-4 text-white" />
                    <span className="font-medium">Return to Command</span>
                  </a>
                  <p className="text-sm text-[#dcdcdc]">Navigate back to operational headquarters</p>
                </div>
                
                <div className="p-4 border border-[#222222] hover:border-[#333333] transition-colors group cursor-pointer">
                  <a href="./" className="flex items-center justify-between mb-2">
                    <span className="font-medium">Previous Sector</span>
                    <ArrowLeft className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* System Status Footer */}
          <div className="text-center pt-8 border-t border-[#222222]">
            <div className="inline-flex items-center gap-6 text-sm text-[#555555]">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                SYSTEMS OPERATIONAL
              </span>
              <span>•</span>
              <span>SECURITY CLEARANCE: LEVEL 4</span>
              <span>•</span>
              <span>VERSION 3.2.1</span>
            </div>
            
            <p className="text-xs text-[#444444] mt-4">
              © { new Date().getFullYear() } DROPZONE TACTICAL SYSTEMS. ALL OPERATIONS RECORDED.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}