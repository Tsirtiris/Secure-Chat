import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
} from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { useSelectedContact } from "../../states/user/useSelectedUser";

export const SidebarDrawer = () => {
	const { selectedContact, selectedGroup, clear } = useSelectedContact();
	return (
		<Drawer
			isOpen={!(selectedContact || selectedGroup)}
			onClose={() => clear()}
			size={"full"}
			placement="left"
		>
			<DrawerOverlay></DrawerOverlay>
			<DrawerContent>
				<DrawerBody w={"full"} h="full" p="2">
					<Sidebar />
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
