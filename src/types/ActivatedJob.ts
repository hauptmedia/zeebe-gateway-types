export interface ActivatedJob {
    /** the key, a unique identifier for the job */
    key: number;
    /** the type of the job (should match what was requested) */
    type: string;
    /** the job's process instance key */
    processInstanceKey: number;
    /** the bpmn process ID of the job process definition */
    bpmnProcessId: string;
    /** the version of the job process definition */
    processDefinitionVersion: number;
    /** the key of the job process definition */
    processDefinitionKey: number;
    /** the associated task element ID */
    elementId: string;
    /**
     * the unique key identifying the associated task, unique within the scope of the
     * process instance
     */
    elementInstanceKey: number;
    /**
     * a set of custom headers defined during modelling; returned as a serialized
     * JSON document
     */
    customHeaders: string;
    /** the name of the worker which activated this job */
    worker: string;
    /** the amount of retries left to this job (should always be positive) */
    retries: number;
    /** when the job can be activated again, sent as a UNIX epoch timestamp */
    deadline: number;
    /**
     * JSON document, computed at activation time, consisting of all visible variables to
     * the task scope
     */
    variables: string;
}