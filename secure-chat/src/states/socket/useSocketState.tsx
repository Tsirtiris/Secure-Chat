import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { BASE_URL } from "../../utils/api";
import { TOKEN } from "../../utils/token";

type State = {
	socket: Socket;
};

type Action = {
	setSocket: (socket: Socket) => void;
};
export const useSocketState = create<State & Action>((set) => ({
	socket: io(BASE_URL, {
		autoConnect: false,
		reconnection: false,
		auth: {
			token: window.localStorage.getItem(TOKEN),
		},
	}),
	setSocket: (newSocket: Socket) =>
		set((state) => ({ ...state, socket: newSocket })),
}));
