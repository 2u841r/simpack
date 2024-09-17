import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      }
    );

    // Get user information from Supabase
    const { data: { user }, error } = await supabase.auth.getUser();

    // If the user is not logged in and trying to access protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If the user is logged in and on the root page, redirect them
    if (request.nextUrl.pathname === "/" && !error && user) {
      const username = user.email.split("@")[0]; // Extract the username from the email
      return NextResponse.redirect(new URL(`/${username}`, request.url)); // Redirect to /username instead of /email
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
