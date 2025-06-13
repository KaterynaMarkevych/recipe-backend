"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "./Button";
import AuthModal from "@/components/Auth/AuthModal/AuthModal";

export const AddRecipeButton = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const handleClick = () => {
    if (user?.id) {
      window.location.href = `/add-recipe`;
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleClick}>Додати рецепт</Button>

      {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </>
  );
};
