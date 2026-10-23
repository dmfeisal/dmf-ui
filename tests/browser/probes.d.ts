export {};
declare global {
  interface Window {
    __dmfNavigation: { identity: number; loads: number; swaps: number; old: HTMLElement[] };
  }
}
