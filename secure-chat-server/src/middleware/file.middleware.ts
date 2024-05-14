import multer from "multer";

const fileMiddleware = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1024 * 1024 * 10,
	},
});

export { fileMiddleware };
