
<h1 align="center">Simpack - ড্রাইভ প্যাক বিক্রি করার সহজ উপায়</h1>
আমার ফ্রেন্ডলিস্টে একাধিক ব্যক্তি ছিলেন, যারা ‘ড্রাইভ প্যাক’ বিক্রি করতেন/করেন।

ড্রাইভ প্যাক = জিবি, মিনিটের কম্বো বান্ডেল – যেমন ২০ জিবি ৩০০ মিনিট ৩০ দিন মেয়াদ, দাম *** টাকা। (স্বাভাবিকের চেয়ে কিছুটা/বেশ কম দাম)।

তারা প্রতিদিন এরকম ৫-১০টা অফার/বান্ডেল পোস্ট দেন, এবং যে কিনতে চায় সে যোগাযোগ করে। তারপর বিকাশ/রকেট বা অন্য যে কোনো ভাবে পেমেন্ট করে অর্ডার করলে বান্ডেল পাঠিয়ে দেয়া হয়।

দেখেই বোঝা যায়, এগুলো ম্যানেজ করা কঠিন। একটা দুইটা ঠিক আছে, কিন্তু একজন যদি ২০-৪০টা অর্ডার পায়, তাহলে দিন শেষে ম্যানেজ করা, হিসাব রাখা কঠিন হয়ে যাবেই।

তাই আমি এই প্রজেক্ট করলাম।

এখানে একজন বিক্রেতা সাইন আপ করবে। তারপর নিজের MFS / Bank এর তথ্য আপডেট করবে।

জিবি+মিনিট, দাম ও এক্সট্রা কিছু লেখার থাকলে লিখে প্যাক বানাবে।

তারপর নিজের লিংক শেয়ার করবে। (ইমেইল যদি হয় khalid2@gmail.com তাহলে তার লিংক হবে https://simpack.vercel.app/khalid2 । ঝামেলা কমাতে আরেক ধাপ – choose your username বানাইনি। ওটাও তো মোটেই কঠিন কিছু না।)

কাস্টমার ঐ লিংকে ভিজিট করলে শুধু প্যাকগুলো দেখতে পাবে, পছন্দের প্যাকের পাশে Order বাটনে ক্লিক করলে একটি ফর্ম আসবে, সেখানে সে কোন মোবাইল নম্বরে নিতে চায়, এবং কিভাবে পেমেন্ট করেছে তার তথ্য দিলে অ্যাডমিনের ড্যাশবোর্শে অর্ডার চলে যাবে। অ্যাডমিন সব কিছু ভ্যারিফাই করে (টাকা এসেছে কিনা দেখে) অর্ডারটি কমপ্লিট করবে।

<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
