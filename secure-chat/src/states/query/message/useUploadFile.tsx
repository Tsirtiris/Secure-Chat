import { useMutation } from "@tanstack/react-query";
import MessageAPI from "../../../api/message";
import { AxiosProgressEvent } from "axios";
import { useState } from "react";

export const FILE_UPLOAD = "FILE_UPLOAD";
export const useUploadFile = () => {
	const [progress, setProgress] = useState("0");
	const handleProgressCallback = (event: AxiosProgressEvent) => {
		const percent = (event.loaded / (event?.total ?? 1)) * 100;
		setProgress(percent.toFixed(0));
	};
	const mutation = useMutation({
		mutationKey: [FILE_UPLOAD],
		mutationFn: (data: FormData) =>
			MessageAPI.uploadFile(data, handleProgressCallback),
	});

	return { mutation, progress };
};
