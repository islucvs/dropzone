"use client"
import PasswordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginAction from "@/utils/auth/loginAction";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = new FormData(event.target as HTMLFormElement);
      const result = await loginAction(data);

      if (!result.success) {
        toast.error(result.message);
        setLoading(false);
        return;
      }

      // Show success message
      toast.success(result.message);
      
      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh(); // Refresh to update auth state
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-screen w-full relative flex flex-col gap-10 items-end-safe justify-center pr-40 bg-[#000]">
        <img className="absolute left-0 bottom-0 h-[100%] w-[100vh]" src="/images/dropzone.png" alt="Dropzone background" />
        <form
          onSubmit={handleSubmit}
          className="z-10 w-full md:w-[400px] bg-transparent py-10"
        >
          <div className="inline-flex">
            <div className="relative align-left justify-self-start">
              <img src="/images/dropzone_logo.jpg" alt="Dropzone logo" className="relative h-20" />
            </div>

            <div className="text-left inline-grid grid-cols-1 col-span-2 pl-9">
              <h1 className="text-3xl tracking-widest">DROPZONE</h1>
              <h5 className="w-full">
                Combat Simulation Platform
              </h5>
            </div>
          </div>

          <div className="mb-3 mt-9">
            <Label htmlFor="username" className="mb-2">
              ID:
            </Label>
            <Input
              name="username"
              type="text"
              id="username"
              disabled={loading}
              placeholder="Type your ID"
              required
            />
          </div>

          <PasswordInput placeholder="Password" disabled={loading} />

          <div>
            <Button
              type="submit"
              className="text-white w-full cursor-pointer mt-5 bg-[#ff5C00]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Conectando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
    </div>
  );
}