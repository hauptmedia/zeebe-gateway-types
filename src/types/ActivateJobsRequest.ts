export interface ActivateJobsRequest {
    /**
     * the job type, as defined in the BPMN process (e.g. <zeebe:taskDefinition
     * type="payment-service" />)
     */
    type: string;
    /** the name of the worker activating the jobs, mostly used for logging purposes */
    worker: string;
    /**
     * a job returned after this call will not be activated by another call until the
     * timeout (in ms) has been reached
     */
    timeout: number;
    /** the maximum jobs to activate by this request */
    maxJobsToActivate: number;
    /**
     * a list of variables to fetch as the job variables; if empty, all visible variables at
     * the time of activation for the scope of the job will be returned
     */
    fetchVariable: string[];
    /**
     * The request will be completed when at least one job is activated or after the requestTimeout (in ms).
     * if the requestTimeout = 0, a default timeout is used.
     * if the requestTimeout < 0, long polling is disabled and the request is completed immediately, even when no job is activated.
     */
    requestTimeout: number;
}