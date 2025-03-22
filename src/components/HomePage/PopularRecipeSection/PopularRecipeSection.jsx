'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
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
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{recipe.cookingTime} хв</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm">{recipe.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularRecipeSection = ({ initialData = {} }) => {
  const [recipes, setRecipes] = useState(initialData.recipes || []);
  const [loading, setLoading] = useState(!initialData.recipes && !initialData.error);
  const [error, setError] = useState(initialData.error || null);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (!initialData.recipes && !initialData.error) {
      const fetchPopularRecipes = async () => {
        try {
          setLoading(true);
          // Fetching popular recipes (highest rated)
          const response = await fetch('/api/recipes?sort=rating&limit=4');
          
          if (!response.ok) {
            throw new Error('Помилка при отриманні рецептів');
          }
          
          const data = await response.json();
          setRecipes(data.slice(0, 4)); // Ensure we only display up to 4 recipes
          setError(null);
        } catch (err) {
          console.error('Error fetching popular recipes:', err);
          setError('Не вдалося завантажити популярні рецепти.');
        } finally {
          setLoading(false);
        }
      };

      fetchPopularRecipes();
    }
  }, [initialData.recipes, initialData.error]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Популярні рецепти</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Найпопулярніші рецепти нашої платформи, які отримали найбільше позитивних відгуків від користувачів.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Популярні рецепти не знайдено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link 
                key={recipe._id}
                href={`/recipes/${recipe._id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                tabIndex="0"
                aria-label={`Переглянути рецепт: ${recipe.title}`}
              >
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
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">{recipe.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-500 text-sm">{recipe.cookingTime} хв</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            href="/recipes" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            tabIndex="0"
            aria-label="Переглянути всі рецепти"
          >
            Переглянути всі рецепти
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipeSection;
