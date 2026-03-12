import { getStoredUser } from "./auth";

const getUserScope = () => {
  const user = getStoredUser();
  return user?.id || user?._id || user?.email || "anonymous";
};

export const getScopedKey = (baseKey) => `${baseKey}:${getUserScope()}`;

export const getScopedNumber = (baseKey) => {
  const raw = localStorage.getItem(getScopedKey(baseKey));
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const setScopedNumber = (baseKey, value) => {
  localStorage.setItem(getScopedKey(baseKey), String(value));
};

export const getScopedJSON = (baseKey, fallback) => {
  try {
    const raw = localStorage.getItem(getScopedKey(baseKey));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const setScopedJSON = (baseKey, value) => {
  localStorage.setItem(getScopedKey(baseKey), JSON.stringify(value));
};

export const removeScoped = (baseKey) => {
  localStorage.removeItem(getScopedKey(baseKey));
};
