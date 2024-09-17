import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const OrderForm = ({ packageId, shopName, closePopup }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMobile, setPaymentMobile] = useState("");
  const [orderTime] = useState(new Date().toISOString());
  const [orderSubmitted, setOrderSubmitted] = useState(false); // State for order confirmation

  const handleSubmit = async (e) => {
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
        shop_name: shopName, // Add shop_name to ensure the order is associated with the shop
      },
    ]);

    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Order placed:", data);
      setOrderSubmitted(true); // Set orderSubmitted to true after successful submission
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        {orderSubmitted ? (
          // Confirmation message after successful order
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Order Submitted Successfully!
            </h2>
            <p className="mb-4">
              Please wait for a moment. If you are in a hurry, please contact
              the shop owner.
            </p>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        ) : (
          // Form for placing an order
          <div>
            <h2 className="text-xl font-semibold mb-4">Place Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Mobile Number</label>
                <input
                  type="text"
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
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="form-radio"
                      />
                      <span className="text-black ml-2">
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
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
                  type="text"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
