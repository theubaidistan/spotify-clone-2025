// import { Song } from "@/types";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// const getSongsByUserId = async (): Promise<Song[]> => {
//   const cookieStore = await cookies();

//   const supabase = createServerComponentClient({
//     // cookies: cookies,
//     cookies: () => cookieStore,
//   });

//   const { data: sessionData, error: sessionError } =
//     await supabase.auth.getSession();

//   if (sessionError) {
//     console.log(sessionError.message);
//     return [];
//   }

//   const { data, error } = await supabase
//     .from("songs")
//     .select("*")
//     .eq("user_id", sessionData.session?.user.id)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error.message);
//   }

//   return (data as any) || [];
// };

// export default getSongsByUserId;

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  const cookieStore = cookies(); // ✅ synchronous

  const supabase = createServerComponentClient({
    cookies: () => Promise.resolve(cookieStore), // ✅ wrap in Promise
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return (data as Song[]) || [];
};

export default getSongsByUserId;
