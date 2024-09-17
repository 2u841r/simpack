"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Define the type for a package
interface Package {
  id: number;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [packages, setPackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newPackage, setNewPackage] = useState({
    gb: "",
    minutes: "",
    validity: "",
    price: "",
    note: "",
  });
  const [user, setUser] = useState<any>(null);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    fetchUser();
  }, []);

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
      console.log("Orders Data:", ordersData);
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
      setNewPackage({ gb: "", minutes: "", validity: "", price: "", note: "" });
    }
  };

  // Handle opening the edit modal with package details
  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg); // Set the selected package to edit
    setIsEditModalOpen(true); // Open the modal
  };

  // Handle closing the edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPackage(null);
  };

  // Handle submitting the edited package
  const handleSubmitEdit = async () => {
    if (!selectedPackage) return;

    try {
      // Send the updated package data to Supabase
      const { data, error } = await supabase
        .from("packages")
        .update({
          gb: selectedPackage.gb,
          minutes: selectedPackage.minutes,
          validity: selectedPackage.validity,
          price: selectedPackage.price,
          note: selectedPackage.note,
        })
        .eq("id", selectedPackage.id);

      // Check for errors during the update process
      if (error) {
        console.error("Error updating package:", error.message);
        return;
      }

      console.log("Package updated successfully:", data);

      // // Refresh the list of packages after the update (if needed)
       fetchData();

      // Close modal after submit
      handleCloseModal();
    } catch (err) {
      console.error("Unexpected error during package update:", err);
    }
  };

  // Delete package function
  const handleDeletePackage = async (pkgId: number) => {
    const { error } = await supabase.from("packages").delete().eq("id", pkgId);

    if (error) {
      console.error(error.message);
    } else {
      fetchData();
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

          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Create New Package
          </h2>

          <div className="space-y-4">
            <input
              type="number"
              placeholder="GB"
              value={newPackage.gb}
              onChange={(e) =>
                setNewPackage({ ...newPackage, gb: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Minutes"
              value={newPackage.minutes}
              onChange={(e) =>
                setNewPackage({ ...newPackage, minutes: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Validity (days)"
              value={newPackage.validity}
              onChange={(e) =>
                setNewPackage({ ...newPackage, validity: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Price (tk)"
              value={newPackage.price}
              onChange={(e) =>
                setNewPackage({ ...newPackage, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Note (optional)"
              value={newPackage.note}
              onChange={(e) =>
                setNewPackage({ ...newPackage, note: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCreatePackage}
            className="mt-6 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Package
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Packages
          </h2>

          {packages?.length > 0 ? (
            <ul className="space-y-6">
              {packages.map((pkg) => (
                <li
                  key={pkg.id}
                  className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center"
                >
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {pkg.gb} GB + {pkg.minutes} Minutes
                    </h3>
                    <p className="text-sm text-gray-500">
                      Validity: {pkg.validity} days
                    </p>
                    <p className="text-gray-800 font-bold">${pkg.price}</p>
                    {pkg.note && (
                      <p className="text-xs text-gray-400">{pkg.note}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    {user ? (
                      <span className="flex space-x-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        {/* <button
                          onClick={() => handleEditPackage(pkg.id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                        >
                          Edit
                        </button> */}
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                        >
                          Delete
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOrder(pkg.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Order
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No packages found.</p>
          )}
        </div>
      </div>

      {/* Edit Package Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Package</h3>

            {/* Edit form */}
            <div className="space-y-4">
              <input
                type="number"
                value={selectedPackage?.gb}
                onChange={(e) =>
                  setSelectedPackage({ ...selectedPackage, gb: e.target.value })
                }
                placeholder="GB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={selectedPackage?.minutes}
                onChange={(e) =>
                  setSelectedPackage({
                    ...selectedPackage,
                    minutes: e.target.value,
                  })
                }
                placeholder="Minutes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={selectedPackage?.validity}
                onChange={(e) =>
                  setSelectedPackage({
                    ...selectedPackage,
                    validity: e.target.value,
                  })
                }
                placeholder="Validity (days)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={selectedPackage?.price}
                onChange={(e) =>
                  setSelectedPackage({
                    ...selectedPackage,
                    price: e.target.value,
                  })
                }
                placeholder="Price (tk)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                value={selectedPackage?.note}
                onChange={(e) =>
                  setSelectedPackage({
                    ...selectedPackage,
                    note: e.target.value,
                  })
                }
                placeholder="Note"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Orders
          </h2>

          {orders.length > 0 ? (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className={`p-6 rounded-lg shadow-lg ${
                    order.completed
                      ? "bg-green-100 border-green-500"
                      : "bg-orange-100 border-orange-500"
                  } border-2`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.packages.gb}GB + {order.packages.minutes} Minutes
                      </h3>
                      <p className="text-sm text-gray-600">
                        Price: {order.packages.price} TK
                      </p>
                      <p className="text-gray-600">
                        Mobile: {order.mobile_number} - Payment:{" "}
                        {order.payment_method}
                      </p>
                      <p className="text-xs text-gray-500">
                        Transaction ID: {order.transaction_id}
                      </p>
                    </div>

                    {!order.completed && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Complete
                      </button>
                    )}

                    {order.completed && (
                      <span className="text-green-700 font-bold">
                        Completed
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
