import { Authenticated } from "@refinedev/core";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "@/pages/login";
import { AppLayout } from "./layout/appLayout";
import { CategoryCreate, CategoryEdit, CategoryList } from "./pages/categories";
import { ProductCreate, ProductEdit, ProductList } from "./pages/products";
import { SupplierCreate, SupplierEdit, SupplierList } from "./pages/suppliers";
import { LotList } from "./pages/lots";
import { StockMovementList } from "./pages/stockMovements";
import { EntryForm } from "./pages/stockMovements/entry/entryForm";
import { ExitForm } from "./pages/stockMovements/exit/exitForm";
import { AdjustmentForm } from "./pages/stockMovements/adjustment/adjustmentForm";
import { DisposalForm } from "./pages/stockMovements/disposal/disposalForm";
import { LowStockList } from "./pages/products/low-stock/lowStockList";
import { ProductShow } from "./pages/products/show";
import { CategoryShow } from "./pages/categories/show";
import { SupplierShow } from "./pages/suppliers/show";
import { LotShow } from "./pages/lots/show";
import { StockMovementShow } from "./pages/stockMovements/show";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <Authenticated
            key="authenticated-routes"
            fallback={<Navigate to="/login" replace />}
          >
            <AppLayout />
          </Authenticated>
        }
      >
        <Route path="/" element={<StockMovementList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/categories/edit/:id" element={<CategoryEdit />} />
        <Route path="/categories/show/:id" element={<CategoryShow />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/low-stock" element={<LowStockList />} />
        <Route path="/products/show/:id" element={<ProductShow />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/create" element={<SupplierCreate />} />
        <Route path="/suppliers/edit/:id" element={<SupplierEdit />} />
        <Route path="/suppliers/show/:id" element={<SupplierShow />} />
        <Route path="/lots" element={<LotList />} />
        <Route path="/lots/show/:id" element={<LotShow />} />
        <Route
          path="/stock-movements/show/:id"
          element={<StockMovementShow />}
        />
        <Route path="/movements/entries/create" element={<EntryForm />} />
        <Route path="/movements/exits/create" element={<ExitForm />} />
        <Route
          path="/movements/adjustments/create"
          element={<AdjustmentForm />}
        />
        <Route path="/movements/disposals/create" element={<DisposalForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
