export interface CompleteJobRequest {
    /** the unique job identifier, as obtained from ActivateJobsResponse */
    jobKey: number;
    /** a JSON document representing the variables in the current task scope */
    variables: string;
}