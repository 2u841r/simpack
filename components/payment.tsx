"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface PayMethod {
  bkash: string;
  nagad: string;
  rocket: string;
  bank: string;
}

const Payment = ({ shopName }: { shopName: string }) => {
  const supabase = createClient();
  const [paymentMethods, setPaymentMethods] = useState<PayMethod>({
    bkash: "",
    nagad: "",
    rocket: "",
    bank: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch current payment methods from database
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data, error } = await supabase
        .from("paymethod")
        .select("*")
        .eq("shop_name", shopName)
        .single();

      if (error && error.code === "PGRST116") {
        // If no record exists, create a default record
        const { error: insertError } = await supabase.from("paymethod").insert({
          shop_name: shopName,
          bkash: "",
          nagad: "",
          rocket: "",
          bank: "",
        });
        if (insertError) {
          console.error(insertError);
        }
      } else if (data) {
        setPaymentMethods({
          bkash: data.bkash || "",
          nagad: data.nagad || "",
          rocket: data.rocket || "",
          bank: data.bank || "",
        });
      }

      setLoading(false);
    };

    fetchPaymentMethods();
  }, [shopName]);

  // Handle form submission for updating payment methods
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("paymethod")
      .update(paymentMethods)
      .eq("shop_name", shopName);

    if (error) {
      console.error("Error updating payment methods", error);
    } else {
      setIsEditing(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-black font-bold mb-4">Payment Methods for {shopName}</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {["bkash", "nagad", "rocket", "bank"].map((method) => (
            <div key={method} className="mb-4">
              <label className="block text-sm font-medium text-black">
                {method.charAt(0).toUpperCase() + method.slice(1)}:
              </label>
              <input
                type="text"
                value={(paymentMethods as any)[method]}
                onChange={(e) =>
                  setPaymentMethods({
                    ...paymentMethods,
                    [method]: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-4 bg-gray-300 text-black px-4 py-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <ul className="list-disc text-black pl-6 mb-4">
            <li>Bkash: {paymentMethods.bkash || "Not set"}</li>
            <li>Nagad: {paymentMethods.nagad || "Not set"}</li>
            <li>Rocket: {paymentMethods.rocket || "Not set"}</li>
            <li>Bank: {paymentMethods.bank || "Not set"}</li>
          </ul>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Payment Methods
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
