// import { ProductWithPrice } from "@/types";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
//   const cookieStore = await cookies();

//   const supabase = createServerComponentClient({
//     // cookies: cookies,
//     cookies: () => cookieStore,
//   });

//   const { data, error } = await supabase
//     .from("products")
//     .select("*,prices(*)")
//     .eq("active", true)
//     .eq("prices.active", true)
//     .order("metadata->index")
//     .order("unit_amount", { foreignTable: "prices" });

//   if (error) {
//     console.log(error);
//   }

//   return (data as any) || [];
// };

// export default getActiveProductsWithPrices;

import { ProductWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const supabase = createServerComponentClient({
    cookies, // pass the cookies function directly
  });

  const { data, error } = await supabase
    .from("products")
    .select("*,prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};

export default getActiveProductsWithPrices;
