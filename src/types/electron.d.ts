// import type { Material } from "./material";
export {};

declare global {
  interface Window {
    electronAPI: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      saveMaterials: (materials: any[]) => Promise<boolean>;
    };
  }
}
