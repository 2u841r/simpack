import React from "react";
import { useState } from "react";

const AdminCreatePack = ({ fetchData, supabase, username }) => {
  const [newPackage, setNewPackage] = useState({
    operator: "",
    gb: "",
    minutes: "",
    validity: "",
    price: "",
    note: "",
  });
 
  // Create new package
  const handleCreatePackage = async () => {
    if (newPackage.operator === ""){
      alert('please select a operator')
      return
    } 
    
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
      setNewPackage({operator: "",  gb: "", minutes: "", validity: "", price: "", note: "" });
    }
  };
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Create New Package
      </h2>
      <div className="space-y-4">
        <label htmlFor="operator" className="text-black text-xl">
          Choose a Operator:{" "}
        </label>
        <select
          name="operator"
          id="operator"
          onChange={(e) => setNewPackage({ ...newPackage, operator: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">--- Please select ---</option>
          <option value="GP">GP</option>
          <option value="BL">BL</option>
          <option value="Robi">Robi</option>
          <option value="Airtel">Airtel</option>
        </select>

        <input
          type="number"
          placeholder="GB"
          value={newPackage.gb}
          onChange={(e) => setNewPackage({ ...newPackage, gb: e.target.value })}
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
  );
};

export default AdminCreatePack;
