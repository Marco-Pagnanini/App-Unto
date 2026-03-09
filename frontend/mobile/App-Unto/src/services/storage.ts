import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const storage = {
  get: (key: string): Promise<string | null> =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key),

  set: (key: string, value: string): Promise<void> =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value),

  delete: (key: string): Promise<void> =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key),


};

export default storage;
