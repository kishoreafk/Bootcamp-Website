import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Phone, ArrowRight } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOTP = trpc.auth.sendOTP.useMutation({
    onSuccess: () => {
      navigate("/verify-otp", { state: { phone } });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone || phone.length < 5) {
      setError("Please enter a valid phone number");
      return;
    }
    sendOTP.mutate({ phone });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f6f5f1" }}>
      {/* Left Image Panel */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="/images/login-panel.jpg"
          alt="Fashion transformation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(26,26,26,0.3) 0%, transparent 100%)",
          }}
        />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <h2
            className="font-display text-4xl font-normal leading-tight"
            style={{ color: "#f6f5f1" }}
          >
            Transform What You Treasure
          </h2>
          <p
            className="font-body font-light text-base mt-4"
            style={{ color: "rgba(246, 245, 241, 0.8)" }}
          >
            Give your cherished garments a second life through AI-powered redesign.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div
            className="opacity-0 animate-fade-in"
            style={{
              animation: "fadeInUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards",
            }}
          >
            <h1
              className="font-display text-4xl font-normal"
              style={{ color: "#1a1a1a" }}
            >
              Welcome Back
            </h1>
            <p
              className="font-body font-light text-base mt-3"
              style={{ color: "#9c9c8e" }}
            >
              Continue your transformation journey.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: "#9c9c8e" }}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-14 pl-12 pr-4 rounded-xl font-body text-base outline-none transition-all duration-150"
                    style={{
                      backgroundColor: "#eae7de",
                      color: "#1a1a1a",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {error && (
                  <p className="font-body text-sm mt-2" style={{ color: "#c45c4a" }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sendOTP.isPending}
                className="w-full h-14 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 disabled:opacity-60"
                style={{
                  backgroundColor: "#7a7a5e",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  if (!sendOTP.isPending)
                    e.currentTarget.style.backgroundColor = "#5c5c48";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#7a7a5e";
                }}
              >
                {sendOTP.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />
              <span className="font-body text-xs" style={{ color: "#9c9c8e" }}>
                or continue with
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />
            </div>

            <button
              className="w-full h-14 mt-6 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-3 transition-all duration-250"
              style={{
                backgroundColor: "#eae7de",
                color: "#1a1a1a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dddad0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#eae7de";
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <p className="mt-8 text-center font-body text-sm" style={{ color: "#9c9c8e" }}>
              New to Weaver?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium transition-colors duration-250"
                style={{ color: "#7a7a5e" }}
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
