import { getRecipeById } from "@/lib/recipes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import UnpublishedRecipeDetail from "@/components/Recipes/UnpublishedRecipeDetail";
import { redirect } from "next/navigation";

function serializeValue(value) {
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (typeof value === "object") {
    // ObjectId -> рядок
    if (
      value._bsontype === "ObjectID" &&
      typeof value.toString === "function"
    ) {
      return value.toString();
    }

    // Buffer -> base64 рядок
    if (Buffer.isBuffer(value)) {
      return value.toString("base64");
    }

    // Uint8Array -> base64 рядок
    if (value instanceof Uint8Array) {
      return Buffer.from(value).toString("base64");
    }

    // Відкидаємо всі функції і поля, які є функціями (щоб React не падав)
    const newObj = {};
    for (const key in value) {
      if (typeof value[key] !== "function") {
        newObj[key] = serializeValue(value[key]);
      }
    }
    return newObj;
  }

  // Примітивні типи залишаємо як є
  return value;
}

export default async function UnpublishedRecipePage({ params }) {
  const session = await getServerSession(authOptions);

  params = await params;
  if (!session) {
    redirect("/login");
  }

  try {
    const recipe = await getRecipeById(params.id, session.user.id);
    const recipeObj = recipe.toObject();
    const serializedRecipe = serializeValue(recipeObj);

    return (
      <main>
        <Wrapper>
          <UnpublishedRecipeDetail recipe={serializedRecipe} />
        </Wrapper>
      </main>
    );
  } catch (error) {
    return (
      <Wrapper>
        <p className="text-red-500">{error.message}</p>
      </Wrapper>
    );
  }
}
