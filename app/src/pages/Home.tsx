import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Sparkles,
  ArrowRight,
  LogOut,
  User,
  Scissors,
} from "lucide-react";

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const { data: garments } = trpc.garment.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: orders } = trpc.order.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6f5f1" }}>
        <div className="w-8 h-8 border-2 border-[#7a7a5e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const recentGarments = garments?.slice(0, 3) || [];
  const pendingOrders = orders?.filter((o) => o.status !== "delivered").length || 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6f5f1" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 lg:px-10"
        style={{
          backgroundColor: "rgba(246, 245, 241, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #eae7de",
        }}
      >
        <span className="font-display text-xl font-medium" style={{ color: "#1a1a1a" }}>
          Weaver
        </span>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/home")}
              className="font-body text-sm transition-colors duration-250"
              style={{ color: "#7a7a5e" }}
            >
              My Designs
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="font-body text-sm transition-colors duration-250"
              style={{ color: "#9c9c8e" }}
            >
              New Design
            </button>
            <button
              onClick={() => navigate("/home")}
              className="font-body text-sm transition-colors duration-250"
              style={{ color: "#9c9c8e" }}
            >
              Orders
            </button>
          </nav>
          <button
            onClick={() => navigate("/upload")}
            className="hidden md:flex items-center gap-2 h-9 px-4 rounded-full font-body text-sm font-medium transition-all duration-250"
            style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
          <div className="relative group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer font-body text-sm font-medium"
              style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            >
              {user.name?.charAt(0).toUpperCase() || user.phone?.charAt(0) || "U"}
            </div>
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              style={{ backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(26,26,26,0.08)" }}
            >
              <button
                onClick={() => navigate("/home")}
                className="w-full px-4 py-2.5 flex items-center gap-3 font-body text-sm transition-colors duration-150 hover:bg-[#f6f5f1]"
                style={{ color: "#1a1a1a" }}
              >
                <User className="w-4 h-4" /> Profile
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full px-4 py-2.5 flex items-center gap-3 font-body text-sm transition-colors duration-150 hover:bg-[#f6f5f1]"
                  style={{ color: "#1a1a1a" }}
                >
                  <Sparkles className="w-4 h-4" /> Admin
                </button>
              )}
              <div className="mx-4 my-1 h-px" style={{ backgroundColor: "#eae7de" }} />
              <button
                onClick={logout}
                className="w-full px-4 py-2.5 flex items-center gap-3 font-body text-sm transition-colors duration-150 hover:bg-[#f6f5f1]"
                style={{ color: "#c45c4a" }}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[72px] px-6 lg:px-10 max-w-[1280px] mx-auto pb-20">
        {/* Hero Banner */}
        <div
          className="mt-8 rounded-2xl overflow-hidden relative h-[280px] lg:h-[320px]"
          style={{ opacity: 0, animation: "fadeInUp 800ms ease-out 300ms forwards" }}
        >
          <img
            src="/images/dashboard-hero.jpg"
            alt="Your wardrobe reimagined"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.2) 100%)",
            }}
          />
          <div className="absolute left-8 lg:left-10 top-1/2 -translate-y-1/2 max-w-md">
            <h2 className="font-display text-4xl lg:text-5xl font-normal" style={{ color: "#fff" }}>
              Your Wardrobe,
              <br />Reimagined
            </h2>
            <p className="font-body font-light text-base mt-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              {recentGarments.length > 0
                ? `${recentGarments.length} garment${recentGarments.length > 1 ? "s" : ""} waiting for transformation`
                : "Upload your first garment to begin"}
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-6 h-10 px-6 rounded-full font-body text-sm font-medium transition-all duration-250 hover:scale-105"
              style={{ backgroundColor: "#fff", color: "#1a1a1a" }}
            >
              {recentGarments.length > 0 ? "Continue Designing" : "Start Now"}
            </button>
          </div>
        </div>

        {/* Recent Designs */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-medium" style={{ color: "#1a1a1a" }}>
              Your Recent Designs
            </h3>
            <button
              onClick={() => navigate("/upload")}
              className="font-body text-sm flex items-center gap-1 transition-colors duration-250"
              style={{ color: "#7a7a5e" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentGarments.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{ backgroundColor: "#eae7de" }}
            >
              <Scissors className="w-12 h-12 mx-auto" style={{ color: "#b5b5a0" }} />
              <p className="font-body text-base mt-4" style={{ color: "#9c9c8e" }}>
                No designs yet. Upload a garment to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGarments.map((garment) => (
                <div
                  key={garment.id}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "#eae7de",
                    boxShadow: "0 0 0 rgba(26,26,26,0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 rgba(26,26,26,0)";
                  }}
                  onClick={() => navigate("/upload")}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {garment.images ? (
                      <img
                        src={JSON.parse(garment.images)[0] || "/images/design-1.jpg"}
                        alt={garment.name}
                        className="w-full h-full object-cover transition-transform duration-400 hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#dddad0" }}>
                        <Scissors className="w-8 h-8" style={{ color: "#b5b5a0" }} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-body text-base font-medium" style={{ color: "#1a1a1a" }}>
                      {garment.name}
                    </h4>
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className="font-body text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: "#f6f5f1",
                          color: "#9c9c8e",
                        }}
                      >
                        {pendingOrders > 0 ? "In Progress" : "Draft"}
                      </span>
                      <span className="font-body text-xs" style={{ color: "#9c9c8e" }}>
                        Just created
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="font-display text-2xl font-medium mb-6" style={{ color: "#1a1a1a" }}>
            Start Something New
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/upload")}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "#eae7de",
                boxShadow: "0 0 0 rgba(26,26,26,0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 rgba(26,26,26,0)";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#7a7a5e" }}
              >
                <Plus className="w-5 h-5" style={{ color: "#fff" }} />
              </div>
              <h4 className="font-body text-lg font-medium" style={{ color: "#1a1a1a" }}>
                Upload Garment
              </h4>
              <p className="font-body text-sm mt-2" style={{ color: "#9c9c8e" }}>
                Transform a piece you already own.
              </p>
            </button>

            <button
              onClick={() => navigate("/designs")}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "#eae7de",
                boxShadow: "0 0 0 rgba(26,26,26,0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 rgba(26,26,26,0)";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#7a7a5e" }}
              >
                <Sparkles className="w-5 h-5" style={{ color: "#fff" }} />
              </div>
              <h4 className="font-body text-lg font-medium" style={{ color: "#1a1a1a" }}>
                Browse Inspiration
              </h4>
              <p className="font-body text-sm mt-2" style={{ color: "#9c9c8e" }}>
                See what others have created.
              </p>
            </button>
          </div>
        </div>

        {/* Orders Summary */}
        {orders && orders.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-medium mb-6" style={{ color: "#1a1a1a" }}>
              Your Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "#eae7de" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm font-medium" style={{ color: "#1a1a1a" }}>
                      Order #{order.id}
                    </span>
                    <span
                      className="font-body text-xs px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          order.status === "placed"
                            ? "#f6f5f1"
                            : order.status === "in_production"
                            ? "#7a7a5e"
                            : "#6b8f6b",
                        color:
                          order.status === "placed" ? "#9c9c8e" : "#fff",
                      }}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-body text-xs mt-3" style={{ color: "#9c9c8e" }}>
                    Est. delivery: {order.estimatedDelivery}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
