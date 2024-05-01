import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ChatPage from "../pages/Chat/Chat";
import { Guard } from "../components/Guard/Guard";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},

	{
		path: "/chat",
		element: (
			<Guard>
				<ChatPage></ChatPage>
			</Guard>
		),
	},
]);

export default router;
