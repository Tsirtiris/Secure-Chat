import { create } from "zustand";
import { ContactResponse } from "../../api/contact.types";
import { immer } from "zustand/middleware/immer";

interface State {
	selectedContact?: ContactResponse;
}

interface Action {
	setSelectedContact: (contact: ContactResponse) => void;
	clear: () => void;
}

export const useSelectedContact = create(
	immer<State & Action>((set) => {
		return {
			setSelectedContact: (contact) =>
				set((state) => {
					state.selectedContact = contact;
				}),
			clear: () =>
				set((state) => {
					state.selectedContact = undefined;
				}),
		};
	})
);
