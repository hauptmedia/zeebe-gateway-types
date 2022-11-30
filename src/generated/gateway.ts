/* eslint-disable */

export const protobufPackage = "gateway_protocol";

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

export interface ActivateJobsResponse {
  /** list of activated jobs */
  jobs: ActivatedJob[];
}

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

export interface CancelProcessInstanceRequest {
  /**
   * the process instance key (as, for example, obtained from
   * CreateProcessInstanceResponse)
   */
  processInstanceKey: number;
}

export interface CancelProcessInstanceResponse {
}

export interface CompleteJobRequest {
  /** the unique job identifier, as obtained from ActivateJobsResponse */
  jobKey: number;
  /** a JSON document representing the variables in the current task scope */
  variables: string;
}

export interface CompleteJobResponse {
}

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
  /**
   * List of start instructions. If empty (default) the process instance
   * will start at the start event. If non-empty the process instance will apply start
   * instructions after it has been created
   */
  startInstructions: ProcessInstanceCreationStartInstruction[];
}

export interface ProcessInstanceCreationStartInstruction {
  /** element ID */
  elementId: string;
}

export interface CreateProcessInstanceResponse {
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
}

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

/** @deprecated */
export interface DeployProcessRequest {
  /** List of process resources to deploy */
  processes: ProcessRequestObject[];
}

/** @deprecated */
export interface ProcessRequestObject {
  /** the resource basename, e.g. myProcess.bpmn */
  name: string;
  /** the process definition as a UTF8-encoded string */
  definition: Buffer;
}

/** @deprecated */
export interface DeployProcessResponse {
  /** the unique key identifying the deployment */
  key: number;
  /** a list of deployed processes */
  processes: ProcessMetadata[];
}

export interface DeployResourceRequest {
  /** list of resources to deploy */
  resources: Resource[];
}

export interface Resource {
  /** the resource name, e.g. myProcess.bpmn or myDecision.dmn */
  name: string;
  /** the file content as a UTF8-encoded string */
  content: Buffer;
}

export interface DeployResourceResponse {
  /** the unique key identifying the deployment */
  key: number;
  /** a list of deployed resources, e.g. processes */
  deployments: Deployment[];
}

export interface Deployment {
  /** metadata of a deployed process */
  process?:
    | ProcessMetadata
    | undefined;
  /** metadata of a deployed decision */
  decision?:
    | DecisionMetadata
    | undefined;
  /** metadata of a deployed decision requirements */
  decisionRequirements?: DecisionRequirementsMetadata | undefined;
}

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

export interface DecisionMetadata {
  /**
   * the dmn decision ID, as parsed during deployment; together with the
   * versions forms a unique identifier for a specific decision
   */
  dmnDecisionId: string;
  /** the dmn name of the decision, as parsed during deployment */
  dmnDecisionName: string;
  /** the assigned decision version */
  version: number;
  /**
   * the assigned decision key, which acts as a unique identifier for this
   * decision
   */
  decisionKey: number;
  /**
   * the dmn ID of the decision requirements graph that this decision is part
   * of, as parsed during deployment
   */
  dmnDecisionRequirementsId: string;
  /**
   * the assigned key of the decision requirements graph that this decision is
   * part of
   */
  decisionRequirementsKey: number;
}

export interface DecisionRequirementsMetadata {
  /**
   * the dmn decision requirements ID, as parsed during deployment; together
   * with the versions forms a unique identifier for a specific decision
   */
  dmnDecisionRequirementsId: string;
  /** the dmn name of the decision requirements, as parsed during deployment */
  dmnDecisionRequirementsName: string;
  /** the assigned decision requirements version */
  version: number;
  /**
   * the assigned decision requirements key, which acts as a unique identifier
   * for this decision requirements
   */
  decisionRequirementsKey: number;
  /**
   * the resource name (see: Resource.name) from which this decision
   * requirements was parsed
   */
  resourceName: string;
}

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
  /** the backoff timeout (in ms) for the next retry */
  retryBackOff: number;
  /**
   * JSON document that will instantiate the variables at the local scope of the
   * job's associated task; it must be a JSON object, as variables will be mapped in a
   * key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
   * "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
   * valid argument, as the root of the JSON document is an array and not an object.
   */
  variables: string;
}

export interface FailJobResponse {
}

export interface ThrowErrorRequest {
  /** the unique job identifier, as obtained when activating the job */
  jobKey: number;
  /** the error code that will be matched with an error catch event */
  errorCode: string;
  /** an optional error message that provides additional context */
  errorMessage: string;
  /**
   * JSON document that will instantiate the variables at the local scope of the
   * error catch event that catches the thrown error; it must be a JSON object, as variables will be mapped in a
   * key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
   * "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
   * valid argument, as the root of the JSON document is an array and not an object.
   */
  variables: string;
}

export interface ThrowErrorResponse {
}

export interface PublishMessageRequest {
  /** the name of the message */
  name: string;
  /** the correlation key of the message */
  correlationKey: string;
  /** how long the message should be buffered on the broker, in milliseconds */
  timeToLive: number;
  /**
   * the unique ID of the message; can be omitted. only useful to ensure only one message
   * with the given ID will ever be published (during its lifetime)
   */
  messageId: string;
  /**
   * the message variables as a JSON document; to be valid, the root of the document must be an
   * object, e.g. { "a": "foo" }. [ "foo" ] would not be valid.
   */
  variables: string;
}

export interface PublishMessageResponse {
  /** the unique ID of the message that was published */
  key: number;
}

export interface ResolveIncidentRequest {
  /** the unique ID of the incident to resolve */
  incidentKey: number;
}

export interface ResolveIncidentResponse {
}

export interface TopologyRequest {
}

export interface TopologyResponse {
  /** list of brokers part of this cluster */
  brokers: BrokerInfo[];
  /** how many nodes are in the cluster */
  clusterSize: number;
  /** how many partitions are spread across the cluster */
  partitionsCount: number;
  /** configured replication factor for this cluster */
  replicationFactor: number;
  /** gateway version */
  gatewayVersion: string;
}

export interface BrokerInfo {
  /** unique (within a cluster) node ID for the broker */
  nodeId: number;
  /** hostname of the broker */
  host: string;
  /** port for the broker */
  port: number;
  /** list of partitions managed or replicated on this broker */
  partitions: Partition[];
  /** broker version */
  version: string;
}

export interface Partition {
  /** the unique ID of this partition */
  partitionId: number;
  /** the role of the broker for this partition */
  role: Partition_PartitionBrokerRole;
  /** the health of this partition */
  health: Partition_PartitionBrokerHealth;
}

/** Describes the Raft role of the broker for a given partition */
export enum Partition_PartitionBrokerRole {
  LEADER = 0,
  FOLLOWER = 1,
  INACTIVE = 2,
  UNRECOGNIZED = -1,
}

/** Describes the current health of the partition */
export enum Partition_PartitionBrokerHealth {
  HEALTHY = 0,
  UNHEALTHY = 1,
  DEAD = 2,
  UNRECOGNIZED = -1,
}

export interface UpdateJobRetriesRequest {
  /** the unique job identifier, as obtained through ActivateJobs */
  jobKey: number;
  /** the new amount of retries for the job; must be positive */
  retries: number;
}

export interface UpdateJobRetriesResponse {
}

export interface SetVariablesRequest {
  /**
   * the unique identifier of a particular element; can be the process instance key (as
   * obtained during instance creation), or a given element, such as a service task (see
   * elementInstanceKey on the job message)
   */
  elementInstanceKey: number;
  /**
   * a JSON serialized document describing variables as key value pairs; the root of the document
   * must be an object
   */
  variables: string;
  /**
   * if true, the variables will be merged strictly into the local scope (as indicated by
   * elementInstanceKey); this means the variables is not propagated to upper scopes.
   * for example, let's say we have two scopes, '1' and '2', with each having effective variables as:
   * 1 => `{ "foo" : 2 }`, and 2 => `{ "bar" : 1 }`. if we send an update request with
   * elementInstanceKey = 2, variables `{ "foo" : 5 }`, and local is true, then scope 1 will
   * be unchanged, and scope 2 will now be `{ "bar" : 1, "foo" 5 }`. if local was false, however,
   * then scope 1 would be `{ "foo": 5 }`, and scope 2 would be `{ "bar" : 1 }`.
   */
  local: boolean;
}

export interface SetVariablesResponse {
  /** the unique key of the set variables command */
  key: number;
}

export interface ModifyProcessInstanceRequest {
  /** the key of the process instance that should be modified */
  processInstanceKey: number;
  /**
   * instructions describing which elements should be activated in which scopes,
   * and which variables should be created
   */
  activateInstructions: ModifyProcessInstanceRequest_ActivateInstruction[];
  /** instructions describing which elements should be terminated */
  terminateInstructions: ModifyProcessInstanceRequest_TerminateInstruction[];
}

export interface ModifyProcessInstanceRequest_ActivateInstruction {
  /** the id of the element that should be activated */
  elementId: string;
  /**
   * the key of the ancestor scope the element instance should be created in;
   * set to -1 to create the new element instance within an existing element
   * instance of the flow scope
   */
  ancestorElementInstanceKey: number;
  /** instructions describing which variables should be created */
  variableInstructions: ModifyProcessInstanceRequest_VariableInstruction[];
}

export interface ModifyProcessInstanceRequest_VariableInstruction {
  /**
   * JSON document that will instantiate the variables for the root variable scope of the
   * process instance; it must be a JSON object, as variables will be mapped in a
   * key-value fashion. e.g. { "a": 1, "b": 2 } will create two variables, named "a" and
   * "b" respectively, with their associated values. [{ "a": 1, "b": 2 }] would not be a
   * valid argument, as the root of the JSON document is an array and not an object.
   */
  variables: string;
  /**
   * the id of the element in which scope the variables should be created;
   * leave empty to create the variables in the global scope of the process instance
   */
  scopeId: string;
}

export interface ModifyProcessInstanceRequest_TerminateInstruction {
  /** the id of the element that should be terminated */
  elementInstanceKey: number;
}

export interface ModifyProcessInstanceResponse {
}
