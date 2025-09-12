"use server";

import { signIn } from "@/auth";
import { Message } from "@/types/message";

export default async function loginAction(
  formData: FormData
): Promise<Message> {
  try {
    const entries = Array.from(formData.entries());
    const data = Object.fromEntries(entries) as {
      username: string;
      password: string;
    };

    if (!data.username || !data.password) {
      return { success: false, message: "Preencha todos os campos" };
    }

    console.log("Attempting login for user:", data.username);
    
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    console.log("SignIn result:", result);
    
    // Check if result is a string (URL) which indicates success
    if (typeof result === "string") {
      console.log("Login successful, redirect URL:", result);
      return { 
        success: true, 
        message: "Login successful!",
        redirect: "/dashboard" // Force redirect to dashboard
      };
    }
    
    // Check if result exists and has no error
    if (result && !result.error) {
      console.log("Login successful");
      return { 
        success: true, 
        message: "Login successful!",
        redirect: "/dashboard" // Explicitly set redirect
      };
    } else {
      console.log("Sign in failed:", result?.error);
      return { 
        success: false, 
        message: result?.error || "Invalid credentials" 
      };
    }
  } catch (e: unknown) {
    console.error("Login error:", e);
    
    if (typeof e === "object" && e !== null) {
      if ("type" in e && e.type === "CredentialsSignin") {
        return { success: false, message: "Invalid Email or Password" };
      }
      
      if ("message" in e && typeof e.message === "string") {
        return { success: false, message: e.message };
      }
    }

    return { success: false, message: "Try again later!" };
  }
}