import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDataStore = create(
  persist(
    (set) => ({
      data: null,
      setData: (value) => set({ data: value }),
    }),
    {
      name: "data-storage",
    }
  )
);

export default useDataStore;