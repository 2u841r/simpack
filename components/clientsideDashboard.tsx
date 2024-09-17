"use client"; // Enables client-side rendering for this file

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Client-side Supabase import
import { useRouter } from "next/navigation";

// Initialize Supabase client
const supabase = createClient(
  "https://oaotuuesyuoqshbqpaht.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hb3R1dWVzeXVvcXNoYnFwYWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczNDgzNzAsImV4cCI6MjAzMjkyNDM3MH0.Xnaw5VakeA05kI2mnw-Sh23oPbE3oLw4vyFfmKG4Tug"
);

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in"); 
      } else {
        setUser(user);
        const shopName = user.email.split("@")[0];
        setShopName(shopName);

        // Check if shop exists, if not create one
        const { data: shop, error } = await supabase
          .from("shops")
          .select()
          .eq("name", shopName)
          .single();

        if (error && !shop) {
          // Shop doesn't exist, create one
          await supabase.from("shops").insert({ name: shopName });
        }
      }
    };
    fetchUser();
  }, [router]);

  if (!user) return null; // Render nothing until user is loaded

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
        {shopName === user.email.split("@")[0] ? (
          <AdminDashboard shopName={shopName} />
        ) : (
          <CustomerDashboard shopName={shopName} />
        )}
      </div>
    </div>
  );
}

function PackageList({ packages, onUpdate, isCustomer }) {
  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <div key={pkg.id} className="border p-4 rounded">
          <p>
            {pkg.operator} - {pkg.price}TK - {pkg.gb}GB - {pkg.minutes} Minutes
            - {pkg.sms} SMS - {pkg.validity} Days
          </p>
          <p>{pkg.note}</p>
          {isCustomer ? (
            <button
              onClick={() => handleOrder(pkg)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Order
            </button>
          ) : (
            <button
              onClick={() => onUpdate(pkg)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminDashboard({ shopName }) {
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPackages();
    fetchOrders();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from("packages")
      .select()
      .eq("shop", shopName);

    if (data) setPackages(data);
  };

  const fetchOrders = async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const { data, error } = await supabase
      .from("orders")
      .select()
      .eq("shop", shopName)
      .gte("created_at", yesterday.toISOString())
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Packages</h2>
      <PackageForm onSubmit={fetchPackages} />
      <h2 className="text-xl font-semibold my-4">Current Packages</h2>
      <PackageList packages={packages} onUpdate={fetchPackages} />
      <h2 className="text-xl font-semibold my-4">Recent Orders</h2>
      <OrderList orders={orders} />
    </div>
  );
}

function CustomerDashboard({ shopName }) {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from("packages")
      .select()
      .eq("shop", shopName);

    if (data) setPackages(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Packages</h2>
      <PackageList packages={packages} isCustomer={true} />
    </div>
  );
}

function PackageForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      operator: "",
      price: "",
      minutes: "",
      gb: "",
      sms: "",
      validity: "",
      note: "",
      customNote: "",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await supabase.from("packages").update(formData).eq("id", initialData.id);
    } else {
      await supabase.from("packages").insert(formData);
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update Package" : "Add Package"}
      </button>
    </form>
  );
}

function OrderList({ orders }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded">
          <p>Mobile: {order.mobile}</p>
          <p>Payment: {order.payment_method}</p>
          <p>Transaction ID: {order.transaction_id}</p>
          <p>Amount: {order.amount}</p>
          <p>
            Date:{" "}
            {new Date(order.created_at).toLocaleString("en-US", {
              timeZone: "Asia/Dhaka",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

async function handleOrder(pkg) {
  const mobile = prompt("Enter your mobile number:");
  const paymentMethod = prompt(
    "Enter your payment method (e.g., Bkash, Nagad):"
  );
  const transactionId = prompt("Enter the transaction ID:");

  if (!mobile || !paymentMethod || !transactionId) {
    alert("All fields are required.");
    return;
  }

  const { data, error } = await supabase.from("orders").insert({
    package_id: pkg.id,
    mobile: mobile,
    payment_method: paymentMethod,
    transaction_id: transactionId,
    amount: pkg.price,
    shop: pkg.shop,
  });

  if (error) {
    alert("Error placing order: " + error.message);
  } else {
    alert("Order placed successfully!");
  }
}
