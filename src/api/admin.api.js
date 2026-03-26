import api from "./axios";

export async function getAdminProducts() {
  const { data } = await api.get("/products/admin/list");
  return data;
}

export async function createAdminProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateAdminProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteAdminProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function toggleUserBan(id) {
  const { data } = await api.put(`/users/${id}/ban`);
  return data;
}

export async function getUserOrders(id) {
  const { data } = await api.get(`/users/${id}/orders`);
  return data;
}

export async function getAnalyticsSummary() {
  const { data } = await api.get("/analytics/summary");
  return data;
}

export async function getAnalyticsRevenue() {
  const { data } = await api.get("/analytics/revenue");
  return data;
}

export async function getAnalyticsTopProducts() {
  const { data } = await api.get("/analytics/top-products");
  return data;
}

export async function getAnalyticsOrdersByStatus() {
  const { data } = await api.get("/analytics/orders-by-status");
  return data;
}

export async function getAnalyticsCategoryBreakdown() {
  const { data } = await api.get("/analytics/category-breakdown");
  return data;
}

export async function getCoupons() {
  const { data } = await api.get("/coupons");
  return data;
}

export async function createCoupon(payload) {
  const { data } = await api.post("/coupons", payload);
  return data;
}

export async function updateCoupon(id, payload) {
  const { data } = await api.put(`/coupons/${id}`, payload);
  return data;
}

export async function deleteCoupon(id) {
  const { data } = await api.delete(`/coupons/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function createCategory(payload) {
  const { data } = await api.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

export async function getShipments() {
  const { data } = await api.get("/shipping/shipments");
  return data;
}

export async function createShipment(payload) {
  const { data } = await api.post("/shipping/create-shipment", payload);
  return data;
}

export async function syncShipments() {
  const { data } = await api.post("/shipping/sync");
  return data;
}

export async function getReviews() {
  const { data } = await api.get("/reviews");
  return data;
}

export async function moderateReview(id, payload) {
  const { data } = await api.put(`/reviews/${id}/moderate`, payload);
  return data;
}

export async function deleteReview(id) {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
}
