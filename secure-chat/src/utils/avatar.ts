export const generateRandomAvatar = () => {
	return Math.random().toString(36).substring(2, 7);
};

export const getAvatarUrl = (seed: string) => {
	return "https://api.dicebear.com/8.x/fun-emoji/svg?seed=" + seed;
};

export const getGroupAvatarUrl = (seed: string) => {
	return "https://api.dicebear.com/8.x/identicon/svg?seed=" + seed;
};
