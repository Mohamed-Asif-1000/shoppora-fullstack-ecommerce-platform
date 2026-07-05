import { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Users, Store, ClipboardList, Package, Truck } from "lucide-react";
import type { AdminOrder, ProductType, User } from "./adminTypes";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const statCards = [
  { label: "Customers", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Sellers", icon: Store, color: "from-emerald-500 to-emerald-600" },
  {
    label: "Active Orders",
    icon: ClipboardList,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Pending Orders",
    icon: ClipboardList,
    color: "from-yellow-500 to-yellow-600",
  },
  { label: "Products", icon: Package, color: "from-pink-500 to-pink-600" },
  {
    label: "Delivery Agents",
    icon: Truck,
    color: "from-slate-500 to-slate-600",
  },
];

/**
 * ChartBox
 * ---------
 * Recharts' <ResponsiveContainer> does its own internal measurement the
 * instant it mounts, separate from any measuring we do ourselves in a
 * parent wrapper. That means wrapping it in "wait until parent is ready"
 * logic doesn't help — ResponsiveContainer still does a synchronous
 * first-pass read of ITS OWN wrapper div before its own ResizeObserver
 * has a chance to correct it, and that first pass is what logs -1/-1.
 *
 * The reliable fix is to skip ResponsiveContainer entirely: measure the
 * container ourselves with a single ResizeObserver, and pass the exact
 * pixel width/height straight into the chart component (PieChart,
 * BarChart, LineChart all accept width/height directly). Children is a
 * render-prop: (width, height) => ReactNode.
 */
function ChartBox({
  className = "",
  children,
}: {
  className?: string;
  children: (width: number, height: number) => React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      if (width > 0 && height > 0) {
        setSize((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    // Extra safety net: some browsers/layout timings (grid tracks
    // resolving, fonts loading and shifting layout, etc.) don't always
    // fire a ResizeObserver callback promptly. A couple of follow-up
    // checks on the next frames catch that without any visible delay.
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(measure));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf1);
    };
  }, []);

  const ready = size.width > 0 && size.height > 0;

  return (
    <div
      ref={containerRef}
      className={`h-72 min-h-[288px] w-full ${className}`}
    >
      {ready ? (
        children(size.width, size.height)
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
          Loading chart…
        </div>
      )}
    </div>
  );
}

type Props = {
  orders: AdminOrder[];
  products: ProductType[];
  users: User[];
  deliveryAgentsCount: number;
};

export default function DashboardTab({
  orders,
  products,
  users,
  deliveryAgentsCount,
}: Props): React.JSX.Element {
  const customers = users.filter((user) => user.role === "customer");
  const sellers = users.filter((user) => user.role === "seller");
  const activeOrders = orders.filter(
    (order) => order.status !== "delivered" && order.status !== "cancelled",
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const orderStatusData = [
    {
      name: "Pending",
      value: orders.filter((order) => order.status === "pending").length,
    },
    {
      name: "Accepted",
      value: orders.filter((order) => order.status === "accepted").length,
    },
    {
      name: "Shipped",
      value: orders.filter((order) => order.status === "shipped").length,
    },
    {
      name: "Delivered",
      value: orders.filter((order) => order.status === "delivered").length,
    },
    {
      name: "Cancelled",
      value: orders.filter((order) => order.status === "cancelled").length,
    },
  ];

  const userRoleData = [
    { name: "Customers", value: customers.length },
    { name: "Sellers", value: sellers.length },
    { name: "Delivery", value: deliveryAgentsCount },
  ];

  const revenueTrendData = Object.values(
    orders.reduce<
      Record<string, { date: string; revenue: number; orders: number }>
    >((acc, order) => {
      const date = order.created_at ? order.created_at.slice(0, 10) : "Unknown";
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 };
      }
      acc[date].revenue += Number(order.total || 0);
      acc[date].orders += 1;
      return acc;
    }, {}),
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const value =
            stat.label === "Customers"
              ? customers.length.toString()
              : stat.label === "Sellers"
                ? sellers.length.toString()
                : stat.label === "Active Orders"
                  ? activeOrders.length.toString()
                  : stat.label === "Pending Orders"
                    ? pendingOrders.toString()
                    : stat.label === "Products"
                      ? products.length.toString()
                      : deliveryAgentsCount.toString();

          return (
            <div
              key={idx}
              className={`bg-linear-to-br ${stat.color} rounded-xl p-4 text-white sm:p-6`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mb-2 text-sm opacity-90">{stat.label}</p>
                  <p className="text-2xl font-bold sm:text-3xl">{value}</p>
                </div>
                <Icon className="h-6 w-6 shrink-0 opacity-50 sm:h-8 sm:w-8" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
          <h2 className="mb-6 break-words text-xl font-bold text-white">
            User Role Distribution
          </h2>
          <ChartBox>
            {(width, height) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={userRoleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label
                >
                  {userRoleData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            )}
          </ChartBox>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
          <h2 className="mb-6 break-words text-xl font-bold text-white">
            Orders by Status
          </h2>
          <ChartBox>
            {(width, height) => (
              <BarChart
                width={width}
                height={height}
                data={orderStatusData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f472b6" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ChartBox>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
          <h2 className="mb-6 break-words text-xl font-bold text-white">
            Revenue Trend
          </h2>
          <ChartBox>
            {(width, height) => (
              <LineChart
                width={width}
                height={height}
                data={revenueTrendData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => `₹${Number(value).toFixed(2)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            )}
          </ChartBox>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Latest Orders</h2>
              <p className="text-sm text-slate-400">
                Overview of recent order activity.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Order #{String(order.id).padStart(4, "0")}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {order.customer}
                    </p>
                    <p className="text-sm text-slate-400">
                      {order.payment_method}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-sm text-slate-400">Status</p>
                    <span className="inline-flex rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-300">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
          <h2 className="mb-6 text-xl font-bold text-white">Top Sellers</h2>
          <div className="space-y-4">
            {sellers.length ? (
              sellers.slice(0, 4).map((seller) => (
                <div
                  key={seller.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
                >
                  <p className="font-semibold text-white">{seller.username}</p>
                  <p className="text-sm text-slate-400">{seller.email}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No sellers yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
