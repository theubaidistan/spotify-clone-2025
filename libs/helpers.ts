// import { Price } from "@/types";

// export const getURL = () => {
//   let url =
//     process.env.NEXT_PUBLIC_SITE_URL ??
//     process.env.NEXT_PUBLIC_VERCEL_URL ??
//     "http://localhost:3000/";

//   url = url.includes("http") ? url : `https://${url}`;
//   url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

//   return url;
// };

// export const postData = async ({
//   url,
//   data,
// }: {
//   url: string;
//   data?: { price: Price };
// }) => {
//   console.log("POST REQUEST: ", url, data);

//   const res: Response = await fetch(url, {
//     method: "POST",
//     headers: new Headers({ "Content-Type": "application/json" }),
//     credentials: "same-origin",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     console.log("Error in POST", { url, data, res });

//     throw new Error(res.statusText);
//   }

//   return res.json();
// };

// export const toDateTime = (secs: number) => {
//   const t = new Date('1970-01-01T00:30"00Z');
//   t.setSeconds(secs);
//   return t;
// };

//*-------------------------------------------------------

// import { Price } from "@/types";

// export const getURL = () => {
//   let url =
//     process.env.NEXT_PUBLIC_SITE_URL ??
//     process.env.NEXT_PUBLIC_VERCEL_URL ??
//     "http://localhost:3000/";

//   url = url.includes("http") ? url : `https://${url}`;
//   url = url.endsWith("/") ? url : `${url}/`;

//   return url;
// };

// export const postData = async ({
//   url,
//   data,
// }: {
//   url: string;
//   data?: { price: Price };
// }) => {
//   console.log("POST REQUEST: ", url, data);

//   const res: Response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "same-origin",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     console.log("Error in POST", { url, data, res });
//     throw new Error(res.statusText);
//   }

//   return res.json();
// };

// // ✅ FINAL FIXED FUNCTION
// export const toDateTime = (secs: number | null) => {
//   if (!secs || Number.isNaN(secs)) return null;
//   return new Date(secs * 1000);
// };

//*-------------------------------------------------------

import { Price } from "@/types";

// Get the correct site URL
export const getURL = (): string => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";

  url = url.includes("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};

// Post data to an endpoint safely
export const postData = async <T = unknown>({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}): Promise<T> => {
  console.log("POST REQUEST: ", url, data);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Error in POST", { url, data, status: res.status });
    throw new Error(res.statusText);
  }

  return res.json() as Promise<T>;
};

// Convert seconds (from Stripe timestamps) to JS Date safely
export const toDateTime = (secs: unknown): Date | null => {
  if (typeof secs === "number" && !Number.isNaN(secs)) {
    return new Date(secs * 1000);
  }
  if (typeof secs === "string" && !Number.isNaN(Number(secs))) {
    return new Date(Number(secs) * 1000);
  }
  return null;
};
