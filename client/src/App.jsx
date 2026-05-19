import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage.jsx";
import ListPage from "./routes/listPage/listPage.jsx";
import Layout, { RequireAuth } from "./routes/layout/layout.jsx";
import SinglePage from "./routes/singlePage/singlePage.jsx";
import Login from "./routes/login/login.jsx";
import RegisterPage from "./routes/registerPage/registerPage.jsx";
import ProfilePage from "./routes/profilePage/profilePage.jsx";
import ErrorPage from "./routes/errorPage/errorPage.jsx";
import NewPostPage from "./routes/newpostPage/newPostPage.jsx";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage.jsx";
import AboutPage from "./routes/aboutPage/AboutPage.jsx";
import ContactPage from "./routes/contactPage/ContactPage.jsx";
import AgentsPage from "./routes/agentsPage/AgentsPage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/list", element: <ListPage /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/:id", element: <SinglePage />, errorElement: <ErrorPage /> },
        { path: "/about", element: <AboutPage /> },
        { path: "/contact", element: <ContactPage /> },
        { path: "/agents", element: <AgentsPage /> },
        { path: "*", element: <ErrorPage /> },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        { path: "/profile", element: <ProfilePage /> },
        { path: "/profile/update", element: <ProfileUpdatePage /> },
        { path: "/add", element: <NewPostPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
