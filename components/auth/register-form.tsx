"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
  });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())            e.name     = "Name is required";
    if (!form.email.trim())           e.email    = "Email is required";
    if (form.password.length < 8)     e.password = "At least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error ?? "Registration failed" });
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      await signIn("credentials", {
        email:    form.email,
        password: form.password,
        redirect: false,
      });

      toast.success("Account created! Welcome to Chop Chop.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value:    form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    error: errors[key],
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Full Name"        placeholder="Chidi Okeke"       {...field("name")}     />
      <Input label="Email"  type="email" placeholder="you@email.com"  {...field("email")}    />
      <Input label="Password" type="password" placeholder="Min 8 chars" {...field("password")} />
      <Input label="Confirm Password" type="password" placeholder="Repeat password" {...field("confirm")} />

      <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
        {loading ? <><Spinner size="sm" /> Creating account…</> : "Create account"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
