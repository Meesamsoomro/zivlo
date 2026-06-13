"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [password, setPassword] = useState("");
  const [pitchContext, setPitchContext] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navy = "#0D1529";
  const gold = "#C8A84B";

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const user = JSON.parse(userData);
      // Redirect based on subscription status
      if (user.is_subscribed === true) {
        router.push('/appscreen');
      } else {
        router.push('/paywall');
      }
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!email || !password || !agreed || !pitchContext || !senderName) return;
    if (senderName.trim().length < 2 || senderName.trim().length > 50) {
      setError("Sender name must be between 2 and 50 characters.");
      return;
    }
    if (pitchContext.length < 20 || pitchContext.length > 150) {
      setError("Pitch context must be between 20 and 150 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, pitchContext, senderName: senderName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.error || 'Signup failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
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
        // Redirect with message
        if (data.user.is_subscribed === true) {
          router.push('/appscreen?message=Account created successfully!');
        } else {
          router.push('/paywall?message=Account created successfully! Please subscribe to continue.');
        }
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 border-b border-slate-100">
    <Logo onClick={() => router.push('/')} />

    <div className="flex items-center gap-8">
        <button
            onClick={() => router.push('/login')}
            className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition"
        >
            Already have an account?{" "}
            <span className="font-semibold" style={{ color: navy }}>
                Log in
            </span>
        </button>

        <button
            onClick={() => router.push('/forgot-password')}
            className="text-sm md:text-base  text-slate-600 hover:text-slate-900 transition"
            style={{ color: navy }}
        >
            Forgot password?
        </button>
    </div>
</nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Start finding
              <br />
              your next client
            </h1>
            <p className="text-slate-600">
              Built for UK B2B businesses. Set up in 60 seconds.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6 space-y-2">
            {[
              "Up to 5 searches per day at £19.99/month",
              "Cancel anytime — no contracts",
              "PECR-aware: filters sole traders and partnerships",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
                <Check
                  size={16}
                  style={{ color: gold }}
                  strokeWidth={3}
                  className="flex-shrink-0"
                />
                {item}
              </div>
            ))}
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg ${error.includes('already exists')
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
              <p className="text-sm">{error}</p>
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
                placeholder="you@yourstudio.co.uk"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:border-transparent text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                Sender name (This name appears on your pitch messages.)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:border-transparent text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3.5 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:border-transparent text-base bg-white text-slate-900 placeholder:text-slate-400"
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

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                In one sentence, what do you do and who do you help?
              </label>
              <input
                type="text"
                value={pitchContext}
                onChange={(e) => setPitchContext(e.target.value)}
                maxLength={150}
                placeholder="e.g. I'm a Birmingham accountant for hospitality businesses"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:border-transparent text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                disabled={loading}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${pitchContext.length < 20 || pitchContext.length > 150 ? 'text-red-500' : 'text-slate-400'}`}>
                  {pitchContext.length} / 150 characters (Min: 20)
                </span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 bg-white"
                style={{ backgroundColor: "#ffffff" }}
                disabled={loading}
              />
              <span className="text-sm text-slate-600 leading-relaxed" style={{ color: "#475569" }}>
                I agree to the{" "}
                <Link
                  href="/terms-conditions"
                  className="underline hover:text-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="underline hover:text-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                .
              </span>
                          </label>

            <button
              onClick={handleSubmit}
              disabled={!email || !senderName || senderName.trim().length < 2 || senderName.trim().length > 50 || !password || !agreed || !pitchContext || pitchContext.length < 20 || pitchContext.length > 150 || loading}
              className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{ backgroundColor: navy }}
            >
              {loading ? "Creating account..." : "Continue to payment"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}