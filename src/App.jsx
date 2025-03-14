import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const Main = lazy(() => import("./pages/Main.jsx"));
const SearchResult = lazy(() => import("./pages/SearchResult.jsx"));
const LoginHome = lazy(() => import("./pages/LoginHome.jsx"));
const CreateAccount = lazy(() => import("./components/CreateAccount.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
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
