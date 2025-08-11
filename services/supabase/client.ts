import { createClient, processLock } from "@supabase/supabase-js";
import { ENV } from "../../config/env";

const isReactNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

let client;
if (isReactNative) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("react-native-url-polyfill/auto");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  client = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });
} else {
  client = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
}

export const supabase = client;
