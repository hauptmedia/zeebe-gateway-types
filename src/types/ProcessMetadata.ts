export interface ProcessMetadata {
    /**
     * the bpmn process ID, as parsed during deployment; together with the version forms a
     * unique identifier for a specific process definition
     */
    bpmnProcessId: string;
    /** the assigned process version */
    version: number;
    /** the assigned key, which acts as a unique identifier for this process */
    processDefinitionKey: number;
    /**
     * the resource name (see: ProcessRequestObject.name) from which this process was
     * parsed
     */
    resourceName: string;
}