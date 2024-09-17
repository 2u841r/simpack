import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
        >
          <SupabaseLogo />
        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        ড্রাইভ প্যাক বিক্রি করার সহজ মাধ্যম{" "}
      </p>

      <p className="text-center">
        সাইন আপ করার পর আপনি প্যাকেজ তৈরি করতে পারবেন। এবং কাস্টমার আপনার লিংকে
        ভিজিট করে অর্ডার দিতে পারবে, সেই অর্ডার আপনি দেখতে পারবেন।   <br />     আপনার ইমেইল যদি হয় khalid2@gmail.com তাহলে আপনার শপের লিংক হবে
        domain.com/khalid2
      </p>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
