import api from "./axios";

export async function fetchProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data;
}

export async function fetchProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data;
}
