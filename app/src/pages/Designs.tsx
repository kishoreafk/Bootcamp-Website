import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const MOCK_DESIGNS = [
  {
    name: "The Minimalist Take",
    description: "Clean lines, modern silhouette — honoring the original silk texture with restrained elegance.",
    imageUrl: "/images/design-1.jpg",
    tags: ["Minimal", "Modern", "Elegant"],
  },
  {
    name: "The Avant-Garde Remix",
    description: "Bold restructuring with unexpected proportions. For those who dare to stand apart.",
    imageUrl: "/images/design-2.jpg",
    tags: ["Bold", "Avant-Garde", "Statement"],
  },
  {
    name: "The Bohemian Revival",
    description: "Flowing forms with natural textures. Romantic, free-spirited, and deeply personal.",
    imageUrl: "/images/design-3.jpg",
    tags: ["Bohemian", "Romantic", "Flowing"],
  },
  {
    name: "The Modern Classic",
    description: "Scandinavian simplicity meets timeless tailoring. Refined and effortlessly wearable.",
    imageUrl: "/images/design-4.jpg",
    tags: ["Classic", "Minimal", "Tailored"],
  },
];

type DesignCard = (typeof MOCK_DESIGNS)[number] & { id?: number };

export default function Designs() {
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([]);
  const [generatedDesigns, setGeneratedDesigns] = useState<DesignCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasRequestedGeneration = useRef(false);

  const garmentId = Number(sessionStorage.getItem("currentGarmentId")) || 0;
  const garmentName = sessionStorage.getItem("currentGarmentName") || "Your Garment";
  const preferences = useMemo(
    () => JSON.parse(sessionStorage.getItem("designPreferences") || "[]") as string[],
    [],
  );
  const styleDirection = useMemo(
    () => JSON.parse(sessionStorage.getItem("styleDirection") || "[]") as string[],
    [],
  );
  const colorPreference = useMemo(
    () => sessionStorage.getItem("colorPreference") || "",
    [],
  );

  const generateMutation = trpc.design.generate.useMutation({
    onSuccess: (data) => {
      if (!data) {
        setIsGenerating(false);
        return;
      }
      setGeneratedDesigns(data.filter((d): d is NonNullable<typeof d> => !!d).map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description || "",
        imageUrl: d.imageUrl,
        tags: d.tags ? JSON.parse(d.tags) : [],
      })));
      setIsGenerating(false);
    },
  });

  const selectMutation = trpc.design.select.useMutation({
    onSuccess: () => {
      navigate("/measurements");
    },
  });

  useEffect(() => {
    if (user && garmentId && isGenerating && !hasRequestedGeneration.current) {
      hasRequestedGeneration.current = true;
      generateMutation.mutate({
        garmentId,
        preferences,
        styleDirection: styleDirection.join(", "),
        colorPreference,
      });
    }
  }, [colorPreference, garmentId, generateMutation, isGenerating, preferences, styleDirection, user]);

  const toggleSelect = (index: number) => {
    setSelectedDesigns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelect = () => {
    if (selectedDesigns.length === 1) {
      const selectedIndex = selectedDesigns[0];
      selectMutation.mutate({
        designId: generatedDesigns[selectedIndex]?.id ?? selectedIndex + 1,
      });
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6f5f1" }}>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-[#eae7de] rounded-full" />
            <div className="absolute inset-0 border-2 border-[#7a7a5e] border-t-transparent rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6" style={{ color: "#7a7a5e" }} />
          </div>
          <h2 className="font-display text-3xl font-normal mt-8" style={{ color: "#1a1a1a" }}>
            Designing Your Future
          </h2>
          <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
            Our AI is reimagining your garment in 4 unique ways...
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: generateMutation.isPending ? "#7a7a5e" : "#eae7de",
                  opacity: generateMutation.isPending ? 0.3 + i * 0.2 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const designsToShow = generatedDesigns.length > 0 ? generatedDesigns : MOCK_DESIGNS;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="max-w-[960px] mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate("/preferences")}
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
                  backgroundColor: step <= 3 ? "#7a7a5e" : "transparent",
                  border: `2px solid ${step <= 3 ? "#7a7a5e" : "#eae7de"}`,
                }}
              >
                <span
                  className="font-body text-xs font-medium"
                  style={{ color: step <= 3 ? "#fff" : "#9c9c8e" }}
                >
                  {step}
                </span>
              </div>
              {step < 4 && <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />}
            </div>
          ))}
        </div>
        <p className="font-body text-xs mb-10" style={{ color: "#9c9c8e" }}>
          Step 3 of 4
        </p>

        <div className="text-center">
          <h1 className="font-display text-4xl font-normal" style={{ color: "#1a1a1a" }}>
            Your Designs Are Ready
          </h1>
          <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
            Our AI reimagined your garment in 4 unique ways.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div
              className="w-16 h-16 rounded-lg overflow-hidden"
              style={{ backgroundColor: "#eae7de" }}
            >
              <img
                src="/images/login-panel.jpg"
                alt={garmentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-body text-sm font-medium" style={{ color: "#1a1a1a" }}>
                {garmentName}
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="font-body text-xs transition-colors duration-250"
                style={{ color: "#7a7a5e" }}
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Design Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {designsToShow.map((design, index) => {
            const isSelected = selectedDesigns.includes(index);
            return (
              <div
                key={index}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "#eae7de",
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(122,122,94,0.15)"
                    : "0 0 0 rgba(26,26,26,0)",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={design.imageUrl}
                    alt={design.name}
                    className="w-full h-full object-cover transition-transform duration-400 hover:scale-[1.02]"
                  />
                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#7a7a5e" }}
                    >
                      <Check className="w-4 h-4" style={{ color: "#fff" }} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-display text-xl font-medium" style={{ color: "#1a1a1a" }}>
                    {design.name}
                  </h4>
                  <p className="font-body text-sm mt-2" style={{ color: "#9c9c8e" }}>
                    {design.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {design.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-body text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: "#f6f5f1",
                          color: "#9c9c8e",
                          border: "1px solid #b5b5a0",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleSelect(index)}
                    className="w-full h-12 mt-5 rounded-lg font-body text-sm font-medium transition-all duration-250"
                    style={{
                      backgroundColor: isSelected ? "#5c5c48" : "#7a7a5e",
                      color: "#fff",
                    }}
                  >
                    {isSelected ? "Selected" : "Select Design"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compare Bar */}
        {selectedDesigns.length >= 1 && (
          <div
            className="fixed bottom-0 left-0 right-0 h-[72px] flex items-center justify-between px-6 lg:px-10 transition-transform duration-300"
            style={{
              backgroundColor: "#1a1a1a",
              transform: "translateY(0)",
            }}
          >
            <span className="font-body text-base" style={{ color: "#f6f5f1" }}>
              {selectedDesigns.length} design{selectedDesigns.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDesigns([])}
                className="font-body text-sm transition-colors duration-250"
                style={{ color: "#9c9c8e" }}
              >
                Clear
              </button>
              <button
                onClick={handleSelect}
                disabled={selectedDesigns.length !== 1 || selectMutation.isPending}
                className="h-10 px-6 rounded-lg font-body text-sm font-medium flex items-center gap-2 transition-all duration-250 disabled:opacity-50"
                style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
              >
                {selectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
