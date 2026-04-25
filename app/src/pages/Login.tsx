import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { Phone, ArrowRight } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOTP = trpc.auth.sendOTP.useMutation({
    onSuccess: (data) => {
      navigate("/verify-otp", { state: { phone, message: data.message } });
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
