import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

const STYLE_OPTIONS = ["Minimalist", "Vintage", "Bohemian", "Modern Classic", "Avant-Garde"];
const FIT_OPTIONS = ["fitted", "relaxed", "oversized"] as const;

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [preferredFit, setPreferredFit] = useState<(typeof FIT_OPTIONS)[number]>("relaxed");
  const [sustainabilityPriority, setSustainabilityPriority] = useState(7);
  const navigate = useNavigate();
  const { user } = useAuth();

  const createProfile = trpc.user.createProfile.useMutation({
    onSuccess: () => {
      navigate("/home");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stylePreference) return;
    createProfile.mutate({
      name,
      stylePreference,
      preferredFit,
      sustainabilityPriority,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6f5f1" }}>
        <div className="w-8 h-8 border-2 border-[#7a7a5e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#7a7a5e" }}>
            <span className="font-body text-xs font-medium" style={{ color: "#fff" }}>1</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#eae7de" }}>
            <span className="font-body text-xs font-medium" style={{ color: "#9c9c8e" }}>2</span>
          </div>
        </div>
        <p className="font-body text-xs mb-10" style={{ color: "#9c9c8e" }}>Step 1 of 2</p>

        <h1 className="font-display text-4xl font-normal" style={{ color: "#1a1a1a" }}>
          Tell Us About You
        </h1>
        <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
          Help us create designs that match your style.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Name */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150"
              style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Style Preference */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Style Preference
            </label>
            <div className="relative">
              <select
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150 appearance-none"
                style={{ backgroundColor: "#eae7de", color: stylePreference ? "#1a1a1a" : "#9c9c8e" }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <option value="">Select your style</option>
                {STYLE_OPTIONS.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" style={{ color: "#9c9c8e" }} />
            </div>
          </div>

          {/* Preferred Fit */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Preferred Fit
            </label>
            <div className="flex gap-3">
              {FIT_OPTIONS.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setPreferredFit(fit)}
                  className="flex-1 h-12 rounded-lg font-body text-sm font-medium capitalize transition-all duration-250"
                  style={{
                    backgroundColor: preferredFit === fit ? "#7a7a5e" : "#eae7de",
                    color: preferredFit === fit ? "#fff" : "#1a1a1a",
                  }}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Sustainability Priority */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Sustainability Priority
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={sustainabilityPriority}
                onChange={(e) => setSustainabilityPriority(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #7a7a5e ${(sustainabilityPriority - 1) * 11.11}%, #eae7de ${(sustainabilityPriority - 1) * 11.11}%)`,
                }}
              />
              <span className="font-body text-lg font-medium w-8 text-center" style={{ color: "#7a7a5e" }}>
                {sustainabilityPriority}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-body text-xs" style={{ color: "#9c9c8e" }}>Low</span>
              <span className="font-body text-xs" style={{ color: "#9c9c8e" }}>High</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name || !stylePreference || createProfile.isPending}
            className="w-full h-14 rounded-lg font-body text-sm font-medium transition-all duration-250 disabled:opacity-50 mt-8"
            style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            onMouseEnter={(e) => { if (!createProfile.isPending) e.currentTarget.style.backgroundColor = "#5c5c48"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
          >
            {createProfile.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
