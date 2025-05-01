export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "user_avatar");
  formData.append("folder", "users/avatars");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dz1kvzidt/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Помилка завантаження зображення");
  }

  const data = await response.json();
  return data.secure_url;
};
