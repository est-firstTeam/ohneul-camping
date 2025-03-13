import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const BaseLayout = lazy(() => import("./layout/BaseLayout.jsx"));
const Main = lazy(() => import("./pages/Main.jsx"));
const SearchResult = lazy(() => import("./pages/SearchResult.jsx"));
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
