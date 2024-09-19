"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import OrderForm from "./orderForm";

const ClientOrderView = ({ shop_name }) => {
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from("packages")
        .select("*")
        .eq("shop_name", shop_name);

      if (packagesError) {
        console.error("Error fetching packages:", packagesError.message);
      } else {
        setPackages(packagesData || []);
        setLoading(false);
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("shop_name", shop_name);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError.message);
      } else {
        setOrders(ordersData || []);
      }
    };

    fetchData();
  }, [shop_name]);

  const handleOrderClick = (packageId) => {
    if (!packageId) {
      console.error("Package ID is required");
      return;
    }
    setSelectedPackage(packageId);
    setShowOrderForm(true);
  };

  const closePopup = () => {
    setShowOrderForm(false);
    setSelectedPackage(null);
  };

  return loading ? (
    <div className="min-h-screen">
      <p className="mt-10 text-center text-3xl text-blue-500"> Loading... </p>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Available Packages
        </h1>
        <ul className="space-y-6">
          {packages.map((pkg) => (
            <li key={pkg.id} className="bg-white rounded-lg shadow-md m-6 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {pkg.gb}GB + {pkg.minutes} Minutes
                  </h2>
                  <p className="text-gray-500">Validity: {pkg.validity} days</p>
                  <p className="text-gray-800 font-bold">{pkg.price} tk</p>
                </div>
                <button
                  onClick={() => handleOrderClick(pkg.id)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200 ease-in-out"
                >
                  Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Form Popup */}
      {showOrderForm && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <OrderForm
              packageId={selectedPackage}
              shopName={shop_name}
              closePopup={closePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOrderView;
