"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Truck,
  Download,
  X,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type OrderItem = {
  productId?: number;
  productName?: string;
  slug?: string;
  productType?: string | null;
  price?: number;
  currency?: string;
  quantity?: number;
};

type Order = {
  id: number;
  created_at: string;
  order_number: string;

  customer_name: string;
  customer_email: string;
  customer_phone: string | null;

  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;

  items: OrderItem[];

  subtotal: number;
  gst: number;
  handling_charge: number;
  total_amount: number;

  currency: string;

  payment_id: string | null;
  payment_method: string | null;
  payment_status: string;
  order_status: string;
};

type AdminUser = {
  id: string;
  email: string;
  is_owner: boolean;
  can_manage_orders: boolean;
};

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const paymentStatuses = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

type ProductTypeFilter = "all" | "digital" | "physical";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amount: number, currency = "INR") {
  return `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function statusClasses(status: string) {
  const value = status.toLowerCase();

  if (value === "paid" || value === "completed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (value === "processing") {
    return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }

  if (value === "pending") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (value === "failed" || value === "cancelled") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (value === "refunded") {
    return "border-purple-400/20 bg-purple-400/10 text-purple-300";
  }

  if (value === "shipped") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  return "border-white/10 bg-white/5 text-white/60";
}

function StatusIcon({ status }: { status: string }) {
  const value = status.toLowerCase();

  if (value === "paid" || value === "completed") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  if (value === "failed" || value === "cancelled") {
    return <XCircle className="h-3.5 w-3.5" />;
  }

  if (value === "processing") {
    return <Loader2 className="h-3.5 w-3.5" />;
  }

  if (value === "shipped") {
    return <Truck className="h-3.5 w-3.5" />;
  }

  return <Clock3 className="h-3.5 w-3.5" />;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses(
        status
      )}`}
    >
      <StatusIcon status={status} />
      {status}
    </span>
  );
}

function getProductTypes(order: Order): ProductTypeFilter[] {
  const types = new Set<ProductTypeFilter>();

  for (const item of order.items || []) {
    if (item.productType?.toLowerCase() === "physical") {
      types.add("physical");
    } else {
      types.add("digital");
    }
  }

  return Array.from(types);
}

function orderHasProductType(
  order: Order,
  filter: ProductTypeFilter
) {
  if (filter === "all") return true;

  return getProductTypes(order).includes(filter);
}

function ProductTypeBadge({
  type,
}: {
  type: "digital" | "physical";
}) {
  if (type === "physical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-300">
        <Truck className="h-3.5 w-3.5" />
        Physical
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-300">
      <Download className="h-3.5 w-3.5" />
      Digital
    </span>
  );
}

export default function OrdersManagerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [accessChecking, setAccessChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] =
    useState<ProductTypeFilter>("all");

  const [expandedOrder, setExpandedOrder] =
    useState<number | null>(null);

  const [updatingOrder, setUpdatingOrder] =
    useState<number | null>(null);

  /*
   * ---------------------------------------------------------
   * ADMIN ACCESS CHECK
   * ---------------------------------------------------------
   *
   * Important:
   * - We use supabaseBrowser for BOTH auth and database access.
   * - We identify the admin by Auth UUID.
   * - We do NOT look up admin_users by email.
   * - This matches the RLS policy:
   *
   *     id = auth.uid()
   *
   * - Owner automatically has access.
   * - Orders Manager permission also grants access.
   */

  async function checkAdminAccess() {
    setAccessChecking(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseBrowser.auth.getUser();

      if (userError) {
        console.error(
          "AUTH USER ERROR:",
          userError
        );

        setHasAccess(false);
        return;
      }

      if (!user) {
        console.error(
          "NO AUTHENTICATED USER FOUND"
        );

        setHasAccess(false);
        return;
      }

      console.log(
        "AUTHENTICATED USER:",
        user.id,
        user.email
      );

      /*
       * Query by UUID, not email.
       * This matches the admin_users RLS policy.
       */

      const {
        data: admin,
        error: adminError,
      } = await supabaseBrowser
        .from("admin_users")
        .select(
          "id, email, is_owner, can_manage_orders"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (adminError) {
        console.error(
          "ADMIN USERS QUERY ERROR:",
          adminError
        );

        setHasAccess(false);
        return;
      }

      if (!admin) {
        console.error(
          "No admin_users record found for Auth UUID:",
          user.id
        );

        console.error(
          "Auth email:",
          user.email
        );

        setHasAccess(false);
        return;
      }

      console.log(
        "ADMIN RECORD FOUND:",
        admin
      );

      const adminRecord = admin as AdminUser;

      const allowed =
        adminRecord.is_owner === true ||
        adminRecord.can_manage_orders === true;

      console.log(
        "ORDERS MANAGER ACCESS:",
        allowed
      );

      setHasAccess(allowed);
    } catch (error) {
      console.error(
        "ADMIN ACCESS CHECK FAILED:",
        error
      );

      setHasAccess(false);
    } finally {
      setAccessChecking(false);
    }
  }

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();

    window.location.replace(
      "/admin/login?role=orders"
    );
  }

  async function loadOrders(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "ORDERS LOAD ERROR:",
        error
      );

      setOrders([]);
    } else {
      setOrders((data || []) as Order[]);
    }

    setLoading(false);
    setRefreshing(false);
  }

  /*
   * First check authentication/admin permission.
   * Only after permission is confirmed do we load orders.
   */

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (!accessChecking && hasAccess) {
      loadOrders();
    }
  }, [accessChecking, hasAccess]);

  async function updateOrderStatus(
    orderId: number,
    newStatus: string
  ) {
    setUpdatingOrder(orderId);

    const { error } = await supabaseBrowser
      .from("orders")
      .update({
        order_status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error(
        "ORDER STATUS UPDATE ERROR:",
        error
      );

      alert(
        "Unable to update order status."
      );
    } else {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_status: newStatus,
              }
            : order
        )
      );
    }

    setUpdatingOrder(null);
  }

  async function updatePaymentStatus(
    orderId: number,
    newStatus: string
  ) {
    setUpdatingOrder(orderId);

    const { error } = await supabaseBrowser
      .from("orders")
      .update({
        payment_status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error(
        "PAYMENT STATUS UPDATE ERROR:",
        error
      );

      alert(
        "Unable to update payment status."
      );
    } else {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                payment_status: newStatus,
              }
            : order
        )
      );
    }

    setUpdatingOrder(null);
  }

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.order_number
          ?.toLowerCase()
          .includes(query) ||
        order.customer_name
          ?.toLowerCase()
          .includes(query) ||
        order.customer_email
          ?.toLowerCase()
          .includes(query) ||
        order.payment_id
          ?.toLowerCase()
          .includes(query);

      const matchesOrderStatus =
        statusFilter === "all" ||
        order.order_status?.toLowerCase() ===
          statusFilter;

      const matchesPaymentStatus =
        paymentFilter === "all" ||
        order.payment_status?.toLowerCase() ===
          paymentFilter;

      const matchesProductType =
        orderHasProductType(
          order,
          productTypeFilter
        );

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentStatus &&
        matchesProductType
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    productTypeFilter,
  ]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter(
        (order) =>
          order.payment_status?.toLowerCase() ===
          "paid"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total_amount || 0),
        0
      );

    const digitalOrders = orders.filter((order) =>
      orderHasProductType(order, "digital")
    ).length;

    const physicalOrders = orders.filter((order) =>
      orderHasProductType(order, "physical")
    ).length;

    return {
      total: orders.length,

      paid: orders.filter(
        (order) =>
          order.payment_status?.toLowerCase() ===
          "paid"
      ).length,

      processing: orders.filter(
        (order) =>
          order.order_status?.toLowerCase() ===
          "processing"
      ).length,

      completed: orders.filter(
        (order) =>
          order.order_status?.toLowerCase() ===
          "completed"
      ).length,

      digitalOrders,
      physicalOrders,
      revenue,
    };
  }, [orders]);

  /*
   * ---------------------------------------------------------
   * ACCESS CHECKING
   * ---------------------------------------------------------
   */

  if (accessChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_0%,rgba(255,220,80,0.30),transparent_35%),radial-gradient(circle_at_85%_100%,rgba(255,190,40,0.22),transparent_40%),linear-gradient(135deg,#332600_0%,#4a3708_50%,#302400_100%)] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-10 text-center backdrop-blur-xl">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

          <p className="mt-5 text-sm font-semibold text-white/60">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * ACCESS DENIED
   * ---------------------------------------------------------
   */

  if (!hasAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_0%,rgba(255,220,80,0.30),transparent_35%),radial-gradient(circle_at_85%_100%,rgba(255,190,40,0.22),transparent_40%),linear-gradient(135deg,#332600_0%,#4a3708_50%,#302400_100%)] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/10">
            <XCircle className="h-8 w-8 text-red-300" />
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Access Denied
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Your admin account does not have
            permission to access Orders Manager.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(255,220,80,0.30),transparent_35%),radial-gradient(circle_at_85%_100%,rgba(255,190,40,0.22),transparent_40%),linear-gradient(135deg,#332600_0%,#4a3708_50%,#302400_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <ShoppingBag className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  MindraInfo Admin
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight">
                  Orders Manager
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm text-white/40">
              Manage customer orders, payments,
              digital products and physical deliveries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/80 transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh Orders
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-7">

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-white/35">
              Total Orders
            </p>
            <p className="mt-3 text-3xl font-black">
              {stats.total}
            </p>
          </div>

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/60">
              Paid
            </p>
            <p className="mt-3 text-3xl font-black text-emerald-300">
              {stats.paid}
            </p>
          </div>

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-blue-400/10 bg-blue-400/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-300/60">
              Processing
            </p>
            <p className="mt-3 text-3xl font-black text-blue-300">
              {stats.processing}
            </p>
          </div>

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-purple-400/10 bg-purple-400/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-300/60">
              Completed
            </p>
            <p className="mt-3 text-3xl font-black text-purple-300">
              {stats.completed}
            </p>
          </div>

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-violet-400/10 bg-violet-400/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-300/60">
              Digital
            </p>
            <p className="mt-3 text-3xl font-black text-violet-300">
              {stats.digitalOrders}
            </p>
          </div>

          <div className="min-w-[135px] shrink-0 rounded-3xl border border-orange-400/10 bg-orange-400/[0.04] p-5 transition hover:-translate-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-300/60">
              Physical
            </p>
            <p className="mt-3 text-3xl font-black text-orange-300">
              {stats.physicalOrders}
            </p>
          </div>

          <div className="min-w-[145px] shrink-0 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5 transition hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300/60">
              Paid Revenue
            </p>

            <p className="mt-3 text-2xl font-black text-cyan-300">
              INR{" "}
              {stats.revenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-4 lg:flex-row">

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search order, customer, email or payment ID..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-cyan-400/40"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#0b1228] px-4 py-3 text-sm font-semibold outline-none focus:border-cyan-400/40"
              >
                <option value="all">
                  All Order Status
                </option>

                {orderStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
                className="rounded-2xl border border-white/10 bg-[#0b1228] px-4 py-3 text-sm font-semibold outline-none focus:border-cyan-400/40"
              >
                <option value="all">
                  All Payment Status
                </option>

                {paymentStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="mr-2 text-xs font-bold uppercase tracking-wider text-white/30">
                Product Type
              </span>

              {(
                [
                  ["all", "All Orders"],
                  ["digital", "Digital"],
                  ["physical", "Physical"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setProductTypeFilter(value)
                  }
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                    productTypeFilter === value
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/30">
            <span>
              Showing {filteredOrders.length} of{" "}
              {orders.length} orders
            </span>

            {(search ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              productTypeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setProductTypeFilter("all");
                }}
                className="inline-flex items-center gap-1.5 font-bold text-cyan-400 transition hover:text-cyan-300"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* ORDERS */}

        <section className="mt-6">

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

              <p className="mt-4 text-sm text-white/40">
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.05]">
                <Package className="h-7 w-7 text-white/30" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Orders created through checkout
                will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredOrders.map((order) => {
                const isExpanded =
                  expandedOrder === order.id;

                const isUpdating =
                  updatingOrder === order.id;

                const productTypes =
                  getProductTypes(order);

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-white/15"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrder(
                          isExpanded
                            ? null
                            : order.id
                        )
                      }
                      className="w-full px-5 py-5 text-left transition hover:bg-white/[0.025] md:px-6"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="font-black text-white">
                              {order.order_number}
                            </span>

                            {productTypes.map((type) => (
                              <ProductTypeBadge
                                key={type}
                                type={
                                  type as
                                    | "digital"
                                    | "physical"
                                }
                              />
                            ))}

                            <StatusBadge
                              status={
                                order.payment_status
                              }
                            />

                            <StatusBadge
                              status={
                                order.order_status
                              }
                            />
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35">

                            <span className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              {order.customer_name}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5" />
                              {order.customer_email}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Package className="h-3.5 w-3.5" />
                              {order.items?.length || 0}{" "}
                              item
                              {order.items?.length === 1
                                ? ""
                                : "s"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 xl:justify-end">

                          <div className="text-left xl:text-right">

                            <p className="text-xs text-white/30">
                              {formatDate(
                                order.created_at
                              )}
                            </p>

                            <p className="mt-1 text-xl font-black">
                              {formatMoney(
                                order.total_amount,
                                order.currency
                              )}
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-white/60" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-white/60" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-white/10 bg-[#121a2b]/90 px-5 py-6 md:px-6">

                        <div className="grid gap-6 lg:grid-cols-3">

                          {/* CUSTOMER */}

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                                <User className="h-4 w-4 text-cyan-300" />
                              </div>

                              <h3 className="font-bold">
                                Customer
                              </h3>
                            </div>

                            <div className="mt-5 space-y-3 text-sm">

                              <p className="font-semibold">
                                {order.customer_name}
                              </p>

                              <p className="flex items-center gap-2 text-white/45">
                                <Mail className="h-4 w-4" />
                                {order.customer_email}
                              </p>

                              {order.customer_phone && (
                                <p className="flex items-center gap-2 text-white/45">
                                  <Phone className="h-4 w-4" />
                                  {order.customer_phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* PAYMENT */}

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                                <CreditCard className="h-4 w-4 text-emerald-300" />
                              </div>

                              <h3 className="font-bold">
                                Payment
                              </h3>
                            </div>

                            <div className="mt-5 space-y-4">

                              <div>
                                <p className="text-xs text-white/30">
                                  Payment ID
                                </p>

                                <p className="mt-1 break-all text-sm font-semibold text-white/70">
                                  {order.payment_id || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-white/30">
                                  Method
                                </p>

                                <p className="mt-1 text-sm font-semibold capitalize text-white/70">
                                  {order.payment_method || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-white/30">
                                  Payment Status
                                </p>

                                <div className="mt-2">
                                  <StatusBadge
                                    status={
                                      order.payment_status
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DELIVERY */}

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10">
                                <MapPin className="h-4 w-4 text-purple-300" />
                              </div>

                              <h3 className="font-bold">
                                Delivery
                              </h3>
                            </div>

                            {order.shipping_address ? (
                              <div className="mt-5 text-sm leading-6 text-white/50">

                                <p>
                                  {order.shipping_address}
                                </p>

                                <p>
                                  {order.shipping_city}
                                  {order.shipping_state
                                    ? `, ${order.shipping_state}`
                                    : ""}
                                </p>

                                <p>
                                  {order.shipping_pincode}
                                </p>
                              </div>
                            ) : (
                              <div className="mt-5">

                                <p className="text-sm text-white/35">
                                  Digital product —
                                  no shipping required.
                                </p>

                                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-300">
                                  <Smartphone className="h-4 w-4" />
                                  Digital Delivery
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ORDER ITEMS */}

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10">
                              <ShoppingBag className="h-4 w-4 text-blue-300" />
                            </div>

                            <h3 className="font-bold">
                              Order Items
                            </h3>
                          </div>

                          <div className="mt-5 space-y-3">

                            {(order.items || []).map(
                              (item, index) => {
                                const isPhysical =
                                  item.productType?.toLowerCase() ===
                                  "physical";

                                return (
                                  <div
                                    key={`${order.id}-${index}`}
                                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between"
                                  >

                                    <div>

                                      <div className="flex flex-wrap items-center gap-2">

                                        <p className="font-semibold">
                                          {item.productName ||
                                            "Product"}
                                        </p>

                                        <ProductTypeBadge
                                          type={
                                            isPhysical
                                              ? "physical"
                                              : "digital"
                                          }
                                        />
                                      </div>

                                      {item.slug && (
                                        <p className="mt-1 text-xs text-white/25">
                                          {item.slug}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">

                                      <span className="text-white/40">
                                        Qty:{" "}
                                        <strong className="text-white/70">
                                          {item.quantity || 1}
                                        </strong>
                                      </span>

                                      <span className="font-bold">
                                        {formatMoney(
                                          Number(
                                            item.price || 0
                                          ) *
                                            Number(
                                              item.quantity || 1
                                            ),
                                          item.currency ||
                                            order.currency
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* STATUS CONTROLS */}

                        <div className="mt-6 grid gap-5 lg:grid-cols-2">

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                                  Order Status
                                </p>

                                <p className="mt-1 text-sm text-white/45">
                                  Update the order progress.
                                </p>
                              </div>

                              <select
                                value={
                                  order.order_status
                                }
                                disabled={isUpdating}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-[#0b1228] px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-cyan-400/40 disabled:opacity-50"
                              >
                                {orderStatuses.map(
                                  (status) => (
                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {status}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                                  Payment Status
                                </p>

                                <p className="mt-1 text-sm text-white/45">
                                  Update payment information.
                                </p>
                              </div>

                              <select
                                value={
                                  order.payment_status
                                }
                                disabled={isUpdating}
                                onChange={(e) =>
                                  updatePaymentStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-[#0b1228] px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-cyan-400/40 disabled:opacity-50"
                              >
                                {paymentStatuses.map(
                                  (status) => (
                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {status}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* DELIVERY CONTROLS */}

                        <div className="mt-6 grid gap-5 lg:grid-cols-2">

                          {productTypes.includes(
                            "digital"
                          ) && (
                            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.04] p-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
                                  <Download className="h-5 w-5 text-violet-300" />
                                </div>

                                <div>
                                  <h3 className="font-bold">
                                    Digital Delivery
                                  </h3>

                                  <p className="text-xs text-white/35">
                                    Digital product access
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    "Digital download management will be connected to the customer's secure download system."
                                  )
                                }
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-sm font-bold text-violet-300 transition hover:-translate-y-0.5 hover:bg-violet-400/15"
                              >
                                <Download className="h-4 w-4" />
                                Download Product
                              </button>
                            </div>
                          )}

                          {productTypes.includes(
                            "physical"
                          ) && (
                            <div className="rounded-2xl border border-orange-400/15 bg-orange-400/[0.04] p-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10">
                                  <Truck className="h-5 w-5 text-orange-300" />
                                </div>

                                <div>
                                  <h3 className="font-bold">
                                    Physical Delivery
                                  </h3>

                                  <p className="text-xs text-white/35">
                                    Shipping management
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
                                Shipping and tracking
                                controls can be connected
                                here when physical products
                                are activated.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* TOTAL */}

                        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                              Total Order Value
                            </p>

                            <p className="mt-1 text-sm text-white/40">
                              {order.currency}
                            </p>
                          </div>

                          <p className="text-3xl font-black text-cyan-300">
                            {formatMoney(
                              order.total_amount,
                              order.currency
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
