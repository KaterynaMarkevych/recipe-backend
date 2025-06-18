"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";
import AddRecipeModal from "@/components/AddRecipeModal/AddRecipeModal";
import Wrapper from "@/components/shared/Wrapper/Wrapper";

export default function EditRecipePage(props) {
  const params = use(props.params);
  const id = params.id;

  const [initialRecipe, setInitialRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        setInitialRecipe(response.data);
      } catch (err) {
        setError("Не вдалося завантажити рецепт");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async (updatedRecipe) => {
    try {
      if (!params.id) {
        console.error("ID не передано у params");
        alert("Помилка: ID рецепта не передано");
        return;
      }
      await axios.put(`/api/recipes/${params.id}`, updatedRecipe);
      alert("Рецепт оновлено!");
      window.location.href = `/recipes/${params.id}`;
    } catch (err) {
      console.error("Помилка оновлення:", err);
      alert("Не вдалося оновити рецепт.");
    }
  };
  console.log("EditRecipePage params:", params);
  if (loading) return <p>Завантаження рецепта...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Wrapper>
      <AddRecipeModal
        initialData={initialRecipe}
        onSubmit={handleUpdate}
        isEditMode={true}
        id={id}
      />
    </Wrapper>
  );
}
