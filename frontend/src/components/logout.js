import { clearAuth } from "../utils/auth";

export const logout = (navigate) => {
  clearAuth();
  navigate("/login");
};
