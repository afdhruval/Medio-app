// Backend uses httpOnly cookie for the JWT token.
// We only store the public user object in localStorage for UI display.

export const saveUser   = (user) => localStorage.setItem("instaa_user", JSON.stringify(user));
export const getUser    = () => {
  try { return JSON.parse(localStorage.getItem("instaa_user")); }
  catch { return null; }
};
export const clearUser  = () => localStorage.removeItem("instaa_user");
export const isLoggedIn = () => !!getUser();
