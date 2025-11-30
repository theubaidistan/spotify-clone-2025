// "use client";

// import { Price, ProductWithPrice } from "@/types";
// import Modal from "./Modal";
// import Button from "./Button";
// import { useState } from "react";
// import { useUser } from "@/hooks/useUser";
// import toast from "react-hot-toast";
// import { postData } from "@/libs/helpers";
// import { getStripe } from "@/libs/stripeClient";
// import useSubscribeModal from "@/hooks/useSubscribeModal";

// interface SubscribeModalProps {
//   products: ProductWithPrice[];
// }

// const formatPrice = (price: Price) => {
//   const priceString = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: price.currency,
//     minimumFractionDigits: 0,
//   }).format((price?.unit_amount || 0) / 100);

//   return priceString;
// };

// const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
//   const subscribeModal = useSubscribeModal();
//   const { user, isLoading, subscription } = useUser();
//   const [priceIdLoading, setPriceIdLoading] = useState<string>();

//   const onChange = (open: boolean) => {
//     if (!open) {
//       subscribeModal.onClose();
//     }
//   };

//   const handleCheckout = async (price: Price) => {
//     setPriceIdLoading(price.id);

//     if (!user) {
//       setPriceIdLoading(undefined);
//       return toast.error("Must be logged in");
//     }

//     if (subscription) {
//       setPriceIdLoading(undefined);
//       return toast("Already subscribed");
//     }

//     try {
//       const { sessionId } = await postData({
//         url: "/api/create-checkout-session",
//         data: { price },
//       });

//       const stripe = await getStripe();
//       stripe?.redirectToCheckout({ sessionId });
//     } catch (error) {
//       toast.error((error as Error)?.message);
//     } finally {
//       setPriceIdLoading(undefined);
//     }
//   };

//   let content = <div className="text-center">No products available.</div>;

//   if (products.length) {
//     content = (
//       <div>
//         {products.map((product) => {
//           if (!product.prices?.length) {
//             return <div key={product.id}>No Prices available.</div>;
//           }

//           return product.prices.map((price) => (
//             <Button
//               key={price.id}
//               onClick={() => handleCheckout(price)}
//               disabled={isLoading || price.id === priceIdLoading}
//               className="mb-4"
//             >{`Subscribe for ${formatPrice(price)} a ${
//               price.interval
//             }`}</Button>
//           ));
//         })}
//       </div>
//     );
//   }

//   if (subscription) {
//     content = <div className="text-center">Already subscribed</div>;
//   }

//   return (
//     <Modal
//       title="Only for premium users"
//       description="Listen to music with Spotify Premium"
//       isOpen={subscribeModal.isOpen}
//       onChange={onChange}
//     >
//       {content}
//     </Modal>
//   );
// };

// export default SubscribeModal;

//* ////////////////////////////////////////////

// "use client";

// import { Price, ProductWithPrice } from "@/types";
// import Modal from "./Modal";
// import Button from "./Button";
// import { useState } from "react";
// import { useUser } from "@/hooks/useUser";
// import toast from "react-hot-toast";
// import useSubscribeModal from "@/hooks/useSubscribeModal";

// interface SubscribeModalProps {
//   products: ProductWithPrice[];
// }

// const formatPrice = (price: Price) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: price.currency,
//     minimumFractionDigits: 0,
//   }).format((price?.unit_amount || 0) / 100);

// const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
//   const { user, isLoading, subscription } = useUser();
//   const { isOpen, onClose } = useSubscribeModal();
//   const [priceIdLoading, setPriceIdLoading] = useState<string>();

//   const handleCheckout = async (price: Price) => {
//     setPriceIdLoading(price.id);

//     if (!user) {
//       setPriceIdLoading(undefined);
//       return toast.error("Must be logged in");
//     }

//     if (subscription) {
//       setPriceIdLoading(undefined);
//       return toast("Already subscribed");
//     }

//     try {
//       const res = await fetch("/api/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ price }),
//       });

//       const { url } = await res.json();

//       if (!url) throw new Error("Checkout URL not returned");

//       window.location.href = url;
//     } catch (error: any) {
//       toast.error(error.message || "Checkout failed");
//     } finally {
//       setPriceIdLoading(undefined);
//     }
//   };

//   return (
//     <Modal
//       title="Only for premium users"
//       description="Listen to music with Spotify Premium"
//       isOpen
//       onChange={onClose}
//     >
//       {subscription && (
//         <div className="text-center mb-4">Already subscribed</div>
//       )}

//       {products.length ? (
//         <div>
//           {products.map((product) =>
//             product.prices?.length ? (
//               product.prices.map((price) => (
//                 <Button
//                   key={price.id}
//                   onClick={() => handleCheckout(price)}
//                   disabled={isLoading || price.id === priceIdLoading}
//                   className="mb-4"
//                 >
//                   {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
//                 </Button>
//               ))
//             ) : (
//               <div key={product.id}>No Prices available.</div>
//             )
//           )}
//         </div>
//       ) : (
//         <div className="text-center">No products available.</div>
//       )}
//     </Modal>
//   );
// };

// export default SubscribeModal;

//*---------------------------------------------------

"use client";

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) subscribeModal.onClose();
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already subscribed");
    }

    try {
      const { url } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      // 🔥 Redirect to Stripe Checkout page
      window.location.href = url;
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content = <div className="text-center">No products available.</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) =>
          product.prices?.length ? (
            product.prices.map((price) => (
              <Button
                key={price.id}
                onClick={() => handleCheckout(price)}
                disabled={isLoading || price.id === priceIdLoading}
                className="mb-4"
              >
                {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
              </Button>
            ))
          ) : (
            <div key={product.id}>No Prices available.</div>
          )
        )}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
