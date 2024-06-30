import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import View from "./components/View";
import Home from "./components/Home";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <h1>Error Occurred</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/view/:searchResults",
        element: <View />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
