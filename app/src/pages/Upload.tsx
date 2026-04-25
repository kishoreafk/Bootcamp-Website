import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";
import { useAuth } from "@/hooks/useAuth";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft,
  Upload as UploadIcon,
  X,
  ImagePlus,
  ChevronRight,
} from "lucide-react";

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [garmentName, setGarmentName] = useState("");
  const [originalPurpose, setOriginalPurpose] = useState("");
  const [emotionalValue, setEmotionalValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const createGarment = trpc.garment.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        sessionStorage.setItem("currentGarmentId", String(data.id));
        sessionStorage.setItem("currentGarmentName", data.name);
        navigate("/preferences");
      }
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 5 - files.length);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024,
    disabled: files.length >= 5,
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!garmentName || files.length === 0) return;

    // For demo, convert first file to base64 and store as image URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      createGarment.mutate({
        name: garmentName,
        originalPurpose,
        emotionalValue,
        images: [base64],
      });
    };
    reader.readAsDataURL(files[0]);
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
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 font-body text-sm transition-colors duration-250 mb-8"
          style={{ color: "#7a7a5e" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: step === 1 ? "#7a7a5e" : "transparent",
                  border: `2px solid ${step === 1 ? "#7a7a5e" : "#eae7de"}`,
                }}
              >
                <span
                  className="font-body text-xs font-medium"
                  style={{ color: step === 1 ? "#fff" : "#9c9c8e" }}
                >
                  {step}
                </span>
              </div>
              {step < 4 && (
                <div className="flex-1 h-px" style={{ backgroundColor: "#eae7de" }} />
              )}
            </div>
          ))}
        </div>
        <p className="font-body text-xs mb-10" style={{ color: "#9c9c8e" }}>
          Step 1 of 4
        </p>

        <h1 className="font-display text-4xl font-normal" style={{ color: "#1a1a1a" }}>
          Upload Your Garment
        </h1>
        <p className="font-body font-light text-base mt-3" style={{ color: "#9c9c8e" }}>
          Take clear photos of the piece you want to transform.
        </p>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className="mt-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-12 transition-all duration-250 cursor-pointer"
          style={{
            borderColor: isDragActive ? "#7a7a5e" : "#eae7de",
            backgroundColor: isDragActive ? "#eae7de" : "transparent",
            minHeight: "320px",
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon
            className="w-12 h-12 transition-colors duration-250"
            style={{ color: isDragActive ? "#7a7a5e" : "#b5b5a0" }}
          />
          <p className="font-body text-lg font-light mt-4" style={{ color: "#1a1a1a" }}>
            {isDragActive ? "Drop your images here" : "Drag & drop your images here"}
          </p>
          <p className="font-body text-sm mt-2" style={{ color: "#9c9c8e" }}>
            or click to browse your files
          </p>
          <p className="font-body text-xs mt-4" style={{ color: "#9c9c8e" }}>
            JPG, PNG up to 10MB
          </p>
        </div>

        {/* Thumbnail Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-6">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150"
                  style={{ backgroundColor: "rgba(26,26,26,0.6)" }}
                >
                  <X className="w-3 h-3" style={{ color: "#fff" }} />
                </button>
              </div>
            ))}
            {files.length < 5 && (
              <div
                {...getRootProps()}
                className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer"
                style={{ borderColor: "#eae7de" }}
              >
                <input {...getInputProps()} />
                <ImagePlus className="w-6 h-6" style={{ color: "#b5b5a0" }} />
              </div>
            )}
          </div>
        )}

        {/* Garment Details Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <h3 className="font-display text-2xl font-normal" style={{ color: "#1a1a1a" }}>
            Tell us about this piece
          </h3>

          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Garment Name
            </label>
            <input
              type="text"
              value={garmentName}
              onChange={(e) => setGarmentName(e.target.value)}
              placeholder="e.g., Grandma's Silk Scarf"
              className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150"
              style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Original Purpose
            </label>
            <select
              value={originalPurpose}
              onChange={(e) => setOriginalPurpose(e.target.value)}
              className="w-full h-14 px-4 rounded-xl font-body text-base outline-none transition-all duration-150 appearance-none"
              style={{ backgroundColor: "#eae7de", color: originalPurpose ? "#1a1a1a" : "#9c9c8e" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <option value="">Select purpose</option>
              <option value="Everyday wear">Everyday wear</option>
              <option value="Special occasion">Special occasion</option>
              <option value="Work/professional">Work/professional</option>
              <option value="Sentimental/heirloom">Sentimental/heirloom</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-body text-sm font-medium block mb-2" style={{ color: "#1a1a1a" }}>
              Emotional Value
            </label>
            <textarea
              value={emotionalValue}
              onChange={(e) => setEmotionalValue(e.target.value)}
              placeholder="What does this garment mean to you?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl font-body text-base outline-none transition-all duration-150 resize-none"
              style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 2px rgba(122, 122, 94, 0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <button
            type="submit"
            disabled={!garmentName || files.length === 0 || createGarment.isPending}
            className="w-full h-14 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 disabled:opacity-50"
            style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            onMouseEnter={(e) => { if (!createGarment.isPending) e.currentTarget.style.backgroundColor = "#5c5c48"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
          >
            {createGarment.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
