import { useMutation } from "@tanstack/react-query";
import MessageAPI from "../../../api/message";
import { useState } from "react";
import { AxiosProgressEvent } from "axios";

export const DOWNLOAD_FILE = "DOWNLOAD_FILE";

export const useDownloadFile = () => {
	const [progress, setProgress] = useState("0");

	const handleProgressCallback = (event: AxiosProgressEvent) => {
		const percent = (event.loaded / (event?.total ?? 1)) * 100;
		setProgress(percent.toFixed(0));
	};

	const mutation = useMutation({
		mutationKey: [DOWNLOAD_FILE],
		mutationFn: ({ id, filename }: { id: string; filename: string }) =>
			MessageAPI.downloadFile(id, filename, handleProgressCallback),
	});

	return { mutation, progress };
};
