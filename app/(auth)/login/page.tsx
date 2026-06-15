import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold text-ink mb-1">Welcome back</h1>
      <p className="text-sm text-ink-muted mb-6">Sign in to your account</p>
      <LoginForm />
    </div>
  );
}
