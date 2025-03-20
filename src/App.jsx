import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const Main = lazy(() => import("./pages/Main.jsx"));
const SearchResult = lazy(() => import("./pages/SearchResult.jsx"));
const MyPage = lazy(() => import("./pages/MyPage.jsx"));
const Reservation = lazy(() => import("./pages/Reservation.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const LoginHome = lazy(() => import("./pages/LoginHome.jsx"));
const CreateAccount = lazy(() => import("./components/CreateAccount.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const ProductListExam = lazy(() => import("./pages/ProductListExam.jsx"));
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BaseLayout />,
      children: [
        {
          path: "/",
          element: <Main />,
        },
        {
          path: "/my",
          element: <MyPage />,
          children: [
            {
              path: "",
              element: <Navigate to="reservation" replace />,
            },
            { path: "reservation", element: <Reservation /> },
            { path: "cart", element: <Cart /> },
          ],
        },
        {
          path: "/searchResult",
          element: <SearchResult />,
        },
        {
          path: "loginHome",
          element: <LoginHome />,
        },
        {
          path: "createAccount",
          element: <CreateAccount />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          // 임시 페이지 (추후 삭제)
          path: "/productListExam",
          element: <ProductListExam />,
        },
      ],
    },
  ]);
  return (
    <Suspense fallback={<div>"..loading"</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
