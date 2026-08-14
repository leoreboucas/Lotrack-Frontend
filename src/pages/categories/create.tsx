import { useNavigate } from "react-router-dom";
import { CategoryForm } from "./form";

export const CategoryCreate = () => {
  const navigate = useNavigate();

  return (
    <CategoryForm action="create" onClose={() => navigate("/categories")} />
  );
};
