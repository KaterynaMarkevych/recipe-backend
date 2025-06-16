import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AuthModal from "../Auth/AuthModal/AuthModal";
import styles from "./CommentSection.module.scss";

export default function CommentSection({ recipeId }) {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ стан повідомлення
  const triedToSubmitRef = useRef(false);
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/api/recipes/${recipeId}/comments`);
      setComments(res.data.comments);
    };
    fetchComments();
  }, [recipeId]);

  useEffect(() => {
    if (status === "authenticated" && triedToSubmitRef.current) {
      triedToSubmitRef.current = false;
      setShowAuthModal(false);
      handleSubmit(); // 🔁 публікація одразу після логіну
    }
  }, [status]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!session) {
      triedToSubmitRef.current = true;
      setShowAuthModal(true);
      return;
    }

    if (!comment.trim()) return;

    try {
      await axios.post(`/api/recipes/${recipeId}/addComment`, {
        text: comment,
      });

      setUsername(session.user.name); // збереження імені
      setComment("");
      setShowAlert(true); // показати alert

      const res = await axios.get(`/api/recipes/${recipeId}/comments`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Помилка публікації коментаря:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className="text-xl font-semibold mb-4">Коментарі</h2>

      {showAlert && (
        <div className="mb-4 p-4 border border-green-500 bg-green-100 text-green-800 rounded relative">
          ✅ Дякуємо, {username}! Ваш коментар опубліковано.
          <button
            onClick={() => setShowAlert(false)}
            className="absolute top-1 right-2 text-green-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Залишити коментар..."
          className={styles.textarea}
          rows={3}
        />
        <button type="submit" className={styles.submitButton}>
          Надіслати
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-2">
            <div className="flex items-center gap-2 mb-1">
              {c.user?.avatar && (
                <img
                  src={c.user.avatar}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-semibold">
                {c.user?.username || "Користувач"}
              </span>
            </div>
            <p>{c.text}</p>
            <small className="text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
