import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false }
); // ОЦЕЙ МОМЕНТ

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String },
  ingredients: [
    {
      quantity: { type: String, required: false, default: "" },
      unit: { type: String, required: false, default: "" },
      name: { type: String, required: true },
    },
  ],
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
  cookingTime: { type: Number, required: true },
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
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // зв'язок з користувачем
  createdAt: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: true },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratings: [ratingSchema],
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;
