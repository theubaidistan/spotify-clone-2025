// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/libs/stripe";
// import { getURL } from "@/libs/helpers";
// import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// export async function POST() {
//   try {
//     // const supabase = createRouteHandlerClient({
//     //   cookies,
//     // });

//     // 🔥 FIX — unwrap cookies()
//     const cookieStore = await cookies();

//     const supabase = createRouteHandlerClient({
//       cookies: () => cookieStore,
//     });

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) throw new Error("Could not get user");

//     const customer = await createOrRetrieveCustomer({
//       uuid: user.id || "",
//       email: user.email || "",
//     });

//     if (!customer) throw new Error("Could not get customer");

//     const { url } = await stripe.billingPortal.sessions.create({
//       customer,
//       return_url: `${getURL()}/account`,
//     });

//     return NextResponse.json({ url });
//   } catch (error: any) {
//     console.log(error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

//*------------------------------------------------

// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/libs/stripe";
// import { getURL } from "@/libs/helpers";
// import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// export async function POST() {
//   try {
//     const cookieStore = await cookies();

//     const supabase = createRouteHandlerClient({
//       cookies: () => cookieStore,
//     });

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) throw new Error("User not found");

//     const customer = await createOrRetrieveCustomer({
//       uuid: user.id,
//       email: user.email || "",
//     });

//     if (!customer) throw new Error("Customer not found");

//     const session = await stripe.billingPortal.sessions.create({
//       customer,
//       return_url: `${getURL()}/account`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.log("Customer portal error:", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

//*------------------------------------------------------

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  try {
    const cookieStore = cookies(); // ✅ remove await

    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore), // ✅ wrap in Promise
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email || "",
    });

    if (!customer) throw new Error("Customer not found");

    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Customer portal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
