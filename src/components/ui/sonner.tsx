"use client"

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner"
import { Shield, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react"

// Custom Sonner Toaster component
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
          title: "text-sm font-medium tracking-tight",
          description: "text-xs opacity-90",
          actionButton: "inline-flex h-8 shrink-0 items-center justify-center rounded-md text-xs font-medium",
          cancelButton: "inline-flex h-8 shrink-0 items-center justify-center rounded-md text-xs font-medium",
          error: "border-[#ff3333]/20 bg-[#1a0a0a] text-white",
          success: "border-[#00ff88]/20 bg-[#0a1a0f] text-white",
          warning: "border-[#ffaa00]/20 bg-[#1a150a] text-white",
          info: "border-[#00aaff]/20 bg-[#0a0f1a] text-white",
          default: "border-[#333333] bg-[#111111] text-white",
        },
      }}
    />
  )
}

// SIMPLEST FIX: Just use sonnerToast directly, don't wrap it
// Or create a very simple wrapper that doesn't break React
export const toast = {
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  tactical: (message: string, description?: string) => {
    return sonnerToast.custom((t) => (
      <div className="group border border-[#fc5c00]/20 bg-[#1a0d05] p-4 rounded-lg shadow-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#fc5c00] flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white tracking-tight">TACTICAL ALERT</h3>
              <button
                onClick={() => sonnerToast.dismiss(t)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#888888] hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-white mt-1">{message}</p>
            {description && (
              <p className="text-xs text-[#888888] mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    ), {
      duration: 6000,
    })
  }
}