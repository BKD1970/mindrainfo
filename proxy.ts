import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              request.cookies.set(name, value);
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  /*
   * IMPORTANT:
   * Keep this call immediately after creating the
   * Supabase server client.
   *
   * This verifies the current Auth user and keeps
   * the SSR session synchronized.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /*
   * Protect manager routes at the request level.
   *
   * The individual page also runs requireAdminRole()
   * to check the actual permission.
   */
  const protectedRoutes = [
    {
      path: "/admin/jobsmanager",
      role: "jobs",
    },
    {
      path: "/admin/articlesmanager",
      role: "articles",
    },
    {
      path: "/admin/shopmanager",
      role: "shop",
    },
    {
      path: "/admin/technologytopicsmanager",
      role: "technology",
    },
    {
      path: "/admin/ordersmanager",
      role: "orders",
    },
  ] as const;

  const protectedRoute = protectedRoutes.find(
    (route) =>
      pathname === route.path ||
      pathname.startsWith(`${route.path}/`)
  );

  /*
   * If someone is logged out and directly opens a
   * manager URL, send them to that manager's login.
   */
  if (protectedRoute && !user) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    loginUrl.searchParams.set(
      "role",
      protectedRoute.role
    );

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
