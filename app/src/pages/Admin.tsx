import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Scissors,
  Image,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/admin" },
  { icon: Users, label: "Users", route: "/admin" },
  { icon: ShoppingBag, label: "Orders", route: "/admin" },
  { icon: Scissors, label: "Designs", route: "/admin" },
  { icon: Image, label: "Images", route: "/admin" },
];

export default function Admin() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/home");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: usersData } = trpc.admin.listUsers.useQuery(
    { page: 1, limit: 20 },
    { enabled: isAdmin && activeTab === "Users" }
  );

  const { data: ordersData } = trpc.admin.listOrders.useQuery(
    { page: 1, limit: 20 },
    { enabled: isAdmin && activeTab === "Orders" }
  );

  const { data: designsData } = trpc.admin.listDesigns.useQuery(
    { page: 1, limit: 20 },
    { enabled: isAdmin && activeTab === "Designs" }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6f5f1" }}>
        <div className="w-8 h-8 border-2 border-[#7a7a5e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, color: "#1a1a1a" },
          { label: "Total Orders", value: stats?.totalOrders || 0, color: "#1a1a1a" },
          { label: "Pending Orders", value: stats?.pendingOrders || 0, color: "#7a7a5e" },
          { label: "Conversion Rate", value: `${stats?.conversionRate || 0}%`, color: "#6b8f6b" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-7"
            style={{ backgroundColor: "#eae7de" }}
          >
            <p className="font-display text-4xl font-medium" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-body text-xs mt-2" style={{ color: "#9c9c8e" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders + Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: "#eae7de" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-medium" style={{ color: "#1a1a1a" }}>
              Recent Orders
            </h3>
            <button
              onClick={() => setActiveTab("Orders")}
              className="font-body text-sm transition-colors duration-250"
              style={{ color: "#7a7a5e" }}
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(156,156,142,0.2)" }}>
                  <th className="font-body text-xs text-left py-3 px-2" style={{ color: "#9c9c8e" }}>Order ID</th>
                  <th className="font-body text-xs text-left py-3 px-2" style={{ color: "#9c9c8e" }}>Customer</th>
                  <th className="font-body text-xs text-left py-3 px-2" style={{ color: "#9c9c8e" }}>Status</th>
                  <th className="font-body text-xs text-left py-3 px-2" style={{ color: "#9c9c8e" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersData?.orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b" style={{ borderColor: "rgba(156,156,142,0.1)" }}>
                    <td className="font-body text-sm py-3 px-2" style={{ color: "#1a1a1a" }}>#{order.id}</td>
                    <td className="font-body text-sm py-3 px-2" style={{ color: "#1a1a1a" }}>User #{order.userId}</td>
                    <td className="py-3 px-2">
                      <span
                        className="font-body text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            order.status === "placed"
                              ? "#f6f5f1"
                              : order.status === "in_production"
                              ? "#7a7a5e"
                              : order.status === "shipped"
                              ? "#6b8f6b"
                              : "#f6f5f1",
                          color:
                            order.status === "placed" || order.status === "delivered"
                              ? "#9c9c8e"
                              : "#fff",
                        }}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="font-body text-xs py-3 px-2" style={{ color: "#9c9c8e" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!ordersData?.orders || ordersData.orders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center font-body text-sm" style={{ color: "#9c9c8e" }}>
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#eae7de" }}>
          <h3 className="font-display text-2xl font-medium mb-6" style={{ color: "#1a1a1a" }}>
            New Users
          </h3>
          <div className="space-y-4">
            {usersData?.users.slice(0, 6).map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 pb-4 border-b"
                style={{ borderColor: "rgba(156,156,142,0.2)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-body text-sm font-medium flex-shrink-0"
                  style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
                >
                  {u.name?.charAt(0).toUpperCase() || u.phone.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate" style={{ color: "#1a1a1a" }}>
                    {u.name || "Unnamed User"}
                  </p>
                  <p className="font-body text-xs" style={{ color: "#9c9c8e" }}>
                    {u.phone}
                  </p>
                </div>
                <span className="font-body text-xs flex-shrink-0" style={{ color: "#9c9c8e" }}>
                  {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
            {(!usersData?.users || usersData.users.length === 0) && (
              <p className="py-4 text-center font-body text-sm" style={{ color: "#9c9c8e" }}>
                No users yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (title: string, columns: string[], data: unknown[]) => (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#eae7de" }}>
      <h3 className="font-display text-3xl font-normal mb-6" style={{ color: "#1a1a1a" }}>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(156,156,142,0.2)" }}>
              {columns.map((col) => (
                <th key={col} className="font-body text-xs text-left py-3 px-3" style={{ color: "#9c9c8e" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const r = row as Record<string, unknown>;
              return (
              <tr key={i} className="border-b" style={{ borderColor: "rgba(156,156,142,0.1)" }}>
                {columns.map((col) => (
                  <td key={col} className="font-body text-sm py-3 px-3" style={{ color: "#1a1a1a" }}>
                    {String(r[col.toLowerCase().replace(" ", "")] ?? "-")}
                  </td>
                ))}
              </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center font-body text-sm" style={{ color: "#9c9c8e" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button className="flex items-center gap-1 font-body text-sm px-3 py-2 rounded-lg transition-colors duration-150" style={{ color: "#9c9c8e", backgroundColor: "#f6f5f1" }}>
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="font-body text-sm" style={{ color: "#9c9c8e" }}>Page 1</span>
        <button className="flex items-center gap-1 font-body text-sm px-3 py-2 rounded-lg transition-colors duration-150" style={{ color: "#9c9c8e", backgroundColor: "#f6f5f1" }}>
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f6f5f1" }}>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: "#eae7de",
          borderRight: "1px solid rgba(181,181,160,0.3)",
        }}
      >
        <div className="p-6">
          <h2 className="font-display text-2xl font-medium" style={{ color: "#1a1a1a" }}>
            Weaver
          </h2>
          <p className="font-body text-xs mt-1" style={{ color: "#9c9c8e" }}>
            Admin Panel
          </p>
        </div>
        <nav className="px-4 pb-4">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setMobileMenuOpen(false);
                }}
                className="w-full h-12 px-5 rounded-lg flex items-center gap-3 font-body text-sm transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "#7a7a5e" : "transparent",
                  color: isActive ? "#fff" : "#1a1a1a",
                  borderLeft: isActive ? "3px solid #7a7a5e" : "3px solid transparent",
                }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-body text-sm transition-colors duration-150"
            style={{ color: "#c45c4a", backgroundColor: "rgba(196,92,74,0.1)" }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: "rgba(26,26,26,0.4)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header
          className="h-[72px] flex items-center justify-between px-8"
          style={{
            backgroundColor: "rgba(246,245,241,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #eae7de",
          }}
        >
          <h2 className="font-display text-xl font-normal" style={{ color: "#1a1a1a" }}>
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-body text-sm font-medium"
              style={{ backgroundColor: "#7a7a5e", color: "#fff" }}
            >
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {activeTab === "Dashboard" && renderDashboard()}
          {activeTab === "Users" && renderTable("Users", ["ID", "Phone", "Name", "Role", "Joined"], usersData?.users.map((u) => ({
            id: u.id,
            phone: u.phone,
            name: u.name || "-",
            role: u.role,
            joined: new Date(u.createdAt).toLocaleDateString(),
          })) || [])}
          {activeTab === "Orders" && renderTable("Orders", ["ID", "User", "Design", "Status", "Date"], ordersData?.orders.map((o) => ({
            id: `#${o.id}`,
            user: `User #${o.userId}`,
            design: `Design #${o.designId}`,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString(),
          })) || [])}
          {activeTab === "Designs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(designsData?.designs || []).map((design) => (
                <div key={design.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#eae7de" }}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-display text-lg font-medium" style={{ color: "#1a1a1a" }}>{design.name}</h4>
                    <p className="font-body text-xs mt-2" style={{ color: "#9c9c8e" }}>
                      Created {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Images" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {["login-panel.jpg", "dashboard-hero.jpg", "design-1.jpg", "design-2.jpg", "design-3.jpg", "design-4.jpg"].map((img) => (
                <div key={img} className="aspect-square rounded-xl overflow-hidden relative group">
                  <img
                    src={`/images/${img}`}
                    alt={img}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: "rgba(26,26,26,0.5)" }}>
                    <span className="font-body text-xs" style={{ color: "#fff" }}>{img}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
