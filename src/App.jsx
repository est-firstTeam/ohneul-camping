import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Account from "./pages/Account.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import DetailPage from "./pages/DetailPage.jsx";

const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const Main = lazy(() => import("./pages/MainPage.jsx"));
const SearchResult = lazy(() => import("./pages/SearchResult.jsx"));
const MyPage = lazy(() => import("./pages/MyPage.jsx"));
const Reservation = lazy(() => import("./pages/Reservation.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const CreateAccount = lazy(() => import("./pages/CreateAccount.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const DetailPage = lazy(() => import("./pages/DetailPage.jsx"));
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
            { path: "account", element: <Account /> },
          ],
        },
        {
          path: "searchResult/:location/:startdate/:enddate/:site",
          element: <SearchResult />,
        },
        {
          path: "searchResult/:id",
          element: <DetailPage />,
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
        // {
        //   path: "detail",
        //   element: <DetailPage />,
        // },
      ],
    },
  ]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div></div>}>
        <RouterProvider router={router} />
      </Suspense>
      <div style={{ fontSize: "20px" }}>
        <ReactQueryDevtools initialIsOpen={true} />
      </div>
    </QueryClientProvider>
  );
}
export default App;
