import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface State {
	serverKey?: string;
}

interface Action {
	setServerKey: (serverKey: string) => void;
	clear: () => void;
}

export const useServerKey = create(
	immer<State & Action>((set) => ({
		setServerKey: (serverKey) =>
			set((state) => {
				state.serverKey = serverKey;
			}),
		clear: () =>
			set((state) => {
				state.serverKey = undefined;
			}),
	}))
);
