// import { create } from "zustand";

// interface PlayerStore {
//   ids: string[];
//   activeId?: string;
//   setId: (id: string) => void;
//   setIds: (ids: string[]) => void;
//   reset: () => void;
// }

// const usePlayer = create<PlayerStore>((set) => ({
//   ids: [],
//   activeId: undefined,
//   setId: (id: string) => set({ activeId: id }),
//   setIds: (ids: string[]) => set({ ids: ids }),
//   reset: () => set({ ids: [], activeId: undefined }),
// }));

// export default usePlayer;

// *CHATGPT

// import { create } from "zustand";

// interface PlayerStore {
//   ids: string[];
//   activeId?: string;
//   isPlaying: boolean; // track if a song is playing
//   setPlaying: (state: boolean) => void; // update playing state
//   setId: (id: string) => void;
//   setIds: (ids: string[]) => void;
//   reset: () => void;
// }

// const usePlayer = create<PlayerStore>((set) => ({
//   ids: [],
//   activeId: undefined,
//   isPlaying: false, // initialize isPlaying
//   setPlaying: (state: boolean) => set({ isPlaying: state }), // implement setPlaying
//   setId: (id: string) => set({ activeId: id }),
//   setIds: (ids: string[]) => set({ ids }),
//   reset: () => set({ ids: [], activeId: undefined, isPlaying: false }),
// }));

// export default usePlayer;

// *CHATGT
// import { create } from "zustand";

// interface PlayerStore {
//   ids: string[];
//   activeId?: string;
//   isPlaying: boolean;
//   setId: (id: string) => void;
//   setIds: (ids: string[]) => void;
//   togglePlay: () => void;
//   reset: () => void;
//   audio?: HTMLAudioElement; // new
// }

// const usePlayer = create<PlayerStore>((set, get) => ({
//   ids: [],
//   activeId: undefined,
//   isPlaying: false,
//   audio: undefined,
//   setId: (id: string) => {
//     const songUrl = `/songs/${id}.mp3`; // adjust path to your audio file
//     if (!get().audio) {
//       const newAudio = new Audio(songUrl);
//       newAudio.play();
//       set({ audio: newAudio, activeId: id, isPlaying: true });
//     } else {
//       get().audio.pause();
//       get().audio.src = songUrl;
//       get().audio.play();
//       set({ activeId: id, isPlaying: true });
//     }
//   },
//   setIds: (ids: string[]) => set({ ids }),
//   togglePlay: () => {
//     const audio = get().audio;
//     if (!audio) return;
//     if (get().isPlaying) {
//       audio.pause();
//       set({ isPlaying: false });
//     } else {
//       audio.play();
//       set({ isPlaying: true });
//     }
//   },
//   reset: () => {
//     get().audio?.pause();
//     set({ ids: [], activeId: undefined, isPlaying: false, audio: undefined });
//   },
// }));

// export default usePlayer;

//----------------------------------------------
// import { create } from "zustand";

// interface PlayerStore {
//   ids: string[];
//   activeId?: string;
//   isPlaying: boolean;
//   setId: (id: string) => void;
//   setIds: (ids: string[]) => void;
//   togglePlay: () => void;
//   setPlaying: (state: boolean) => void; // ADD THIS
//   reset: () => void;
//   audio?: HTMLAudioElement;
// }

// const usePlayer = create<PlayerStore>((set, get) => ({
//   ids: [],
//   activeId: undefined,
//   isPlaying: false,
//   audio: undefined,

//   setId: (id: string) => {
//     const songUrl = `/songs/${id}.mp3`;

//     if (!get().audio) {
//       const newAudio = new Audio(songUrl);
//       newAudio.play();
//       set({ audio: newAudio, activeId: id, isPlaying: true });
//     } else {
//       get().audio.pause();
//       get().audio.src = songUrl;
//       get().audio.play();
//       set({ activeId: id, isPlaying: true });
//     }
//   },

//   setIds: (ids: string[]) => set({ ids }),

//   togglePlay: () => {
//     const audio = get().audio;
//     if (!audio) return;

//     if (get().isPlaying) {
//       audio.pause();
//       set({ isPlaying: false });
//     } else {
//       audio.play();
//       set({ isPlaying: true });
//     }
//   },

//   setPlaying: (state: boolean) => {
//     // NEW FUNCTION
//     const audio = get().audio;
//     if (!audio) return;

//     if (state) audio.play();
//     else audio.pause();

//     set({ isPlaying: state });
//   },

//   reset: () => {
//     get().audio?.pause();
//     set({
//       ids: [],
//       activeId: undefined,
//       isPlaying: false,
//       audio: undefined,
//     });
//   },
// }));

// export default usePlayer;

//*-------------------------------------------------------
// import { create } from "zustand";

// interface PlayerStore {
//   ids: string[];
//   activeId?: string;
//   activeIndex: number;
//   isPlaying: boolean;
//   setId: (id: string) => void;
//   setIds: (ids: string[]) => void;
//   togglePlay: () => void;
//   setPlaying: (state: boolean) => void;
//   next: () => void;
//   previous: () => void;
//   reset: () => void;
//   audio?: HTMLAudioElement;
// }

// const usePlayer = create<PlayerStore>((set, get) => ({
//   ids: [],
//   activeId: undefined,
//   activeIndex: -1,
//   isPlaying: false,
//   audio: undefined,

//   setIds: (ids) => set({ ids }),

//   setId: (id) => {
//     const index = get().ids.findIndex((songId) => songId === id);
//     const songUrl = `/songs/${id}.mp3`;

//     if (!get().audio) {
//       const newAudio = new Audio(songUrl);
//       newAudio.play();
//       set({
//         audio: newAudio,
//         activeId: id,
//         activeIndex: index,
//         isPlaying: true,
//       });
//     } else {
//       get().audio.pause();
//       get().audio.src = songUrl;
//       get().audio.play();
//       set({ activeId: id, activeIndex: index, isPlaying: true });
//     }
//   },

//   togglePlay: () => {
//     const audio = get().audio;
//     if (!audio) return;

//     if (get().isPlaying) {
//       audio.pause();
//       set({ isPlaying: false });
//     } else {
//       audio.play();
//       set({ isPlaying: true });
//     }
//   },

//   setPlaying: (state) => {
//     const audio = get().audio;
//     if (!audio) return;

//     if (state) audio.play();
//     else audio.pause();

//     set({ isPlaying: state });
//   },

//   next: () => {
//     const { ids, activeIndex } = get();
//     if (ids.length === 0) return;
//     const nextIndex = (activeIndex + 1) % ids.length;
//     const nextId = ids[nextIndex];
//     get().setId(nextId);
//   },

//   previous: () => {
//     const { ids, activeIndex } = get();
//     if (ids.length === 0) return;
//     const prevIndex = (activeIndex - 1 + ids.length) % ids.length;
//     const prevId = ids[prevIndex];
//     get().setId(prevId);
//   },

//   reset: () => {
//     get().audio?.pause();
//     set({
//       ids: [],
//       activeId: undefined,
//       activeIndex: -1,
//       isPlaying: false,
//       audio: undefined,
//     });
//   },
// }));

// export default usePlayer;

//*-------------------------------------------------
import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  activeIndex: number;
  isPlaying: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  togglePlay: () => void;
  setPlaying: (state: boolean) => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
  audio: HTMLAudioElement | null;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  activeIndex: -1,
  isPlaying: false,
  audio: null,

  setIds: (ids) => set({ ids }),

  setId: (id) => {
    const index = get().ids.findIndex((songId) => songId === id);
    const songUrl = `/songs/${id}.mp3`;
    const audio = get().audio;

    if (!audio) {
      const newAudio = new Audio(songUrl);
      newAudio.play();
      set({
        audio: newAudio,
        activeId: id,
        activeIndex: index,
        isPlaying: true,
      });
    } else {
      audio.pause();
      audio.src = songUrl;
      audio.play();
      set({ activeId: id, activeIndex: index, isPlaying: true });
    }
  },

  togglePlay: () => {
    const audio = get().audio;
    if (!audio) return;

    if (get().isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      audio.play();
      set({ isPlaying: true });
    }
  },

  setPlaying: (state) => {
    const audio = get().audio;
    if (!audio) return;

    if (state) audio.play();
    else audio.pause();

    set({ isPlaying: state });
  },

  next: () => {
    const { ids, activeIndex } = get();
    if (ids.length === 0) return;
    const nextIndex = (activeIndex + 1) % ids.length;
    const nextId = ids[nextIndex];
    get().setId(nextId);
  },

  previous: () => {
    const { ids, activeIndex } = get();
    if (ids.length === 0) return;
    const prevIndex = (activeIndex - 1 + ids.length) % ids.length;
    const prevId = ids[prevIndex];
    get().setId(prevId);
  },

  reset: () => {
    get().audio?.pause();
    set({
      ids: [],
      activeId: undefined,
      activeIndex: -1,
      isPlaying: false,
      audio: null,
    });
  },
}));

export default usePlayer;
