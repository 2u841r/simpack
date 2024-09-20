import React, { useState, useEffect } from "react";

const AdminCurrentPacks = ({ packages, supabase, fetchData }) => {
  const [user, setUser] = useState<any>(null);

  const operatorColors = {
    GP: "text-[#19AAF8]",
    BL: "text-[#F16522]",
    Robi: "text-[#D91D24]",
    Airtel: "text-[#ED1C24]",
  };

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
          operator: selectedPackage.operator,
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

      // console.log("Package updated successfully:", data);

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

  return (
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
                    <span
                      className={`${operatorColors[pkg.operator] || "text-black"}`}
                    >
                      {pkg.operator}
                    </span>{" "}
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
                      // onClick={() => handleOrder(pkg.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Order x
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

      {/* Edit Package Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Package</h3>

            {/* Edit form */}
            <div className="space-y-4">
              <label htmlFor="operator" className="text-black text-xl">
                Choose a Operator:{" "}
              </label>
              <select
                name="operator"
                id="operator"
                value={selectedPackage.operator}
                onChange={(e) =>
                  setSelectedPackage({ ...selectedPackage, operator: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GP">GP</option>
                <option value="BL">BL</option>
                <option value="Robi">Robi</option>
                <option value="Airtel">Airtel</option>
              </select>

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
    </div>
  );
};

export default AdminCurrentPacks;
