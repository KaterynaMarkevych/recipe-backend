"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/scripts/uploadToCloudinary";
import Button from "../shared/Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./AddRecipeModal.module.scss";

const units = [
  "г",
  "кг",
  "мл",
  "л",
  "ч.л.",
  "ст.л.",
  "скл.",
  "шт",
  "пучок",
  "зубчик",
  "дрібка",
  "упаковка",
  "скибка",
];
const type = [
  "Сніданок",
  "Обід",
  "Перекус",
  "Вечеря",
  "Напої",
  "Салати та закуски",
  "Супи",
  "Основні страви",
  "Десерти",
];

const cuisine = [
  "Французька",
  "Італійська",
  "Грецька",
  "Середземноморська",
  "Українська",
  "Китайська",
  "Японська",
  "Індійська",
  "Корейська",
  "Тайська",
  "Мексиканська",
  "Американська",
  "Бразильська",
  "Турецька",
  "Арабська",
  "Ізраїльська",
  "Африканська",
  "Ефіопська",
];
export default function AddRecipeModal() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    ingredients: [{ quantity: "", unit: "", name: "" }],
    steps: [""],
    type: "",
    cuisine: "",
    diet: [],
    cookingTime: "",
    difficulty: "",
    nutrition: { calories: "", protein: "", fats: "", carbs: "" },
    servings: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nutrition.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nutrition: { ...prev.nutrition, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, field, index) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleDietChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      diet: checked
        ? [...prev.diet, value]
        : prev.diet.filter((d) => d !== value),
    }));
  };

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      ingredients,
      steps,
      cookingTime,
      difficulty,
      nutrition,
      servings,
    } = formData;

    const areIngredientsValid = ingredients.every(
      (ing) => ing.quantity && ing.unit && ing.name
    );
    const areStepsValid = steps.every((step) => step.trim() !== "");
    const isNutritionValid =
      nutrition.calories &&
      nutrition.protein &&
      nutrition.fats &&
      nutrition.carbs;

    if (
      !title ||
      !areIngredientsValid ||
      !areStepsValid ||
      !cookingTime ||
      !difficulty ||
      !isNutritionValid ||
      !servings
    ) {
      alert("Будь ласка, заповніть усі обов'язкові поля.");
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const recipeData = {
        ...formData,
        image: imageUrl, //Додаємо посилання на зображення
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      console.log(recipeData);

      if (res.ok) {
        alert("Рецепт успішно додано!");
        // Очистити форму або перенаправити
      } else {
        const data = await res.json();
        alert("Помилка: " + data.message);
      }
    } catch (error) {
      console.error("Помилка при надсиланні рецепта:", error);
      alert("Щось пішло не так. Спробуйте ще раз.");
    }
  };

  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { quantity: "", unit: "", name: "" }],
    }));
  };

  const handleIngredientChange = (e, index, field) => {
    const value = e.target.value;
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleRemoveField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Додати рецепт</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Назва"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          required
        />

        {imagePreview ? (
          <div className={styles.imagePreview}>
            <img
              src={imagePreview}
              alt="Image preview"
              className={styles.imageImage}
            />
          </div>
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderText}>No image</span>
          </div>
        )}
        <label
          htmlFor="image"
          className={styles.chooseFileButton}
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("image").click();
            }
          }}
        >
          Обрати файл
          <input
            id="image"
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleImageChange}
            aria-label="Завантажити зображення"
          />
        </label>

        <textarea
          name="description"
          placeholder="Опис"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
        />

        <div>
          <label className="font-medium">Інгредієнти</label>
          {formData.ingredients.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:flex-nowrap items-start sm:items-center gap-2 mb-2"
            >
              <input
                type="text"
                value={item.quantity}
                onChange={(e) => handleIngredientChange(e, i, "quantity")}
                placeholder="Кількість"
                className={styles.input}
                required
              />
              <select
                value={item.unit}
                onChange={(e) => handleIngredientChange(e, i, "unit")}
                className={styles.input}
                required
              >
                <option value="">Одиниця</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleIngredientChange(e, i, "name")}
                placeholder="Назва інгредієнта"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveField("ingredients", i)}
                title="Видалити"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddIngredient()}
            className="btn"
          >
            + Додати інгредієнт
          </button>
        </div>

        <div>
          <label className="font-medium mt-4">
            Покрокова інструкція з приготування
          </label>
          {formData.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="w-5 text-right">{i + 1}.</span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleArrayChange(e, "steps", i)}
                className={styles.input}
                placeholder={`Крок ${i + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveField("steps", i)}
                title="Видалити"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("steps")}
            className="btn"
          >
            + Додати крок
          </button>
        </div>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Тип страви</option>
          {type.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">Кухня</option>
          {cuisine.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        <div className={styles.checkboxGroup}>
          <label className={styles.label}>Дієта</label>
          {["Веганська", "Вегетеріанська", "Безглютенова", "Безлактозна"].map(
            (d) => (
              <label key={d} className="block">
                <input
                  type="checkbox"
                  value={d}
                  checked={formData.diet.includes(d)}
                  onChange={handleDietChange}
                />{" "}
                {d}
              </label>
            )
          )}
        </div>

        <input
          type="number"
          name="cookingTime"
          placeholder="Час приготування (хв)"
          value={formData.cookingTime}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Складність</option>
          <option value="Легко">Легко</option>
          <option value="Середньо">Середньо</option>
          <option value="Складно">Складно</option>
        </select>

        <input
          type="number"
          name="servings"
          placeholder="Кількість порцій"
          value={formData.servings}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="nutrition.calories"
            placeholder="Калорії"
            value={formData.nutrition.calories}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="number"
            name="nutrition.protein"
            placeholder="Білки"
            value={formData.nutrition.protein}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="number"
            name="nutrition.fats"
            placeholder="Жири"
            value={formData.nutrition.fats}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="number"
            name="nutrition.carbs"
            placeholder="Вуглеводи"
            value={formData.nutrition.carbs}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div>
          <Button>Зберегти рецепт</Button>
          <Button type="submit">Опублікувати рецепт</Button>
        </div>
      </form>
    </div>
  );
}
