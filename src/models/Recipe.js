import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [{ type: String, required: true }],
  steps: [{ type: String, required: true }],
  type: {
    type: String,
    enum: [
      "Сніданок",
      "Обід",
      "Перекус",
      "Вечеря",
      "Напої",
      "Салати та закуски",
      "Супи",
      "Основні страви",
      "Десерти",
    ],
  },
  cuisine: {
    type: String,
    enum: [
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
      "",
    ],
  },
  diet: {
    type: [String], // поле масивом рядків
    enum: ["Вегетеріанська", "Веганська", "Безглютенова", "Безлактозна"], // можливі значення
    default: [],
  },
  cookingTime: { type: String },
  difficulty: {
    type: String,
    enum: ["Легко", "Середньо", "Складно"],
    required: true,
  },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    carbs: { type: Number, required: true },
  },
  servings: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // зв'язок з користувачем
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;
