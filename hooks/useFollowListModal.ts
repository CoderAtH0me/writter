import { create } from "zustand";

interface FollowListModalStore {
  isOpen: boolean;
  listType: "followers" | "following" | null;
  onOpen: (listType: "followers" | "following") => void;
  onClose: () => void;
}

const useFollowListModal = create<FollowListModalStore>((set) => ({
  isOpen: false,
  listType: null,
  onOpen: (listType) => set({ isOpen: true, listType }),
  onClose: () => set({ isOpen: false, listType: null }),
}));

export default useFollowListModal;
