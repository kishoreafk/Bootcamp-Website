import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyOTP() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as { phone?: string; message?: string } | null;
  const phone = routeState?.phone || "";
  const [notice, setNotice] = useState(routeState?.message || "");

  useEffect(() => {
    if (!phone) {
      navigate("/login");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [phone, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const verifyOTP = trpc.auth.verifyOTP.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }
      if (data.isNewUser) {
        navigate("/profile-setup");
      } else {
        navigate("/home");
      }
    },
    onError: (err) => {
      setError(err.message);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const sendOTP = trpc.auth.sendOTP.useMutation({
    onSuccess: (data) => {
      setResendTimer(30);
      setError("");
      setNotice(data.message);
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d) && newDigits.join("").length === 6) {
      verifyOTP.mutate({ phone, code: newDigits.join("") });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      sendOTP.mutate({ phone });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#f6f5f1" }}
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 font-body text-sm transition-colors duration-250 mb-8"
          style={{ color: "#7a7a5e" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1
          className="font-display text-4xl font-normal"
          style={{ color: "#1a1a1a" }}
        >
          Enter OTP
        </h1>
        <p
          className="font-body font-light text-base mt-3"
          style={{ color: "#9c9c8e" }}
        >
          We sent a 6-digit code to {phone}
        </p>
        {notice && (
          <p className="font-body text-sm mt-3" style={{ color: "#7a7a5e" }}>
            {notice}
          </p>
        )}

        <div className="mt-10 flex gap-3 justify-center">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center font-body text-xl rounded-lg outline-none transition-all duration-150"
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
          ))}
        </div>

        {error && (
          <p className="text-center font-body text-sm mt-4" style={{ color: "#c45c4a" }}>
            {error}
          </p>
        )}

        {verifyOTP.isPending && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-5 h-5 border-2 border-[#7a7a5e] border-t-transparent rounded-full animate-spin" />
            <span className="font-body text-sm" style={{ color: "#7a7a5e" }}>
              Verifying...
            </span>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || sendOTP.isPending}
            className="font-body text-sm inline-flex items-center gap-2 transition-colors duration-250 disabled:opacity-40"
            style={{ color: "#7a7a5e" }}
          >
            <RefreshCw className={`w-4 h-4 ${sendOTP.isPending ? "animate-spin" : ""}`} />
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
