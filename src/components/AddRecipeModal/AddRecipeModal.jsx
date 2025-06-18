"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
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
export default function AddRecipeModal({
  initialData = null,
  onSubmit,
  isEditMode = false,
  id,
}) {
  console.log("id in AddRecipeModal:", id);
  const { data: session } = useSession();
  const [formData, setFormData] = useState(() =>
    initialData
      ? { ...initialData, author: initialData.author || session?.user?.id }
      : {
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
          author: session?.user?.id,
        }
  );

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

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setSuccessMessage("");
    setLoading(true);

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

    if (formData.ingredients.length === 0) {
      alert("Будь ласка, додайте хоча б один інгредієнт.");
      return;
    }

    if (formData.steps.length === 0) {
      alert("Будь ласка, додайте хоча б один крок приготування.");
      return;
    }
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
        image: imageUrl, // Залишаємо старе зображення, якщо нове не завантажено
        author: session?.user?.id,
      };

      if (onSubmit) {
        await onSubmit(recipeData); // Винесена логіка в зовнішній компонент
      } else {
        await axios.post("/api/recipes", recipeData);
      }

      console.log(recipeData);

      setSuccessMessage("Рецепт успішно опубліковано!");
      if (!isEditMode) {
        setTimeout(() => {
          if (session?.user?.id) {
            window.location.href = `/profile/${session.user.id}`;
          } else {
            window.location.href = `/`;
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Помилка при надсиланні рецепта:", error);
      const errorMessage =
        error.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.";
      alert("Помилка: " + errorMessage);
    }
  };

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

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

  const handleSave = async () => {
    if (formData.ingredients.length === 0) {
      alert("Будь ласка, додайте хоча б один інгредієнт.");
      return;
    }

    if (formData.steps.length === 0) {
      alert("Будь ласка, додайте хоча б один крок приготування.");
      return;
    }

    setIsSavingDraft(true);
    setSuccessMessage("");
    setLoading(true);

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    const dataToSave = {
      ...formData,
      image: imageUrl,
      is_published: false,
      author: session?.user?.id,
    };

    try {
      if (isEditMode) {
        // При редагуванні робимо PUT за ID рецепта
        const recipeId = formData.id || formData._id;
        if (!recipeId) {
          alert("Не знайдено id рецепта для редагування!");
          return;
        }
        await axios.put(`/api/recipes/${id}`, dataToSave);
        setSuccessMessage("Рецепт оновлено!");
      } else {
        // При створенні нового рецепта робимо POST
        await axios.post("/api/recipes", dataToSave);
        setSuccessMessage("Рецепт збережено як чернетку!");
      }

      setTimeout(() => {
        if (isEditMode) {
          window.location.href = `/private-recipes`;
        } else if (session?.user?.id) {
          window.location.href = `/profile/${session.user.id}`;
        } else {
          window.location.href = `/`;
        }
      }, 1500);
    } catch (error) {
      console.error("Помилка збереження рецепта:", error);
      alert("Не вдалося зберегти рецепт.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {isEditMode ? "Редагувати рецепт" : "Додати рецепт"}
      </h1>
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
          Оберіть зображення
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
          <label className={styles.title}>Інгредієнти</label>
          {formData.ingredients.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:flex-nowrap items-start sm:items-center gap-2 mb-2"
            >
              <div className={styles.wrapper}>
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
              </div>
              <div className={styles.wrapper}>
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
            </div>
          ))}
          <Button variant="addIteam" onClick={() => handleAddIngredient()}>
            + Додати інгредієнт
          </Button>
        </div>

        <div>
          <label className={styles.title}>
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
          <Button variant="addIteam" onClick={() => handleAddField("steps")}>
            + Додати крок
          </Button>
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
          <label className={styles.title}>Дієта</label>
          {["Веганська", "Вегетеріанська", "Безглютенова", "Безлактозна"].map(
            (d) => (
              <label key={d} className={styles.label}>
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
        <div className={styles.CTA}>
          <Button
            variant="third"
            type="button"
            onClick={handleSave}
            disabled={isSavingDraft}
          >
            {isSavingDraft
              ? isEditMode
                ? "Редагування..."
                : "Збереження..."
              : isEditMode
              ? "Редагувати"
              : "Зберегти рецепт"}
          </Button>

          <Button variant="third" type="submit" disabled={isPublishing}>
            {isPublishing ? "Публікація..." : "Опублікувати рецепт"}
          </Button>
        </div>
      </form>
      {loading && <div className={styles.loading}>Завантаження...</div>}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
    </div>
  );
}
