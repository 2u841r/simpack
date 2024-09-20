"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Payment from "./payment";
import AdminOrders from "./AdminOrders";
import AdminCreatePack from "./AdminCreatePack";
import AdminCurrentPacks from "./AdminCurrentPacks";

// Define the type for a package
interface Package {
  id: number;
  operator: string; 
  gb: number;
  minutes: number;
  validity: number;
  price: number;
  note: string;
  shop_name: string;
  created_at: string;
}

const Admin = ({ shop_name }) => {
  const supabase = createClient();
  const username = shop_name;
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedPackage, setSelectedPackage] = useState(null);

  const [packages, setPackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newPackage, setNewPackage] = useState({
    operator: "",
    gb: "",
    minutes: "",
    validity: "",
    price: "",
    note: "",
  });

  // Fetch packages and orders
  const fetchData = async () => {
    const { data: packagesData, error: packagesError } = await supabase
      .from("packages")
      .select("*")
      .eq("shop_name", username);

    if (packagesError) {
      console.error("Error fetching packages:", packagesError.message);
    } else {
      // console.log("Packages Data:", packagesData);
      setPackages(packagesData || []);
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
      id,
      mobile_number,
      payment_method,
      transaction_id,
      completed,
      package_id,
      order_time,
      packages ( gb, minutes, price )
    `
      )
      .eq("shop_name", username);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError.message);
    } else {
      // console.log("Orders Data:", ordersData);
      setOrders(ordersData || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  // Create new package
  const handleCreatePackage = async () => {
    const { data, error } = await supabase.from("packages").insert([
      {
        shop_name: username,
        operator: newPackage.operator,
        gb: newPackage.gb,
        minutes: newPackage.minutes,
        validity: newPackage.validity,
        price: newPackage.price,
        note: newPackage.note,
      },
    ]);

    if (error) {
      console.error(error.message);
    } else {
      fetchData();
      setNewPackage({
        operator: "",
        gb: "",
        minutes: "",
        validity: "",
        price: "",
        note: "",
      });
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    const note = prompt("Enter a note (optional):");

    const { error } = await supabase
      .from("orders")
      .update({ completed: true, note })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error.message);
    } else {
      // Optionally, fetch updated orders data or update state directly
      fetchData();
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Admin Panel
          </h1>
          // orders component
          <AdminOrders
            orders={orders}
            handleCompleteOrder={handleCompleteOrder}
          />
          // Create pack
          <AdminCreatePack
            fetchData={fetchData}
            supabase={supabase}
            username={username}
          />
          <AdminCurrentPacks
            packages={packages}
            fetchData={fetchData}
            supabase={supabase}
          />
        </div>
      </div>

      <Payment shopName={username} />
    </div>
  );
};

export default Admin;
