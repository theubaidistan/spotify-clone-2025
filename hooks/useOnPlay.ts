// import { Song } from "@/types";
// import usePlayer from "./usePlayer";
// import useAuthModal from "./useAuthModal";
// import { useUser } from "./useUser";

// const useOnPlay = (songs: Song[]) => {
//   const player = usePlayer();
//   const authModal = useAuthModal();
//   const { user } = useUser();

//   const onPlay = (id: string) => {
//     if (!user) {
//       return authModal.onOpen();
//     }

//     player.setId(id);
//     player.setIds(songs.map((song) => song.id));
//   };

//   return onPlay;
// };

// export default useOnPlay;

//* --------------------------------------------------

// import { Song } from "@/types";
// import usePlayer from "./usePlayer";
// import useAuthModal from "./useAuthModal";
// import { useUser } from "./useUser";

// const useOnPlay = (songs: Song[]) => {
//   const player = usePlayer();
//   const authModal = useAuthModal();
//   const { user } = useUser();

//   const onPlay = (id: string) => {
//     if (!user) {
//       return authModal.onOpen();
//     }

//     // set the playlist
//     player.setIds(songs.map((song) => song.id));
//     // set the current song & play
//     player.setId(id);
//   };

//   return onPlay;
// };

// export default useOnPlay;

//*-----------------------------------------------------
import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
  const subscribeModel = useSubscribeModal();
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user, subscription } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModel.onOpen();
    }

    // set the playlist
    player.setIds(songs.map((song) => song.id));
    // play selected song
    player.setId(id);
  };

  return onPlay;
};

export default useOnPlay;
