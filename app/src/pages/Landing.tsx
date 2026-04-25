import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

const HEROES = [
  {
    id: "memory",
    video: "/videos/hero-memory.mp4",
    eyebrow: "Where memory becomes material",
    title: "Every Garment\nHolds a Story",
    subtitle:
      "Upload your cherished pieces. Our AI reimagines them — honoring what they meant, creating what they could be.",
    cta: "Begin Your Transformation",
  },
  {
    id: "transformation",
    video: "/videos/hero-transformation.mp4",
    eyebrow: "From what was, to what could be",
    title: "Cut. Stitch.\nReimagine.",
    subtitle:
      "Watch skilled hands transform forgotten fabric into something you'll want to wear forever.",
    cta: "See How It Works",
  },
  {
    id: "fabric",
    video: "/videos/hero-fabric.mp4",
    eyebrow: "Material truth, digital vision",
    title: "Feel the Fabric.\nSee the Future.",
    subtitle:
      "Cotton, silk, denim — every texture captured, every possibility explored by AI.",
    cta: "Explore Materials",
  },
  {
    id: "wear",
    video: "/videos/hero-finalwear.mp4",
    eyebrow: "Worn with pride, made with purpose",
    title: "Wear Your Story.\nDifferently.",
    subtitle:
      "The final piece — redesigned by AI, crafted by hand, worn with the confidence of something truly yours.",
    cta: "Start Your Design",
  },
];

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveIndex(index);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(section);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  const scrollToSection = useCallback(
    (index: number) => {
      sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  const handleCTA = useCallback(
    (index: number) => {
      if (index === 3) {
        navigate("/login");
      } else {
        scrollToSection(index + 1);
      }
    },
    [navigate, scrollToSection]
  );

  return (
    <div className="relative">
      {/* Fixed Video Background */}
      <div className="fixed inset-0 z-0">
        {HEROES.map((hero, index) => (
          <video
            key={hero.id}
            ref={(el) => { videoRefs.current[index] = el; }}
            src={hero.video}
            autoPlay={index === 0}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ willChange: "opacity" }}
          />
        ))}
        {/* Dark Overlay Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(26, 26, 26, 0.72) 0%, rgba(26, 26, 26, 0.45) 50%, rgba(26, 26, 26, 0.18) 100%)",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6">
        <span
          className="font-display text-xl font-medium tracking-tight"
          style={{ color: "#f6f5f1" }}
        >
          Weaver
        </span>
        <div className="flex items-center gap-8">
          {HEROES.map((hero, index) => (
            <button
              key={hero.id}
              onClick={() => scrollToSection(index)}
              className="font-body text-sm tracking-widest uppercase transition-opacity duration-250"
              style={{
                color: "#f6f5f1",
                opacity: index === activeIndex ? 1 : 0.6,
              }}
            >
              {hero.id === "memory"
                ? "Story"
                : hero.id === "transformation"
                ? "Process"
                : hero.id === "fabric"
                ? "Fabric"
                : "Wear"}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Sections */}
      {HEROES.map((hero, index) => (
        <div
          key={hero.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className="relative z-10 min-h-screen flex items-center justify-center"
        >
          <div
            className="text-center px-6 max-w-2xl"
            style={{
              opacity: isLoaded && index === activeIndex ? 1 : 0,
              transform:
                isLoaded && index === activeIndex
                  ? "translateY(0)"
                  : "translateY(30px)",
              transition: `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${
                200 + index * 100
              }ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${
                200 + index * 100
              }ms`,
            }}
          >
            <p
              className="font-body text-xs uppercase tracking-[0.1em] mb-6"
              style={{ color: "rgba(246, 245, 241, 0.7)" }}
            >
              {hero.eyebrow}
            </p>
            <h1
              className="font-display font-normal leading-[0.95] tracking-tight whitespace-pre-line"
              style={{
                fontSize: "clamp(48px, 8vw, 96px)",
                color: "#f6f5f1",
                letterSpacing: "-0.02em",
              }}
            >
              {hero.title}
            </h1>
            <p
              className="font-body font-light text-lg mt-6 mx-auto max-w-lg"
              style={{ color: "rgba(246, 245, 241, 0.8)", lineHeight: 1.6 }}
            >
              {hero.subtitle}
            </p>
            <button
              onClick={() => handleCTA(index)}
              className="mt-10 px-8 py-3.5 rounded-full font-body text-sm font-medium transition-all duration-250 hover:scale-105"
              style={{
                backgroundColor: "#f6f5f1",
                color: "#1a1a1a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#eae7de";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f6f5f1";
              }}
            >
              {hero.cta}
            </button>
          </div>

          {/* Scroll indicator on first hero */}
          {index === 0 && (
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              style={{ opacity: 0.6 }}
            >
              <span
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: "#f6f5f1" }}
              >
                Scroll
              </span>
              <div
                className="w-px h-8 animate-pulse"
                style={{ backgroundColor: "rgba(246, 245, 241, 0.5)" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
