// import { Song } from "@/types";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// const getSongs = async (): Promise<Song[]> => {
//   const cookieStore = await cookies();

//   const supabase = createServerComponentClient({
//     // cookies: cookies,
//     cookies: () => cookieStore,
//   });

//   const { data, error } = await supabase
//     .from("songs")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error);
//   }

//   return (data as any) || [];
// };

// export default getSongs;

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
  const cookieStore = cookies(); // ✅ remove await

  const supabase = createServerComponentClient({
    cookies: () => Promise.resolve(cookieStore), // ✅ wrap in Promise
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
  }

  return (data as Song[]) || [];
};

export default getSongs;
