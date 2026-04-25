import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Sun,
  Calendar,
  Recycle,
  Blend,
  ChevronRight,
} from "lucide-react";

const PREFERENCE_OPTIONS = [
  { id: "preserve", icon: Heart, title: "Preserve Original", description: "Keep the essence, modernize the cut." },
  { id: "redesign", icon: Sparkles, title: "Complete Redesign", description: "Transform into something entirely new." },
  { id: "seasonal", icon: Sun, title: "Seasonal Update", description: "Make it perfect for current weather." },
  { id: "occasion", icon: Calendar, title: "Occasion-Specific", description: "Design for a specific event." },
  { id: "repair", icon: Recycle, title: "Sustainable Repair", description: "Fix and enhance what exists." },
  { id: "fusion", icon: Blend, title: "Style Fusion", description: "Blend two aesthetics." },
];

const MOOD_WORDS = ["Elegant", "Casual", "Bold", "Minimal", "Romantic", "Edgy", "Classic", "Playful"];

const COLOR_SWATCHES = [
  { id: "original", label: "Match original", color: "transparent" },
  { id: "cream", color: "#f6f5f1" },
  { id: "olive", color: "#7a7a5e" },
  { id: "terracotta", color: "#c4a882" },
  { id: "navy", color: "#2c3e50" },
  { id: "charcoal", color: "#3a3a3a" },
];

export default function Preferences() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("original");
  const navigate = useNavigate();

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = () => {
    // Store preferences in session for next step
    sessionStorage.setItem("designPreferences", JSON.stringify(selectedPreferences));
    sessionStorage.setItem("styleDirection", JSON.stringify(selectedMoods));
    sessionStorage.setItem("colorPreference", selectedColor);
    navigate("/designs");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 font-body text-sm transition-colors duration-250 mb-8"
          style={{ color: "#7a7a5e" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: step <= 2 ? "#7a7a5e" : "transparent",
                  border: `2px solid ${step <= 2 ? "#7a7a5e" : "#eae7de"}`,
                }}
              >
                <span
                  className="font-body text-xs font-medium"
                  style={{ color: step <= 2 ? "#fff" : "#9c9c8e" }}
                >
                  {step}
                </span>
              </div>
              {step < 4 && <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />}
            </div>
          ))}
        </div>
        <p className="font-body text-xs mb-10" style={{ color: "#9c9c8e" }}>
          Step 2 of 4
        </p>

        <h1 className="font-display text-4xl font-normal" style={{ color: "#1a1a1a" }}>
          Design Preferences
        </h1>
        <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
          How would you like us to reimagine your garment?
        </p>

        {/* Preference Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
          {PREFERENCE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPreferences.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => togglePreference(option.id)}
                className="rounded-2xl p-7 text-left transition-all duration-250"
                style={{
                  backgroundColor: "#eae7de",
                  border: isSelected ? "2px solid #7a7a5e" : "2px solid transparent",
                  transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: isSelected ? "0 4px 16px rgba(122,122,94,0.15)" : "none",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? "#7a7a5e" : "transparent",
                      border: `2px solid ${isSelected ? "#7a7a5e" : "#b5b5a0"}`,
                    }}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <Icon className="w-9 h-9" style={{ color: "#7a7a5e" }} />
                    <h4 className="font-body text-lg font-medium mt-3" style={{ color: "#1a1a1a" }}>
                      {option.title}
                    </h4>
                    <p className="font-body text-sm mt-1.5" style={{ color: "#9c9c8e" }}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Style Direction */}
        <div className="mt-12">
          <h3 className="font-display text-2xl font-normal" style={{ color: "#1a1a1a" }}>
            Style Direction
          </h3>
          <div className="flex flex-wrap gap-3 mt-5">
            {MOOD_WORDS.map((mood) => {
              const isSelected = selectedMoods.includes(mood);
              return (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className="px-5 py-2 rounded-full font-body text-sm transition-all duration-250"
                  style={{
                    backgroundColor: isSelected ? "#7a7a5e" : "#eae7de",
                    color: isSelected ? "#fff" : "#1a1a1a",
                    border: isSelected ? "none" : "1px solid #b5b5a0",
                  }}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Preference */}
        <div className="mt-10">
          <h3 className="font-display text-2xl font-normal" style={{ color: "#1a1a1a" }}>
            Color Preference
          </h3>
          <div className="flex items-center gap-4 mt-5">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => setSelectedColor(swatch.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded-full transition-all duration-250 flex items-center justify-center"
                  style={{
                    backgroundColor: swatch.color === "transparent" ? "#f6f5f1" : swatch.color,
                    border: `3px solid ${selectedColor === swatch.id ? "#7a7a5e" : swatch.color === "transparent" ? "#b5b5a0" : "transparent"}`,
                    boxShadow: selectedColor === swatch.id ? "0 0 0 2px #7a7a5e" : "none",
                  }}
                >
                  {swatch.id === "original" && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#9c9c8e" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L13.5 17.5 10 14h2.5v-4h2.5v4H17.5z" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-xs" style={{ color: "#9c9c8e" }}>
                  {swatch.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-14 mt-12 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250"
          style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5c5c48"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
        >
          Generate Designs <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
