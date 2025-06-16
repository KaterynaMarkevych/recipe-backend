import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ICONS } from "@/constants/icons";

export default function SaveRecipeButton({ recipeId }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!session) return;
      try {
        const res = await axios.get("/api/profile/getSavedRecipes");
        setIsSaved(res.data.savedRecipeIds.includes(recipeId));
      } catch (error) {
        console.error("Помилка при перевірці збережених рецептів:", error);
      }
    };

    fetchSavedStatus();
  }, [session, recipeId]);

  const toggleSave = async () => {
    if (!session) return alert("Увійдіть в акаунт, щоб зберігати рецепти");

    try {
      const res = await axios.post("/api/profile/toggleSavedRecipe", {
        recipeId,
      });
      setIsSaved(res.data.saved);
    } catch (error) {
      console.error("Помилка при збереженні рецепта:", error);
    }
  };

  return (
    <button onClick={toggleSave}>
      {isSaved ? (
        <img
          src={ICONS.saved}
          alt="Saved mark"
          className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
        />
      ) : (
        <img
          src={ICONS.save}
          alt="Save mark"
          className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
        />
      )}
    </button>
  );
}
