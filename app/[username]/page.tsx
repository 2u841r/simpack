// import React, { useState, useEffect } from 'react';
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
// import { InfoIcon } from "lucide-react";

// export default async function ProtectedPage() {
//   const supabase = createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return redirect("/sign-in");
//   }

//   const shopName = user.email.split('@')[0];

//   // Check if shop exists, if not create one
//   const { data: shop, error } = await supabase
//     .from('shops')
//     .select()
//     .eq('name', shopName)
//     .single();

//   if (error) {
//     // Shop doesn't exist, create one
//     await supabase.from('shops').insert({ name: shopName });
//   }

//   return (
//     <div className="flex-1 w-full flex flex-col gap-12">
//       <div className="w-full">
//         <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
//         {user.email.split('@')[0] === 'ziz' ? (
//           <AdminDashboard shopName={shopName} />
//         ) : (
//           <CustomerDashboard shopName={shopName} />
//         )}
//       </div>
//     </div>
//   );
// }

// function AdminDashboard({ shopName }) {
//   const [packages, setPackages] = useState([]);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchPackages();
//     fetchOrders();
//   }, []);

//   const fetchPackages = async () => {
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('packages')
//       .select()
//       .eq('shop', shopName);
//     if (data) setPackages(data);
//   };

//   const fetchOrders = async () => {
//     const supabase = createClient();
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const { data, error } = await supabase
//       .from('orders')
//       .select()
//       .eq('shop', shopName)
//       .gte('created_at', yesterday.toISOString())
//       .order('created_at', { ascending: false });
//     if (data) setOrders(data);
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Manage Packages</h2>
//       <PackageForm onSubmit={fetchPackages} shopName={shopName} />
//       <h2 className="text-xl font-semibold my-4">Current Packages</h2>
//       <PackageList packages={packages} onUpdate={fetchPackages} isAdmin={true} />
//       <h2 className="text-xl font-semibold my-4">Recent Orders</h2>
//       <OrderList orders={orders} />
//     </div>
//   );
// }

// function CustomerDashboard({ shopName, userEmail }) {
//   const [packages, setPackages] = useState([]);
//   const [selectedPackage, setSelectedPackage] = useState(null);

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   const fetchPackages = async () => {
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('packages')
//       .select()
//       .eq('shop', shopName);
//     if (data) setPackages(data);
//   };

//   const handleOrderSubmit = () => {
//     setSelectedPackage(null);
//     // Optionally, refresh the packages list or show a success message
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Available Packages</h2>
//       <PackageList
//         packages={packages}
//         isCustomer={true}
//         onSelectPackage={setSelectedPackage}
//       />
//       {selectedPackage && (
//         <div className="mt-8">
//           <h3 className="text-lg font-semibold mb-4">Order Package</h3>
//           <OrderForm packageData={selectedPackage} onSubmit={handleOrderSubmit} />
//         </div>
//       )}
//     </div>
//   );
// }

// function PackageForm({ onSubmit, shopName, initialData }) {
//   const [formData, setFormData] = useState(initialData || {
//     operator: '',
//     price: '',
//     minutes: '',
//     gb: '',
//     sms: '',
//     validity: '',
//     note: '',
//     customNote: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const supabase = createClient();
//     if (initialData) {
//       await supabase.from('packages').update({...formData, shop: shopName}).eq('id', initialData.id);
//     } else {
//       await supabase.from('packages').insert({...formData, shop: shopName});
//     }
//     onSubmit();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <select
//         name="operator"
//         value={formData.operator}
//         onChange={handleInputChange}
//         required
//         className="w-full p-2 border rounded"
//       >
//         <option value="">Select Operator</option>
//         <option value="GP">GP</option>
//         <option value="ROBI">ROBI</option>
//         <option value="BL">BL</option>
//         <option value="AIRTEL">AIRTEL</option>
//       </select>
//       <input
//         type="number"
//         name="price"
//         value={formData.price}
//         onChange={handleInputChange}
//         placeholder="Price"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="number"
//         name="minutes"
//         value={formData.minutes}
//         onChange={handleInputChange}
//         placeholder="Minutes"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="number"
//         name="gb"
//         value={formData.gb}
//         onChange={handleInputChange}
//         placeholder="GB"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="number"
//         name="sms"
//         value={formData.sms}
//         onChange={handleInputChange}
//         placeholder="SMS"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="number"
//         name="validity"
//         value={formData.validity}
//         onChange={handleInputChange}
//         placeholder="Validity (days)"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <select
//         name="note"
//         value={formData.note}
//         onChange={handleInputChange}
//         className="w-full p-2 border rounded"
//       >
//         <option value="">Select Note (Optional)</option>
//         <option value="OTT free">OTT free</option>
//         <option value="Only Dhaka">Only Dhaka</option>
//         <option value="All without CTG">All without CTG</option>
//         <option value="custom">Custom Note</option>
//       </select>
//       {formData.note === 'custom' && (
//         <input
//           type="text"
//           name="customNote"
//           value={formData.customNote}
//           onChange={handleInputChange}
//           placeholder="Custom Note"
//           className="w-full p-2 border rounded"
//         />
//       )}
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//         {initialData ? 'Update Package' : 'Add Package'}
//       </button>
//     </form>
//   );
// }

// function PackageList({ packages, onUpdate, isAdmin, onSelectPackage }) {
//   return (
//     <div className="space-y-4">
//       {packages.map(pkg => (
//         <div key={pkg.id} className="border p-4 rounded">
//           <p>{pkg.operator} - {pkg.price}TK - {pkg.gb}GB - {pkg.minutes} Minutes - {pkg.sms} SMS - {pkg.validity} Days</p>
//           <p>{pkg.note === 'custom' ? pkg.customNote : pkg.note}</p>
//           {isAdmin ? (
//             <button onClick={() => onUpdate(pkg)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
//               Edit
//             </button>
//           ) : (
//             <button onClick={() => onSelectPackage(pkg)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
//               Order
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// function OrderList({ orders }) {
//   return (
//     <div className="space-y-4">
//       {orders.map(order => (
//         <div key={order.id} className="border p-4 rounded">
//           <p>Mobile: {order.mobile}</p>
//           <p>Payment: {order.payment_method}</p>
//           <p>Transaction ID: {order.transaction_id}</p>
//           <p>Amount: {order.amount}</p>
//           <p>Date: {new Date(order.created_at).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// function OrderForm({ packageData, onSubmit }) {
//   const [formData, setFormData] = useState({
//     mobile: '',
//     payment_method: '',
//     payment_number: '',
//     transaction_id: '',
//     amount: packageData.price,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const supabase = createClient();
//     await supabase.from('orders').insert({
//       ...formData,
//       package_id: packageData.id,
//       created_at: new Date().toISOString(),
//     });
//     onSubmit();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="tel"
//         name="mobile"
//         value={formData.mobile}
//         onChange={handleInputChange}
//         placeholder="Mobile Number"
//         required
//         pattern="[0-9]{11}"
//         className="w-full p-2 border rounded"
//       />
//       <div>
//         <label className="block mb-2">Payment Method</label>
//         <div className="space-x-4">
//           {['bKash', 'Nagad', 'Rocket', 'Bank'].map(method => (
//             <label key={method} className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="payment_method"
//                 value={method}
//                 checked={formData.payment_method === method}
//                 onChange={handleInputChange}
//                 required
//                 className="mr-2"
//               />
//               {method}
//             </label>
//           ))}
//         </div>
//       </div>
//       <input
//         type="tel"
//         name="payment_number"
//         value={formData.payment_number}
//         onChange={handleInputChange}
//         placeholder="Payment Account Number"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="text"
//         name="transaction_id"
//         value={formData.transaction_id}
//         onChange={handleInputChange}
//         placeholder="Transaction ID"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="number"
//         name="amount"
//         value={formData.amount}
//         onChange={handleInputChange}
//         placeholder="Amount"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//         Submit Order
//       </button>
//     </form>
//   );
// }

// // This is a server component
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import ClientSideDashboard from "@/components/ClientSideDashboard";

// export default async function ProtectedPage() {
//   const supabase = createClient();

//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     console.log('test')
//     return redirect("/sign-in");
//   }

//   const shopName = user.email.split('@')[0];

//   // Check if shop exists, if not create one
//   const { data: shop, error } = await supabase
//     .from('shops')
//     .select()
//     .eq('name', shopName)
//     .single();

//   if (error) {
//     // Shop doesn't exist, create one
//     await supabase.from('shops').insert({ name: shopName });
//   }

//   return (
//     <div className="flex-1 w-full flex flex-col gap-12">
//       <div className="w-full">
//         <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>

//         {/* <ClientSideDashboard shopName={shopName} userEmail={user.email} /> */}
//       </div>
//     </div>
//   );
// }

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Admin from "@/components/Admin";
import ClientOrderView from "@/components/clientOrderView";

const ShopPage = async ({ params }) => {
  const supabase = createClient();
  const { username } = params;

  const { data: session } = await supabase.auth.getSession();
  const user = session;

  // Fetch the shop by the username (from shops table)
  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("name", username)
    .single();

  if (error || !shop) {
    console.log("haha");
    notFound();
  }
  const sbuser = await supabase.auth.getUser()

  // Determine if logged-in user is the admin
  const isAdmin =
    user.session && sbuser?.data?.user?.email?.split("@")[0] === shop.name;


  // Render either the admin panel or the public shop view
  return (
    <div>
      <h1>Welcome to {shop.name}'s Shop</h1>
      {isAdmin ? (
        <Admin shop_name={shop.name}  />
        // <h1> fuck </h1>
      ) : (
        <ClientOrderView shop_name={shop.name} />
      )}
    </div>
  );
};

export default ShopPage;
