export interface ThrowErrorRequest {
    /** the unique job identifier, as obtained when activating the job */
    jobKey: number;
    /** the error code that will be matched with an error catch event */
    errorCode: string;
    /** an optional error message that provides additional context */
    errorMessage: string;
}