import api from "./axios";

export async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/users/profile", payload);
  return data;
}

export async function getAddresses() {
  const { data } = await api.get("/users/addresses");
  return data;
}

export async function addAddress(payload) {
  const { data } = await api.post("/users/addresses", payload);
  return data;
}

export async function getWishlist() {
  const { data } = await api.get("/users/wishlist");
  return data;
}

export async function addWishlistItem(productId) {
  const { data } = await api.post(`/users/wishlist/${productId}`);
  return data;
}

export async function removeWishlistItem(productId) {
  const { data } = await api.delete(`/users/wishlist/${productId}`);
  return data;
}
