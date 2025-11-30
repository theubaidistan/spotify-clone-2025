// import { Song } from "@/types";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import getSongs from "./getSongs";

// const getSongsByTitle = async (title: string): Promise<Song[]> => {
//   const cookieStore = await cookies();

//   const supabase = createServerComponentClient({
//     // cookies: cookies,
//     cookies: () => cookieStore,
//   });

//   if (!title) {
//     const allSongs = await getSongs();
//     return allSongs;
//   }

//   const { data, error } = await supabase
//     .from("songs")
//     .select("*")
//     .ilike("title", `%${title}%`)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error);
//   }

//   return (data as any) || [];
// };

// export default getSongsByTitle;

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const cookieStore = cookies(); // ✅ synchronous

  const supabase = createServerComponentClient({
    cookies: () => Promise.resolve(cookieStore), // ✅ wrap in Promise
  });

  if (!title) {
    return await getSongs();
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) throw error; // ✅ better error handling

  return (data as Song[]) || [];
};

export default getSongsByTitle;
