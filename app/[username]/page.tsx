import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Admin from "@/components/admin";
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
      <h1 className="text-center">Welcome to <span className="font-bold"> {shop.name} </span>'s Shop</h1>
      {isAdmin ? (
        <Admin shop_name={shop.name}  />
        // <h1> test </h1>
      ) : (
        <ClientOrderView shop_name={shop.name} />
      )}
    </div>
  );
};

export default ShopPage;
