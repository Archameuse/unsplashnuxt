export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_KEY: string;
      DB_ID: string;
      DB_RANGE: string;
      IMGUR_ID: string;
    }
  }
}