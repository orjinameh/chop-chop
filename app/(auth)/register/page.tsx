import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold text-ink mb-1">Create account</h1>
      <p className="text-sm text-ink-muted mb-6">Start ordering great food</p>
      <RegisterForm />
    </div>
  );
}
