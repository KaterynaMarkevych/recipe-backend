import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція для отримання URL з Cloudinary
export const getImageUrl = (publicId) => {
  try {
    const url = cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: "fill",
    });
    return url;
  } catch (error) {
    console.error("Error generating image URL:", error);
    throw error;
  }
};
