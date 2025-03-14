import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Suspense } from "react";

const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const Main = lazy(() => import("./pages/Main.jsx"));
const SearchResult = lazy(() => import("./pages/SearchResult.jsx"));
const MyPage = lazy(() => import("./pages/MyPage.jsx"));
const Reservation = lazy(() => import("./pages/Reservation.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
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
          path: "/searchResult/:id",
          element: <SearchResult />,
        },
        {
          path: "/my",
          element: <MyPage />,
          children: [
            { path: "reservation", element: <Reservation /> },
            { path: "cart", element: <Cart /> },
          ],
        },
      ],
    },
  ]);
  return (
    <Suspense fallback={<div></div>}>
      <RouterProvider router={router} />;
    </Suspense>
  );
}

export default App;
