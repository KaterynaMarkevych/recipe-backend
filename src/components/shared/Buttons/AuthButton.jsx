"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "./Button";
import AuthModal from "@/components/Auth/AuthModal/AuthModal";

const AuthButton = () => {
  const { data: session } = useSession();

  const handleLogOut = () => {
    signOut();
  };

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {session ? (
        <Button onClick={handleLogOut}>Вийти</Button>
      ) : (
        <Button onClick={() => setShowModal(true)}>Увійти</Button>
      )}

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
};
export default AuthButton;
