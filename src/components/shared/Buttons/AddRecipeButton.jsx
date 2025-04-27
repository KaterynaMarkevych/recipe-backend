"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import AuthModal from "@/components/Auth/AuthModal/AuthModal";
import AddRecipeModal from "@/components/AddRecipeModal/AddRecipeModal";

const AddRecipeButton = ({ user }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAddRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

  const handleClick = () => {
    if (user?.id) {
      setAddRecipeModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleClick}>Додати рецепт</Button>

      {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {isAddRecipeModalOpen && (
        <AddRecipeModal onClose={() => setAddRecipeModalOpen(false)} />
      )}
    </>
  );
};
export default AddRecipeButton;
