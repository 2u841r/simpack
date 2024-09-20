import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const OrderForm = ({ packageId, shopName, closePopup }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMobile, setPaymentMobile] = useState("");
  const [orderTime] = useState(new Date().toISOString());
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const supabase = createClient();

      // Fetch payment methods for the current shop
      const { data, error } = await supabase
        .from("paymethod")
        .select("*")
        .eq("shop_name", shopName)
        .single();

      if (error) {
        console.error("Error fetching payment methods:", error.message);
      } else if (data) {
        setAvailablePaymentMethods(data); // Save the fetched payment methods
      }

      setLoading(false);
    };

    fetchPaymentMethods();
  }, [shopName]);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    alert("Copied to clipboard: " + value);
  };

  const handleSubmit = async (e) => {
    if (mobileNumber.length !== 11) {
      alert("Wrong mobile number");
      e.preventDefault();
      return
    }
    e.preventDefault();

    const supabase = createClient();

    const { data, error } = await supabase.from("orders").insert([
      {
        package_id: packageId,
        mobile_number: mobileNumber,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        payment_mobile: paymentMobile,
        order_time: orderTime,
        shop_name: shopName,
      },
    ]);

    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Order placed:", data);
      setOrderSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        {orderSubmitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Order Submitted Successfully!
            </h2>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Place Order</h2>
            {loading ? (
              <p>Loading payment methods...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Mobile Number</label>
                  <input
                    type="number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="11-digit mobile number"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Payment Method</label>
                  <div className="mt-1">
                    {["bkash", "rocket", "nagad", "bank"].map((method) => (
                      <label
                        key={method}
                        className="inline-flex items-center mr-4"
                      >
                        <input
                          type="radio"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="form-radio"
                          minLength={11}
                        />
                        <span className="text-black ml-2">
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {paymentMethod && (
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Selected Payment Number
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value={availablePaymentMethods[paymentMethod] || ""}
                        readOnly
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(availablePaymentMethods[paymentMethod])
                        }
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700">Transaction ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="Transaction ID"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Payment Method Mobile Number
                  </label>
                  <input
                    type="number"
                    value={paymentMobile}
                    onChange={(e) => setPaymentMobile(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="Payment method mobile number"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
