import { ReactNode, useEffect } from "react";
import { useUser } from "../../states/user/useUser";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/token";

interface GuardProps {
	children?: ReactNode;
}

export const Guard = ({ children }: GuardProps) => {
	const { token } = getToken();
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user && token) {
			navigate("/");
		} else if (!user && !token) {
			navigate("/login");
		}
	}, [user, navigate, token]);

	return <>{children}</>;
};
