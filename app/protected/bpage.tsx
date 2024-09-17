// This is a server component
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientSideDashboard from "@/components/ClientSideDashboard";

export default async function ProtectedPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }

  const shopName = user.email.split('@')[0];

  // Check if shop exists, if not create one
  const { data: shop, error } = await supabase
    .from('shops')
    .select()
    .eq('name', shopName)
    .single();

  if (error) {
    // Shop doesn't exist, create one
    await supabase.from('shops').insert({ name: shopName });
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
        <ClientSideDashboard shopName={shopName} userEmail={user.email} />
      </div>
    </div>
  );
}
