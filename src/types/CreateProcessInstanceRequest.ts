export interface CreateProcessInstanceRequest {
    /**
     * the unique key identifying the process definition (e.g. returned from a process
     * in the DeployProcessResponse message)
     */
    processDefinitionKey: number;
    /** the BPMN process ID of the process definition */
    bpmnProcessId: string;
    /** the version of the process; set to -1 to use the latest version */
    version: number;
    /**
     * JSON document that will instantiate the variables for the root variable scope of the
     * process instance; it must be a JSON object, as variables will be mapped in a
     * key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
     * "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
     * valid argument, as the root of the JSON document is an array and not an object.
     */
    variables: string;
}