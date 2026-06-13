"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navy = "#0D1529";

  useEffect(() => {
    // Get message from URL (for logout message)
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Clear message from URL after 4 seconds

      setMessage('');
      router.replace('/login');

    }

    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const user = JSON.parse(userData);
      if (user.is_subscribed === true) {
        router.push('/appscreen');
      } else {
        router.push('/paywall');
      }
    }
  }, [router, searchParams]);

  const handleSubmit = async () => {
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.success && data.token) {
        // Fetch detailed subscription info to have it ready
        try {
          const paymentRes = await fetch('/api/get-payment', {
            headers: {
              'Authorization': `Bearer ${data.token}`
            }
          });
          if (paymentRes.ok) {
            const paymentData = await paymentRes.json();
            if (paymentData.success && paymentData.payment) {
              localStorage.setItem('subscription', JSON.stringify(paymentData.payment));
            }
          }
        } catch (e) {
          console.log('Optional subscription fetch failed on login');
        }
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;

        // Redirect with message based on subscription status
        if (data.user.is_subscribed === true) {
          router.push('/appscreen?message=Login successful! Welcome back.');
        } else {
          router.push('/paywall?message=Login successful! Please subscribe to continue.');
        }
      } else {
        setError('Login failed - please try again');
        setLoading(false);
      }

    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 border-b border-slate-100">
        <Link href="/"><Logo /></Link>
        <Link
          href="/signup"
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition"
        >
          New to Zivlo?{" "}
          <span className="font-semibold" style={{ color: navy }}>
            Sign up
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h1>
            <p className="text-slate-600" style={{ color: "#475569" }}>Log in to start finding leads.</p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.co.uk"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: navy }}
                >
                  Password
                </label>

              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
                  style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-sm hover:underline font-medium"
                style={{ color: navy }}
              >
                Forgot?
              </Link>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!email || !password || loading}
              className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              style={{ backgroundColor: navy }}
            >
              {loading ? "Logging in..." : "Log in"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}