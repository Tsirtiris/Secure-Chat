import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { GroupResponse } from "../../api/group.types";

interface State {
	group?: GroupResponse;
	isOpen: boolean;
}
interface Action {
	onOpen: (group: GroupResponse) => void;
	onClose: () => void;
}

export const useManageDialog = create(
	immer<State & Action>((set) => {
		return {
			isOpen: false,
			onOpen: (group) =>
				set((state) => {
					state.isOpen = true;
					state.group = group;
				}),
			onClose: () =>
				set((state) => {
					state.isOpen = false;
					state.group = undefined;
				}),
		};
	})
);
