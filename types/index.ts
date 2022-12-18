export {};

declare global {
    type Post = object & {
        link: string;
        heading: string;
        delHash: string;
        id: number;
      }
}