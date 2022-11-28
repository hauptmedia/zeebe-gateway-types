export interface CreateProcessInstanceWithResultResponse {
    /** the key of the process definition which was used to create the process instance */
    processDefinitionKey: number;
    /**
     * the BPMN process ID of the process definition which was used to create the process
     * instance
     */
    bpmnProcessId: string;
    /** the version of the process definition which was used to create the process instance */
    version: number;
    /**
     * the unique identifier of the created process instance; to be used wherever a request
     * needs a process instance key (e.g. CancelProcessInstanceRequest)
     */
    processInstanceKey: number;
    /**
     * JSON document
     * consists of visible variables in the root scope
     */
    variables: string;
}
