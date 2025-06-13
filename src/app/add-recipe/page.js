import Wrapper from "@/components/shared/Wrapper/Wrapper";
import AddRecipeModal from "@/components/AddRecipeModal/AddRecipeModal";

export default async function AddRecipePage(params) {
  return (
    <main>
      <Wrapper>
        <AddRecipeModal />
      </Wrapper>
    </main>
  );
}
