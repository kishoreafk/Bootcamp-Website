import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  Loader2,
  ChevronRight,
  Ruler,
} from "lucide-react";

export default function Measurements() {
  const [unit, setUnit] = useState<"cm" | "inches">("cm");
  const [measurements, setMeasurements] = useState({
    height: "",
    chest: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    preferredLength: "as_original",
    fitNotes: "",
  });
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const garmentId = Number(sessionStorage.getItem("currentGarmentId")) || 0;

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      if (data && data.id) {
        navigate(`/confirmation/${data.id}`);
      }
    },
  });

  const handleChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!garmentId) return;

    // Get the selected design
    const selectedDesignId = 1; // Simplified for demo

    createOrder.mutate({
      designId: selectedDesignId,
      garmentId,
      measurements: {
        height: measurements.height,
        chest: measurements.chest,
        waist: measurements.waist,
        hips: measurements.hips,
        shoulderWidth: measurements.shoulderWidth,
        preferredLength: measurements.preferredLength,
        fitNotes: measurements.fitNotes,
      },
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
    <div className="min-h-screen" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="max-w-[640px] mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate("/designs")}
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
                  backgroundColor: step <= 4 ? "#7a7a5e" : "transparent",
                  border: `2px solid ${step <= 4 ? "#7a7a5e" : "#eae7de"}`,
                }}
              >
                <span
                  className="font-body text-xs font-medium"
                  style={{ color: step <= 4 ? "#fff" : "#9c9c8e" }}
                >
                  {step}
                </span>
              </div>
              {step < 4 && <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />}
            </div>
          ))}
        </div>
        <p className="font-body text-xs mb-10" style={{ color: "#9c9c8e" }}>
          Step 4 of 4
        </p>

        <h1 className="font-display text-4xl font-normal" style={{ color: "#1a1a1a" }}>
          Your Measurements
        </h1>
        <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
          For a perfect fit, tailored to you.
        </p>

        {/* Unit Toggle */}
        <div className="flex items-center gap-3 mt-8">
          {(["cm", "inches"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className="h-10 px-5 rounded-lg font-body text-sm font-medium transition-all duration-250 capitalize"
              style={{
                backgroundColor: unit === u ? "#7a7a5e" : "#eae7de",
                color: unit === u ? "#fff" : "#1a1a1a",
              }}
            >
              {u}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {[
            { field: "height", label: "Height", placeholder: "e.g., 170" },
            { field: "chest", label: "Chest / Bust", placeholder: "e.g., 96" },
            { field: "waist", label: "Waist", placeholder: "e.g., 72" },
            { field: "hips", label: "Hips", placeholder: "e.g., 98" },
            { field: "shoulderWidth", label: "Shoulder Width", placeholder: "e.g., 42" },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
                {label} ({unit})
              </label>
              <input
                type="number"
                value={measurements[field as keyof typeof measurements] as string}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150"
                style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}

          {/* Preferred Length */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Preferred Length
            </label>
            <select
              value={measurements.preferredLength}
              onChange={(e) => handleChange("preferredLength", e.target.value)}
              className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150 appearance-none"
              style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <option value="as_original">As original</option>
              <option value="shorter">Shorter</option>
              <option value="longer">Longer</option>
              <option value="cropped">Cropped</option>
            </select>
          </div>

          {/* Fit Notes */}
          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Fit Notes
            </label>
            <textarea
              value={measurements.fitNotes}
              onChange={(e) => handleChange("fitNotes", e.target.value)}
              placeholder="Anything specific about how you want this to fit?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl font-body text-base outline-none transition-all duration-150 resize-none"
              style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Size Guide Link */}
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 font-body text-sm transition-colors duration-250"
            style={{ color: "#7a7a5e" }}
          >
            <Ruler className="w-4 h-4" /> Not sure? View measurement guide
          </button>

          <button
            type="submit"
            disabled={createOrder.isPending}
            className="w-full h-14 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 disabled:opacity-50 mt-8"
            style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            onMouseEnter={(e) => { if (!createOrder.isPending) e.currentTarget.style.backgroundColor = "#5c5c48"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                Confirm & Place Order <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Measurement Guide Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(26,26,26,0.6)" }}
          onClick={() => setShowGuide(false)}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full"
            style={{ backgroundColor: "#f6f5f1" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl font-medium" style={{ color: "#1a1a1a" }}>
              How to Measure
            </h3>
            <div className="space-y-4 mt-6">
              {[
                { label: "Height", desc: "Stand against a wall, measure from floor to top of head." },
                { label: "Chest/Bust", desc: "Measure around the fullest part of your chest." },
                { label: "Waist", desc: "Measure around your natural waistline." },
                { label: "Hips", desc: "Measure around the fullest part of your hips." },
                { label: "Shoulder Width", desc: "Measure from shoulder tip to shoulder tip across back." },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#eae7de" }}
                  >
                    <span className="font-body text-xs font-medium" style={{ color: "#7a7a5e" }}>
                      {item.label.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium" style={{ color: "#1a1a1a" }}>
                      {item.label}
                    </p>
                    <p className="font-body text-xs mt-1" style={{ color: "#9c9c8e" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full h-12 mt-8 rounded-lg font-body text-sm font-medium transition-all duration-250"
              style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
