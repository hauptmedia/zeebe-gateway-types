export interface FailJobRequest {
    /** the unique job identifier, as obtained when activating the job */
    jobKey: number;
    /** the amount of retries the job should have left */
    retries: number;
    /**
     * an optional message describing why the job failed
     * this is particularly useful if a job runs out of retries and an incident is raised,
     * as it this message can help explain why an incident was raised
     */
    errorMessage: string;
    /** the backoff timeout for the next retry */
    retryBackOff: number;
}