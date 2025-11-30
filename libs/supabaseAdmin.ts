// import Stripe from "stripe";
// import { createClient } from "@supabase/supabase-js";

// import { Database } from "@/types_db";
// import { Price, Product } from "@/types";

// import { stripe } from "./stripe";
// import { toDateTime } from "./helpers";
// import { error } from "console";

// export const supabaseAdmin = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//   process.env.SUPABASE_SERVICE_ROLE_KEY || ""
// );

// const upsertProductRecord = async (product: Stripe.Product) => {
//   const productData: Product = {
//     id: product.id,
//     active: product.active,
//     name: product.name,
//     description: product.description ?? undefined,
//     image: product.images?.[0] ?? null,
//     metadata: product.metadata,
//   };

//   const { error } = await supabaseAdmin.from("products").upsert([productData]);

//   if (error) {
//     throw error;
//   }

//   console.log(`Product inserted/updated: ${product.id}`);
// };

// const upsertPriceRecord = async (price: Stripe.Price) => {
//   const priceData: Price = {
//     id: price.id,
//     product_id: typeof price.product === "string" ? price.product : "",
//     active: price.active,
//     currency: price.currency,
//     description: price.nickname ?? undefined,
//     type: price.type,
//     unit_amount: price.unit_amount ?? undefined,
//     interval: price.recurring?.interval,
//     interval_count: price.recurring?.interval_count,
//     trial_period_days: price.recurring?.trial_period_days,
//     metadata: price.metadata,
//   };

//   const { error } = await supabaseAdmin.from("prices").upsert([priceData]);

//   if (error) {
//     throw error;
//   }

//   console.log(`Price inserted/updated: ${price.id}`);
// };

// const createOrRetrieveCustomer = async ({
//   email,
//   uuid,
// }: {
//   email: string;
//   uuid: string;
// }) => {
//   const { data, error } = await supabaseAdmin
//     .from("customers")
//     .select("stripe_customer_id")
//     .eq("id", uuid)
//     .single();

//   if (error || !data?.stripe_customer_id) {
//     const customerData: { metadata: { supabaseUUID: string }; email?: string } =
//       {
//         metadata: {
//           supabaseUUID: uuid,
//         },
//       };

//     if (email) customerData.email = email;

//     const customer = await stripe.customers.create(customerData);
//     const { error: supabaseError } = await supabaseAdmin
//       .from("customers")
//       .insert([{ id: uuid, stripe_customer_id: customer.id }]);

//     if (supabaseError) {
//       throw supabaseError;
//     }

//     console.log(`New customer created and inserted for ${uuid}`);

//     return customer.id;
//   }
//   return data.stripe_customer_id;
// };

// const copyBillingDetailsToCustomer = async (
//   uuid: string,
//   payment_method: Stripe.PaymentMethod
// ) => {
//   const customer = payment_method.customer as string;
//   const { name, phone, address } = payment_method.billing_details;
//   if (!name || !phone || !address) return;

//   // @ts-ignore
//   await stripe.customers.update(customer, { name, phone, address });
//   const { error } = await supabaseAdmin
//     .from("users")
//     .update({
//       billing_address: { ...address },
//       payment_method: { ...payment_method[payment_method.type] },
//     })
//     .eq("id", uuid);

//   if (error) throw error;
// };

// const manageSubscriptionStatusChange = async (
//   subscriptionId: string,
//   customerId: string,
//   createAction = false
// ) => {
//   const { data: customerData, error: noCustomerError } = await supabaseAdmin
//     .from("customers")
//     .select("id")
//     .eq("stripe_customer_id", customerId)
//     .single();

//   if (noCustomerError) throw noCustomerError;

//   const { id: uuid } = customerData!;

//   const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
//     expand: ["default_payment_method"],
//   });

//   const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
//     {
//       id: subscription.id,
//       user_id: uuid,
//       metadata: subscription.metadata,

//       // @ts-ignore
//       status: subscription.status,
//       price_id: subscription.items.data[0].price.id,

//       // @ts-ignore
//       quantity: subscription.quantity,
//       cancel_at_period_end: subscription.cancel_at_period_end,
//       cancel_at: subscription.cancel_at
//         ? toDateTime(subscription.cancel_at).toISOString()
//         : null,
//       canceled_at: subscription.canceled_at
//         ? toDateTime(subscription.canceled_at).toISOString()
//         : null,
//       current_period_start: toDateTime(
//         subscription.current_period_start
//       ).toISOString(),
//       current_period_end: toDateTime(
//         subscription.current_period_end
//       ).toISOString(),
//       created: toDateTime(subscription.created).toISOString(),
//       ended_at: subscription.ended_at
//         ? toDateTime(subscription.ended_at).toISOString()
//         : null,
//       trial_start: subscription.trial_start
//         ? toDateTime(subscription.trial_start).toISOString()
//         : null,
//       trial_end: subscription.trial_end
//         ? toDateTime(subscription.trial_end).toISOString()
//         : null,
//     };

//   const { error } = await supabaseAdmin
//     .from("subscriptions")
//     .upsert([subscriptionData]);

//   if (error) throw error;

//   console.log(
//     `Inserted / Updated Subscription [${subscription.id} for ${uuid}]`
//   );

//   if (createAction && subscription.default_payment_method && uuid) {
//     await copyBillingDetailsToCustomer(
//       uuid,
//       subscription.default_payment_method as Stripe.PaymentMethod
//     );
//   }
// };

// export {
//   upsertPriceRecord,
//   upsertProductRecord,
//   createOrRetrieveCustomer,
//   manageSubscriptionStatusChange,
// };

// ///////////////////////////////////////////////

// import Stripe from "stripe";
// import { createClient } from "@supabase/supabase-js";
// import { Database } from "@/types_db";
// import { Price, Product } from "@/types";

// import { stripe } from "./stripe";
// import { toDateTime } from "./helpers";

// export const supabaseAdmin = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//   process.env.SUPABASE_SERVICE_ROLE_KEY || ""
// );

// const upsertProductRecord = async (product: Stripe.Product) => {
//   const productData: Product = {
//     id: product.id,
//     active: product.active,
//     name: product.name,
//     description: product.description ?? undefined,
//     image: product.images?.[0] ?? null,
//     metadata: product.metadata,
//   };

//   const { error } = await supabaseAdmin.from("products").upsert([productData]);
//   if (error) throw error;

//   console.log(`Product inserted/updated: ${product.id}`);
// };

// const upsertPriceRecord = async (price: Stripe.Price) => {
//   const priceData: Price = {
//     id: price.id,
//     product_id: typeof price.product === "string" ? price.product : "",
//     active: price.active,
//     currency: price.currency,
//     description: price.nickname ?? undefined,
//     type: price.type,
//     unit_amount: price.unit_amount ?? undefined,
//     interval: price.recurring?.interval,
//     interval_count: price.recurring?.interval_count,
//     trial_period_days: price.recurring?.trial_period_days,
//     metadata: price.metadata,
//   };

//   const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
//   if (error) throw error;

//   console.log(`Price inserted/updated: ${price.id}`);
// };

// const createOrRetrieveCustomer = async ({
//   email,
//   uuid,
// }: {
//   email: string;
//   uuid: string;
// }) => {
//   const { data, error } = await supabaseAdmin
//     .from("customers")
//     .select("stripe_customer_id")
//     .eq("id", uuid)
//     .single();

//   if (error || !data?.stripe_customer_id) {
//     const customer = await stripe.customers.create({
//       email,
//       metadata: { supabaseUUID: uuid },
//     });

//     const { error: supabaseError } = await supabaseAdmin
//       .from("customers")
//       .insert([{ id: uuid, stripe_customer_id: customer.id }]);

//     if (supabaseError) throw supabaseError;

//     console.log(`New customer created for ${uuid}`);
//     return customer.id;
//   }

//   return data.stripe_customer_id;
// };

// const copyBillingDetailsToCustomer = async (
//   uuid: string,
//   payment_method: Stripe.PaymentMethod
// ) => {
//   const customer = payment_method.customer as string;
//   const { name, phone, address } = payment_method.billing_details;

//   if (!name || !phone || !address) return;

//   await stripe.customers.update(customer, { name, phone, address });

//   const { error } = await supabaseAdmin
//     .from("users")
//     .update({
//       billing_address: { ...address },
//       payment_method: {
//         ...payment_method[payment_method.type ?? "card"],
//       },
//     })
//     .eq("id", uuid);

//   if (error) throw error;
// };

// const manageSubscriptionStatusChange = async (
//   subscriptionId: string,
//   customerId: string,
//   createAction = false
// ) => {
//   const { data: customerData, error: noCustomerError } = await supabaseAdmin
//     .from("customers")
//     .select("id")
//     .eq("stripe_customer_id", customerId)
//     .single();

//   if (noCustomerError) throw noCustomerError;

//   const uuid = customerData.id;

//   const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
//     expand: ["default_payment_method"],
//   });

//   // Use subscription.created as fallback if current_period_start/end is missing
//   const createdDate = subscription.created
//     ? toDateTime(subscription.created)
//     : new Date();
//   const fallbackStart = createdDate.toISOString();
//   const fallbackEnd = new Date(
//     createdDate.getTime() + 30 * 24 * 60 * 60 * 1000
//   ).toISOString();

//   const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
//     {
//       id: subscription.id,
//       user_id: uuid,
//       metadata: subscription.metadata,
//       status: subscription.status as any,
//       price_id: subscription.items.data[0].price.id,
//       quantity: subscription.items.data[0].quantity ?? 1,

//       cancel_at_period_end: subscription.cancel_at_period_end,
//       cancel_at: subscription.cancel_at
//         ? toDateTime(subscription.cancel_at)?.toISOString()
//         : null,
//       canceled_at: subscription.canceled_at
//         ? toDateTime(subscription.canceled_at)?.toISOString()
//         : null,

//       current_period_start: subscription.current_period_start
//         ? toDateTime(subscription.current_period_start)?.toISOString()
//         : fallbackStart,
//       current_period_end: subscription.current_period_end
//         ? toDateTime(subscription.current_period_end)?.toISOString()
//         : fallbackEnd,

//       created: subscription.created
//         ? toDateTime(subscription.created)?.toISOString()
//         : fallbackStart,
//       ended_at: subscription.ended_at
//         ? toDateTime(subscription.ended_at)?.toISOString()
//         : null,

//       trial_start: subscription.trial_start
//         ? toDateTime(subscription.trial_start)?.toISOString()
//         : null,
//       trial_end: subscription.trial_end
//         ? toDateTime(subscription.trial_end)?.toISOString()
//         : null,
//     };

//   const { error } = await supabaseAdmin
//     .from("subscriptions")
//     .upsert([subscriptionData]);

//   if (error) throw error;

//   console.log(`Updated subscription [${subscription.id}] for user ${uuid}`);

//   if (createAction && subscription.default_payment_method && uuid) {
//     await copyBillingDetailsToCustomer(
//       uuid,
//       subscription.default_payment_method as Stripe.PaymentMethod
//     );
//   }
// };

// export {
//   upsertPriceRecord,
//   upsertProductRecord,
//   createOrRetrieveCustomer,
//   manageSubscriptionStatusChange,
// };

//*----------------------------------------------------------

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Price, Product } from "@/types";

import { stripe } from "./stripe";
import { toDateTime } from "./helpers";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Upsert a product into Supabase
const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);
  if (error) throw error;

  console.log(`Product inserted/updated: ${product.id}`);
};

// Upsert a price into Supabase
const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw error;

  console.log(`Price inserted/updated: ${price.id}`);
};

// Create or retrieve a Stripe customer
const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  if (error || !data?.stripe_customer_id) {
    const customer = await stripe.customers.create({
      email,
      metadata: { supabaseUUID: uuid },
    });

    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);

    if (supabaseError) throw supabaseError;

    console.log(`New customer created for ${uuid}`);
    return customer.id;
  }

  return data.stripe_customer_id;
};

// Helper: sanitize Stripe address
const sanitizeAddress = (address: Stripe.Address) => ({
  line1: address.line1 ?? undefined,
  line2: address.line2 ?? undefined,
  city: address.city ?? undefined,
  state: address.state ?? undefined,
  postal_code: address.postal_code ?? undefined,
  country: address.country ?? undefined,
});

// Copy billing details from Stripe PaymentMethod to Supabase user & Stripe customer
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;

  if (!name && !phone && !address) return;

  // Update Stripe customer
  await stripe.customers.update(customer, {
    name: name ?? undefined,
    phone: phone ?? undefined,
    address: address ? sanitizeAddress(address) : undefined,
  });

  // Convert address to JSON-compatible object for Supabase
  const billingAddressJson = address
    ? (sanitizeAddress(address) as unknown as any)
    : null;

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: billingAddressJson,
      payment_method: payment_method[payment_method.type ?? "card"] ?? null,
    })
    .eq("id", uuid);

  if (error) throw error;
};

// Manage subscription status change
const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get Supabase customer UUID
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError) throw noCustomerError;
  const uuid = customerData.id;

  // Retrieve Stripe subscription
  const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
    subscriptionId,
    { expand: ["default_payment_method"] }
  );

  // Safe fallback dates
  const createdDate = toDateTime(subscription.created) ?? new Date();
  const fallbackStart = createdDate.toISOString();
  const fallbackEnd = new Date(
    createdDate.getTime() + 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status as any,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity ?? 1,

      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: toDateTime(subscription.cancel_at)?.toISOString() ?? null,
      canceled_at: toDateTime(subscription.canceled_at)?.toISOString() ?? null,

      current_period_start:
        toDateTime(subscription.current_period_start)?.toISOString() ??
        fallbackStart,
      current_period_end:
        toDateTime(subscription.current_period_end)?.toISOString() ??
        fallbackEnd,

      created: toDateTime(subscription.created)?.toISOString() ?? fallbackStart,
      ended_at: toDateTime(subscription.ended_at)?.toISOString() ?? null,

      trial_start: toDateTime(subscription.trial_start)?.toISOString() ?? null,
      trial_end: toDateTime(subscription.trial_end)?.toISOString() ?? null,
    };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (error) throw error;

  console.log(`Updated subscription [${subscription.id}] for user ${uuid}`);

  // Optionally copy billing details
  if (createAction && subscription.default_payment_method && uuid) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
};

export {
  upsertPriceRecord,
  upsertProductRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
