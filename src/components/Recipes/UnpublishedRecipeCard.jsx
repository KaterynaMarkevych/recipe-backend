// components/Recipes/UnpublishedRecipeCard.jsx
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.scss";

const UnpublishedRecipeCard = ({ recipe }) => {
  return (
    <div className={styles.card}>
      <div className="relative h-48 w-full">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Немає зображення</span>
          </div>
        )}
        {recipe.type && (
          <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
            {recipe.type}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <Link
            href={`/private-recipes/${recipe._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            tabIndex="0"
          >
            Переглянути
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnpublishedRecipeCard;
