"use client";

import { useState } from "react";
import styles from "./FilterSection.module.scss";

const FilterSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({});

  const mealTypes = [
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

  const difficulties = ["Легко", "Середньо", "Складно"];
  const dietTypes = [
    "Вегетеріанська",
    "Веганська",
    "Безглютенова",
    "Безлактозна",
  ];
  const cookingTimes = [
    { value: "lessThan30", label: "< 30 хв" },
    { value: "30to60", label: "30-60 хв" },
    { value: "moreThan60", label: "> 60 хв" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(newFilters);
    onFilterChange(key, value);
  };

  const handleDietChange = (diet) => {
    const currentDiets = filters.diet ? filters.diet.split(",") : [];
    let newDiets;

    if (currentDiets.includes(diet)) {
      newDiets = currentDiets.filter((d) => d !== diet);
    } else {
      newDiets = [...currentDiets, diet];
    }

    handleFilterChange("diet", newDiets.length > 0 ? newDiets.join(",") : null);
  };

  const handleClearFilters = () => {
    // Clear local state
    setFilters({});

    // Notify parent component of cleared filters
    Object.keys(filters).forEach((key) => {
      onFilterChange(key, null);
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Фільтри</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          tabIndex="0"
          aria-label="Очистити всі фільтри"
        >
          Очистити всі
        </button>
      </div>

      <div className="grid grid-cols-1  gap-4">
        {/* Тип страви */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип страви
          </label>
          <select
            value={filters.mealType || ""}
            onChange={(e) =>
              handleFilterChange("mealType", e.target.value || null)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Всі типи</option>
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Складність */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Складність
          </label>
          <select
            value={filters.difficulty || ""}
            onChange={(e) =>
              handleFilterChange("difficulty", e.target.value || null)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Будь-яка</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        {/* Час приготування */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Час приготування
          </label>
          <select
            value={filters.cookingTime || ""}
            onChange={(e) =>
              handleFilterChange("cookingTime", e.target.value || null)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Будь-який час</option>
            {cookingTimes.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        {/* Пошук */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пошук рецептів
          </label>
          <input
            type="text"
            placeholder="Введіть назву..."
            value={filters.searchTerm || ""}
            onChange={(e) =>
              handleFilterChange("searchTerm", e.target.value || null)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Дієтичні особливості */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Дієтичні особливості
        </label>
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((diet) => {
            const isSelected =
              filters.diet && filters.diet.split(",").includes(diet);
            return (
              <button
                key={diet}
                onClick={() => handleDietChange(diet)}
                className={`px-3 py-1 rounded-full text-sm ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
                tabIndex="0"
                aria-pressed={isSelected}
                aria-label={`Фільтр за дієтою: ${diet}`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Сортування */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Сортування
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange("sort", "rating")}
            className={`px-3 py-1 rounded-md text-sm ${
              filters.sort === "rating"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
            tabIndex="0"
            aria-pressed={filters.sort === "rating"}
            aria-label="Сортувати за рейтингом"
          >
            За рейтингом
          </button>
          <button
            onClick={() => handleFilterChange("sort", "time")}
            className={`px-3 py-1 rounded-md text-sm ${
              filters.sort === "time"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
            tabIndex="0"
            aria-pressed={filters.sort === "time"}
            aria-label="Сортувати за часом приготування"
          >
            За часом приготування
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
