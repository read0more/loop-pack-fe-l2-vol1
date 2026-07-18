import { create } from "zustand";
import { toggleInSet } from "@/utils";

type CommerceState = {
  cartIds: Set<string>;
  wishlistIds: Set<string>;
  toggleCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
};

export const useCommerceStore = create<CommerceState>((set) => ({
  cartIds: new Set(),
  wishlistIds: new Set(),
  toggleCart: (productId) =>
    set((state) => ({ cartIds: toggleInSet(state.cartIds, productId) })),
  toggleWishlist: (productId) =>
    set((state) => ({
      wishlistIds: toggleInSet(state.wishlistIds, productId),
    })),
}));
