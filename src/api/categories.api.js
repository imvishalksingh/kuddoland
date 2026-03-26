import api from "./axios";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data;
}
