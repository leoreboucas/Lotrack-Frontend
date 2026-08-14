import { useNavigate } from "react-router-dom";
import { CategoryForm } from "./form";

export const CategoryEdit = () => {
  const navigate = useNavigate();

  return <CategoryForm action="edit" onClose={() => navigate("/categories")} />;
};
