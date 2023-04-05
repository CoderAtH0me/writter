import { create } from "zustand";

interface FollowListModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFollowListModal = create<FollowListModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFollowListModal;
