import api from "./axios";

export async function uploadAdminImage(file, target = "product") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("target", target);

  const { data } = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
