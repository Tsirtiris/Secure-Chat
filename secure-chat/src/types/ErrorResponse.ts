/* eslint-disable no-mixed-spaces-and-tabs */
export interface GeneralErrorResponse {
	statusCode: number;
	message: string;
	desc?: string;
}

export interface ValidationErrorResponse extends GeneralErrorResponse {
	field?: string;
}

export type ErrorResponse =
	| {
			type: "GENERAL_ERROR";
			error: GeneralErrorResponse;
	  }
	| {
			type: "VALIDATION_ERROR";
			error: ValidationErrorResponse;
	  };
