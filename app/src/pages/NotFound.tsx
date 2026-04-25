import { useNavigate } from "react-router";
import { Shirt } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="text-center relative">
        {/* Large 404 number */}
        <h1
          className="font-display font-normal leading-none"
          style={{
            fontSize: "clamp(80px, 15vw, 200px)",
            color: "rgba(122, 122, 94, 0.2)",
          }}
        >
          404
        </h1>

        {/* Illustration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15">
          <Shirt className="w-32 h-32" style={{ color: "#7a7a5e" }} />
        </div>

        {/* Title overlapping */}
        <h2
          className="font-display text-4xl font-normal relative"
          style={{ color: "#1a1a1a", marginTop: "-40px" }}
        >
          Page Not Found
        </h2>

        <p
          className="font-body font-light text-base mt-4 max-w-sm mx-auto"
          style={{ color: "#9c9c8e" }}
        >
          The page you're looking for doesn't exist, or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 h-10 px-8 rounded-full font-body text-sm font-medium transition-all duration-250 hover:scale-105"
          style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5c5c48"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
