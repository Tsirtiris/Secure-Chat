import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const ChatModes = {
	PERSONAL: "PERSONAL",
	GROUP: "GROUP",
} as const;
export type ChatModeType = keyof typeof ChatModes;

interface State {
	mode: ChatModeType;
}
interface Action {
	setMode: (mode: ChatModeType) => void;
}
export const useChatMode = create(
	immer<State & Action>((set) => {
		return {
			mode: ChatModes.PERSONAL,
			setMode: (mode) =>
				set((state) => {
					state.mode = mode;
				}),
		};
	})
);
