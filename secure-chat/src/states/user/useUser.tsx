import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CurrentUserResponse } from "../../api/auth.types";

type State = {
	user?: CurrentUserResponse;
};
type Actions = {
	setUser: (newUser: CurrentUserResponse) => void;
	clearUser: () => void;
};

export const useUser = create(
	immer<State & Actions>((set) => ({
		user: undefined,
		setUser: (newUser) =>
			set((state) => {
				state.user = newUser;
			}),
		clearUser: () =>
			set((state) => {
				state.user = undefined;
			}),
	}))
);
