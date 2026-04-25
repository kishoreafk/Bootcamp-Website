import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Check,
  Copy,
  Loader2,
  Share2,
} from "lucide-react";

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading } = trpc.order.getById.useQuery(
    { id: Number(id) },
    { enabled: !!id && isAuthenticated }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Order #WE-${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6f5f1" }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#7a7a5e" }} />
          <p className="font-body text-sm mt-4" style={{ color: "#9c9c8e" }}>Loading order...</p>
        </div>
      </div>
    );
  }

  const orderNumber = `WE-${order.id}`;
  const statusSteps = ["placed", "in_production", "shipped", "delivered"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#f6f5f1" }}>
      <div className="w-full max-w-[560px]">
        {/* Success Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "#6b8f6b" }}
        >
          <Check className="w-8 h-8" style={{ color: "#fff" }} />
        </div>

        <h1 className="font-display text-4xl font-normal text-center mt-6" style={{ color: "#1a1a1a" }}>
          Order Confirmed!
        </h1>

        <div className="flex items-center justify-center gap-2 mt-4">
          <p className="font-body text-base" style={{ color: "#1a1a1a" }}>
            Order #{orderNumber}
          </p>
          <button
            onClick={handleCopy}
            className="transition-colors duration-150"
            style={{ color: "#7a7a5e" }}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="font-body text-base text-center mt-4 max-w-sm mx-auto" style={{ color: "#9c9c8e" }}>
          Your redesigned garment will be crafted with care and delivered in 2-3 weeks.
        </p>

        {/* Order Summary Card */}
        <div
          className="rounded-2xl p-8 mt-10"
          style={{ backgroundColor: "#eae7de" }}
        >
          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6">
            <img
              src="/images/design-1.jpg"
              alt="Your design"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-body text-lg font-medium" style={{ color: "#1a1a1a" }}>
            The Minimalist Take
          </h4>
          <p className="font-body text-sm mt-1" style={{ color: "#9c9c8e" }}>
            Based on: {sessionStorage.getItem("currentGarmentName") || "Your Garment"}
          </p>

          <div className="h-px my-4" style={{ backgroundColor: "rgba(156,156,142,0.3)" }} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-body text-xs" style={{ color: "#9c9c8e" }}>Estimated delivery</p>
              <p className="font-body text-sm font-medium mt-1" style={{ color: "#1a1a1a" }}>
                {order.estimatedDelivery}
              </p>
            </div>
            <div>
              <p className="font-body text-xs" style={{ color: "#9c9c8e" }}>Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      order.status === "placed"
                        ? "#b5b5a0"
                        : order.status === "in_production"
                        ? "#7a7a5e"
                        : "#6b8f6b",
                  }}
                />
                <p className="font-body text-sm font-medium" style={{ color: "#1a1a1a" }}>
                  {order.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="flex items-center justify-between mt-8 px-2">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      index < currentStepIndex
                        ? "#6b8f6b"
                        : index === currentStepIndex
                        ? "#7a7a5e"
                        : "#eae7de",
                    border:
                      index > currentStepIndex
                        ? "2px solid #b5b5a0"
                        : "none",
                  }}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" style={{ color: "#fff" }} />
                  ) : index === currentStepIndex ? (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fff" }} />
                  ) : null}
                </div>
                <span
                  className="font-body text-xs mt-2 capitalize"
                  style={{
                    color: index <= currentStepIndex ? "#1a1a1a" : "#9c9c8e",
                  }}
                >
                  {step.replace("_", " ")}
                </span>
                {index < 3 && (
                  <div
                    className="absolute w-12 h-px"
                    style={{
                      backgroundColor:
                        index < currentStepIndex ? "#6b8f6b" : "#eae7de",
                      marginTop: "16px",
                      marginLeft: "48px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/home")}
            className="w-full h-14 rounded-lg font-body text-sm font-medium transition-all duration-250"
            style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#5c5c48"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#7a7a5e"; }}
          >
            Track Order
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="w-full h-14 rounded-lg font-body text-sm font-medium transition-all duration-250"
            style={{ backgroundColor: "#eae7de", color: "#1a1a1a" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dddad0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#eae7de"; }}
          >
            Create Another Design
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My Weaver Design",
                  text: `I just ordered a redesigned garment from Weaver! Order #${orderNumber}`,
                  url: window.location.href,
                });
              }
            }}
            className="w-full h-12 flex items-center justify-center gap-2 font-body text-sm transition-colors duration-250"
            style={{ color: "#7a7a5e" }}
          >
            <Share2 className="w-4 h-4" /> Share your transformation
          </button>
        </div>
      </div>
    </div>
  );
}
