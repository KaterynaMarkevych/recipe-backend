import { useState } from "react";
import { uploadToCloudinary } from "@/scripts/uploadToCloudinary";
import styles from "./EditProfileModal.module.scss";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let avatarUrl = user.avatar;

    try {
      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const res = await fetch("/api/profile/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          avatar: avatarUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Помилка оновлення профілю");
      }

      const updatedUser = await res.json();
      onSave(updatedUser);
    } catch (error) {
      console.error("Помилка при збереженні профілю:", error);
      alert("Не вдалося оновити профіль. Спробуйте ще раз.");
    }
  };
  //avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Редагування профілю</h2>
            <label htmlFor="avatar" className={styles.label}>
              Аватар:
            </label>
            <div className={styles.previewContainer}>
              {avatarPreview ? (
                <div className={styles.avatarPreview}>
                  <img
                    value={avatar}
                    src={avatarPreview}
                    alt="Avatar preview"
                    className={styles.avatarImage}
                  />
                </div>
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span className={styles.placeholderText}>No image</span>
                </div>
              )}

              <label
                htmlFor="avatar"
                className={styles.chooseFileButton}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("avatar").click();
                  }
                }}
              >
                Обрати файл
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleAvatarChange}
                  aria-label="Завантажити аватар"
                />
              </label>
            </div>

            <label className={styles.label}>Ім'я:</label>
            <input
              type="text"
              value={username}
              className={styles.input}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className={styles.label}>Про себе: </label>
            <textarea
              value={bio}
              className={styles.textarea}
              onChange={(e) => setBio(e.target.value)}
            />

            <button type="submit" className={styles.button}>
              Зберегти
            </button>
            <button
              type="button"
              className={styles.backButton}
              onClick={onClose}
            >
              Скасувати
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
