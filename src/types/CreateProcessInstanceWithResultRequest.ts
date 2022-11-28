import {CreateProcessInstanceRequest} from "./CreateProcessInstanceRequest";

export interface CreateProcessInstanceWithResultRequest {
    request:
        | CreateProcessInstanceRequest
        | undefined;
    /**
     * timeout (in ms). the request will be closed if the process is not completed
     * before the requestTimeout.
     * if requestTimeout = 0, uses the generic requestTimeout configured in the gateway.
     */
    requestTimeout: number;
    /**
     * list of names of variables to be included in `CreateProcessInstanceWithResultResponse.variables`
     * if empty, all visible variables in the root scope will be returned.
     */
    fetchVariables: string[];
}