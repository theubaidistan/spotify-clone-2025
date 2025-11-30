// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { headers, cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/libs/stripe";
// import { getURL } from "@/libs/helpers";
// import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// export async function POST(request: Request) {
//   const { price, quantity = 1, metadata = {} } = await request.json();

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

//     const customer = await createOrRetrieveCustomer({
//       uuid: user?.id || "",
//       email: user?.email || "",
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       billing_address_collection: "required",
//       customer,
//       line_items: [
//         {
//           price: price.id,
//           quantity,
//         },
//       ],
//       mode: "subscription",
//       allow_promotion_codes: true,
//       subscription_data: {
//         trial_from_plan: true,
//         metadata,
//       },
//       success_url: `${getURL()}/account`,
//       cancel_url: `${getURL()}`,
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (error: any) {
//     console.log(error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

////////////////////////////////////////////////

// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/libs/stripe";
// import { getURL } from "@/libs/helpers";
// import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// export async function POST(req: Request) {
//   const { price } = await req.json();

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

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       billing_address_collection: "required",
//       customer,
//       line_items: [{ price: price.id, quantity: 1 }],
//       mode: "subscription",
//       subscription_data: { trial_from_plan: true },
//       allow_promotion_codes: true,
//       success_url: `${getURL()}/account`,
//       cancel_url: `${getURL()}`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.log("Create checkout session error:", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

//*-----------------------------------------------------

// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/libs/stripe";
// import { getURL } from "@/libs/helpers";
// import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// export async function POST(req: Request) {
//   const { price } = await req.json();

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

//     // Full PAGE redirect checkout (hosted)
//     const session = await stripe.checkout.sessions.create({
//       customer,
//       mode: "subscription",
//       ui_mode: "hosted", // <── IMPORTANT (NOT embedded)
//       line_items: [{ price: price.id, quantity: 1 }],

//       billing_address_collection: "required",
//       allow_promotion_codes: true,

//       subscription_data: { trial_from_plan: true },

//       success_url: `${getURL()}/account?success=true`,
//       cancel_url: `${getURL()}/account?canceled=true`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.log("Create checkout session error:", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

//*---------------------------------------------------------------
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST(req: Request) {
  const { price } = await req.json();

  try {
    const cookieStore = cookies(); // ✅ correct

    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore), // ✅ correct
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email || "",
    });

    // Full PAGE redirect checkout (hosted)
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // make sure this is the ID, not full object
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: [{ price: price.id, quantity: 1 }],
      subscription_data: {
        // TS workaround: cast to any to allow trial_from_plan
        trial_from_plan: true as any,
      },
      success_url: `${getURL()}/account?success=true`,
      cancel_url: `${getURL()}/account?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
