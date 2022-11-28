import {ActivatedJob} from "./ActivatedJob";

export interface ActivateJobsResponse {
    /** list of activated jobs */
    jobs: ActivatedJob[];
}