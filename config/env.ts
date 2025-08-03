// config/env.ts
export const ENV = {
  FRIENDLI_API_URL: "https://api.friendli.ai/dedicated/v1/chat/completions",
  FRIENDLI_API_TOKEN:
    process.env.EXPO_PUBLIC_FRIENDLI_TOKEN ??
    "flp_B3vBnMrxXHF07gf6iYnZYYrViImirVZKYibW0HC9c5283c",
};
