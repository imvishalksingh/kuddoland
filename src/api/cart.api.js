import api from "./axios";

export async function getCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function addCartItem(payload) {
  const { data } = await api.post("/cart/add", payload);
  return data;
}

export async function updateCartItem(productId, payload) {
  const { data } = await api.put(`/cart/item/${productId}`, payload);
  return data;
}

export async function deleteCartItem(productId) {
  const { data } = await api.delete(`/cart/item/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete("/cart/clear");
  return data;
}
