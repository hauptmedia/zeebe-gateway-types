/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleServerStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";

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

export function partition_PartitionBrokerRoleFromJSON(object: any): Partition_PartitionBrokerRole {
  switch (object) {
    case 0:
    case "LEADER":
      return Partition_PartitionBrokerRole.LEADER;
    case 1:
    case "FOLLOWER":
      return Partition_PartitionBrokerRole.FOLLOWER;
    case 2:
    case "INACTIVE":
      return Partition_PartitionBrokerRole.INACTIVE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Partition_PartitionBrokerRole.UNRECOGNIZED;
  }
}

export function partition_PartitionBrokerRoleToJSON(object: Partition_PartitionBrokerRole): string {
  switch (object) {
    case Partition_PartitionBrokerRole.LEADER:
      return "LEADER";
    case Partition_PartitionBrokerRole.FOLLOWER:
      return "FOLLOWER";
    case Partition_PartitionBrokerRole.INACTIVE:
      return "INACTIVE";
    case Partition_PartitionBrokerRole.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Describes the current health of the partition */
export enum Partition_PartitionBrokerHealth {
  HEALTHY = 0,
  UNHEALTHY = 1,
  DEAD = 2,
  UNRECOGNIZED = -1,
}

export function partition_PartitionBrokerHealthFromJSON(object: any): Partition_PartitionBrokerHealth {
  switch (object) {
    case 0:
    case "HEALTHY":
      return Partition_PartitionBrokerHealth.HEALTHY;
    case 1:
    case "UNHEALTHY":
      return Partition_PartitionBrokerHealth.UNHEALTHY;
    case 2:
    case "DEAD":
      return Partition_PartitionBrokerHealth.DEAD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Partition_PartitionBrokerHealth.UNRECOGNIZED;
  }
}

export function partition_PartitionBrokerHealthToJSON(object: Partition_PartitionBrokerHealth): string {
  switch (object) {
    case Partition_PartitionBrokerHealth.HEALTHY:
      return "HEALTHY";
    case Partition_PartitionBrokerHealth.UNHEALTHY:
      return "UNHEALTHY";
    case Partition_PartitionBrokerHealth.DEAD:
      return "DEAD";
    case Partition_PartitionBrokerHealth.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
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

function createBaseActivateJobsRequest(): ActivateJobsRequest {
  return { type: "", worker: "", timeout: 0, maxJobsToActivate: 0, fetchVariable: [], requestTimeout: 0 };
}

export const ActivateJobsRequest = {
  encode(message: ActivateJobsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.worker !== "") {
      writer.uint32(18).string(message.worker);
    }
    if (message.timeout !== 0) {
      writer.uint32(24).int64(message.timeout);
    }
    if (message.maxJobsToActivate !== 0) {
      writer.uint32(32).int32(message.maxJobsToActivate);
    }
    for (const v of message.fetchVariable) {
      writer.uint32(42).string(v!);
    }
    if (message.requestTimeout !== 0) {
      writer.uint32(48).int64(message.requestTimeout);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivateJobsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateJobsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.worker = reader.string();
          break;
        case 3:
          message.timeout = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.maxJobsToActivate = reader.int32();
          break;
        case 5:
          message.fetchVariable.push(reader.string());
          break;
        case 6:
          message.requestTimeout = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivateJobsRequest {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      worker: isSet(object.worker) ? String(object.worker) : "",
      timeout: isSet(object.timeout) ? Number(object.timeout) : 0,
      maxJobsToActivate: isSet(object.maxJobsToActivate) ? Number(object.maxJobsToActivate) : 0,
      fetchVariable: Array.isArray(object?.fetchVariable) ? object.fetchVariable.map((e: any) => String(e)) : [],
      requestTimeout: isSet(object.requestTimeout) ? Number(object.requestTimeout) : 0,
    };
  },

  toJSON(message: ActivateJobsRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.worker !== undefined && (obj.worker = message.worker);
    message.timeout !== undefined && (obj.timeout = Math.round(message.timeout));
    message.maxJobsToActivate !== undefined && (obj.maxJobsToActivate = Math.round(message.maxJobsToActivate));
    if (message.fetchVariable) {
      obj.fetchVariable = message.fetchVariable.map((e) => e);
    } else {
      obj.fetchVariable = [];
    }
    message.requestTimeout !== undefined && (obj.requestTimeout = Math.round(message.requestTimeout));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivateJobsRequest>, I>>(object: I): ActivateJobsRequest {
    const message = createBaseActivateJobsRequest();
    message.type = object.type ?? "";
    message.worker = object.worker ?? "";
    message.timeout = object.timeout ?? 0;
    message.maxJobsToActivate = object.maxJobsToActivate ?? 0;
    message.fetchVariable = object.fetchVariable?.map((e) => e) || [];
    message.requestTimeout = object.requestTimeout ?? 0;
    return message;
  },
};

function createBaseActivateJobsResponse(): ActivateJobsResponse {
  return { jobs: [] };
}

export const ActivateJobsResponse = {
  encode(message: ActivateJobsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.jobs) {
      ActivatedJob.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivateJobsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivateJobsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobs.push(ActivatedJob.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivateJobsResponse {
    return { jobs: Array.isArray(object?.jobs) ? object.jobs.map((e: any) => ActivatedJob.fromJSON(e)) : [] };
  },

  toJSON(message: ActivateJobsResponse): unknown {
    const obj: any = {};
    if (message.jobs) {
      obj.jobs = message.jobs.map((e) => e ? ActivatedJob.toJSON(e) : undefined);
    } else {
      obj.jobs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivateJobsResponse>, I>>(object: I): ActivateJobsResponse {
    const message = createBaseActivateJobsResponse();
    message.jobs = object.jobs?.map((e) => ActivatedJob.fromPartial(e)) || [];
    return message;
  },
};

function createBaseActivatedJob(): ActivatedJob {
  return {
    key: 0,
    type: "",
    processInstanceKey: 0,
    bpmnProcessId: "",
    processDefinitionVersion: 0,
    processDefinitionKey: 0,
    elementId: "",
    elementInstanceKey: 0,
    customHeaders: "",
    worker: "",
    retries: 0,
    deadline: 0,
    variables: "",
  };
}

export const ActivatedJob = {
  encode(message: ActivatedJob, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int64(message.key);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.processInstanceKey !== 0) {
      writer.uint32(24).int64(message.processInstanceKey);
    }
    if (message.bpmnProcessId !== "") {
      writer.uint32(34).string(message.bpmnProcessId);
    }
    if (message.processDefinitionVersion !== 0) {
      writer.uint32(40).int32(message.processDefinitionVersion);
    }
    if (message.processDefinitionKey !== 0) {
      writer.uint32(48).int64(message.processDefinitionKey);
    }
    if (message.elementId !== "") {
      writer.uint32(58).string(message.elementId);
    }
    if (message.elementInstanceKey !== 0) {
      writer.uint32(64).int64(message.elementInstanceKey);
    }
    if (message.customHeaders !== "") {
      writer.uint32(74).string(message.customHeaders);
    }
    if (message.worker !== "") {
      writer.uint32(82).string(message.worker);
    }
    if (message.retries !== 0) {
      writer.uint32(88).int32(message.retries);
    }
    if (message.deadline !== 0) {
      writer.uint32(96).int64(message.deadline);
    }
    if (message.variables !== "") {
      writer.uint32(106).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivatedJob {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivatedJob();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.processInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.bpmnProcessId = reader.string();
          break;
        case 5:
          message.processDefinitionVersion = reader.int32();
          break;
        case 6:
          message.processDefinitionKey = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.elementId = reader.string();
          break;
        case 8:
          message.elementInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.customHeaders = reader.string();
          break;
        case 10:
          message.worker = reader.string();
          break;
        case 11:
          message.retries = reader.int32();
          break;
        case 12:
          message.deadline = longToNumber(reader.int64() as Long);
          break;
        case 13:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivatedJob {
    return {
      key: isSet(object.key) ? Number(object.key) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      processInstanceKey: isSet(object.processInstanceKey) ? Number(object.processInstanceKey) : 0,
      bpmnProcessId: isSet(object.bpmnProcessId) ? String(object.bpmnProcessId) : "",
      processDefinitionVersion: isSet(object.processDefinitionVersion) ? Number(object.processDefinitionVersion) : 0,
      processDefinitionKey: isSet(object.processDefinitionKey) ? Number(object.processDefinitionKey) : 0,
      elementId: isSet(object.elementId) ? String(object.elementId) : "",
      elementInstanceKey: isSet(object.elementInstanceKey) ? Number(object.elementInstanceKey) : 0,
      customHeaders: isSet(object.customHeaders) ? String(object.customHeaders) : "",
      worker: isSet(object.worker) ? String(object.worker) : "",
      retries: isSet(object.retries) ? Number(object.retries) : 0,
      deadline: isSet(object.deadline) ? Number(object.deadline) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: ActivatedJob): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = Math.round(message.key));
    message.type !== undefined && (obj.type = message.type);
    message.processInstanceKey !== undefined && (obj.processInstanceKey = Math.round(message.processInstanceKey));
    message.bpmnProcessId !== undefined && (obj.bpmnProcessId = message.bpmnProcessId);
    message.processDefinitionVersion !== undefined &&
      (obj.processDefinitionVersion = Math.round(message.processDefinitionVersion));
    message.processDefinitionKey !== undefined && (obj.processDefinitionKey = Math.round(message.processDefinitionKey));
    message.elementId !== undefined && (obj.elementId = message.elementId);
    message.elementInstanceKey !== undefined && (obj.elementInstanceKey = Math.round(message.elementInstanceKey));
    message.customHeaders !== undefined && (obj.customHeaders = message.customHeaders);
    message.worker !== undefined && (obj.worker = message.worker);
    message.retries !== undefined && (obj.retries = Math.round(message.retries));
    message.deadline !== undefined && (obj.deadline = Math.round(message.deadline));
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivatedJob>, I>>(object: I): ActivatedJob {
    const message = createBaseActivatedJob();
    message.key = object.key ?? 0;
    message.type = object.type ?? "";
    message.processInstanceKey = object.processInstanceKey ?? 0;
    message.bpmnProcessId = object.bpmnProcessId ?? "";
    message.processDefinitionVersion = object.processDefinitionVersion ?? 0;
    message.processDefinitionKey = object.processDefinitionKey ?? 0;
    message.elementId = object.elementId ?? "";
    message.elementInstanceKey = object.elementInstanceKey ?? 0;
    message.customHeaders = object.customHeaders ?? "";
    message.worker = object.worker ?? "";
    message.retries = object.retries ?? 0;
    message.deadline = object.deadline ?? 0;
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBaseCancelProcessInstanceRequest(): CancelProcessInstanceRequest {
  return { processInstanceKey: 0 };
}

export const CancelProcessInstanceRequest = {
  encode(message: CancelProcessInstanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.processInstanceKey !== 0) {
      writer.uint32(8).int64(message.processInstanceKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelProcessInstanceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelProcessInstanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processInstanceKey = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CancelProcessInstanceRequest {
    return { processInstanceKey: isSet(object.processInstanceKey) ? Number(object.processInstanceKey) : 0 };
  },

  toJSON(message: CancelProcessInstanceRequest): unknown {
    const obj: any = {};
    message.processInstanceKey !== undefined && (obj.processInstanceKey = Math.round(message.processInstanceKey));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CancelProcessInstanceRequest>, I>>(object: I): CancelProcessInstanceRequest {
    const message = createBaseCancelProcessInstanceRequest();
    message.processInstanceKey = object.processInstanceKey ?? 0;
    return message;
  },
};

function createBaseCancelProcessInstanceResponse(): CancelProcessInstanceResponse {
  return {};
}

export const CancelProcessInstanceResponse = {
  encode(_: CancelProcessInstanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelProcessInstanceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelProcessInstanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CancelProcessInstanceResponse {
    return {};
  },

  toJSON(_: CancelProcessInstanceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CancelProcessInstanceResponse>, I>>(_: I): CancelProcessInstanceResponse {
    const message = createBaseCancelProcessInstanceResponse();
    return message;
  },
};

function createBaseCompleteJobRequest(): CompleteJobRequest {
  return { jobKey: 0, variables: "" };
}

export const CompleteJobRequest = {
  encode(message: CompleteJobRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.jobKey !== 0) {
      writer.uint32(8).int64(message.jobKey);
    }
    if (message.variables !== "") {
      writer.uint32(18).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompleteJobRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCompleteJobRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompleteJobRequest {
    return {
      jobKey: isSet(object.jobKey) ? Number(object.jobKey) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: CompleteJobRequest): unknown {
    const obj: any = {};
    message.jobKey !== undefined && (obj.jobKey = Math.round(message.jobKey));
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CompleteJobRequest>, I>>(object: I): CompleteJobRequest {
    const message = createBaseCompleteJobRequest();
    message.jobKey = object.jobKey ?? 0;
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBaseCompleteJobResponse(): CompleteJobResponse {
  return {};
}

export const CompleteJobResponse = {
  encode(_: CompleteJobResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompleteJobResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCompleteJobResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CompleteJobResponse {
    return {};
  },

  toJSON(_: CompleteJobResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CompleteJobResponse>, I>>(_: I): CompleteJobResponse {
    const message = createBaseCompleteJobResponse();
    return message;
  },
};

function createBaseCreateProcessInstanceRequest(): CreateProcessInstanceRequest {
  return { processDefinitionKey: 0, bpmnProcessId: "", version: 0, variables: "", startInstructions: [] };
}

export const CreateProcessInstanceRequest = {
  encode(message: CreateProcessInstanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.processDefinitionKey !== 0) {
      writer.uint32(8).int64(message.processDefinitionKey);
    }
    if (message.bpmnProcessId !== "") {
      writer.uint32(18).string(message.bpmnProcessId);
    }
    if (message.version !== 0) {
      writer.uint32(24).int32(message.version);
    }
    if (message.variables !== "") {
      writer.uint32(34).string(message.variables);
    }
    for (const v of message.startInstructions) {
      ProcessInstanceCreationStartInstruction.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProcessInstanceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProcessInstanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processDefinitionKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.bpmnProcessId = reader.string();
          break;
        case 3:
          message.version = reader.int32();
          break;
        case 4:
          message.variables = reader.string();
          break;
        case 5:
          message.startInstructions.push(ProcessInstanceCreationStartInstruction.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateProcessInstanceRequest {
    return {
      processDefinitionKey: isSet(object.processDefinitionKey) ? Number(object.processDefinitionKey) : 0,
      bpmnProcessId: isSet(object.bpmnProcessId) ? String(object.bpmnProcessId) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
      startInstructions: Array.isArray(object?.startInstructions)
        ? object.startInstructions.map((e: any) => ProcessInstanceCreationStartInstruction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CreateProcessInstanceRequest): unknown {
    const obj: any = {};
    message.processDefinitionKey !== undefined && (obj.processDefinitionKey = Math.round(message.processDefinitionKey));
    message.bpmnProcessId !== undefined && (obj.bpmnProcessId = message.bpmnProcessId);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.variables !== undefined && (obj.variables = message.variables);
    if (message.startInstructions) {
      obj.startInstructions = message.startInstructions.map((e) =>
        e ? ProcessInstanceCreationStartInstruction.toJSON(e) : undefined
      );
    } else {
      obj.startInstructions = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateProcessInstanceRequest>, I>>(object: I): CreateProcessInstanceRequest {
    const message = createBaseCreateProcessInstanceRequest();
    message.processDefinitionKey = object.processDefinitionKey ?? 0;
    message.bpmnProcessId = object.bpmnProcessId ?? "";
    message.version = object.version ?? 0;
    message.variables = object.variables ?? "";
    message.startInstructions =
      object.startInstructions?.map((e) => ProcessInstanceCreationStartInstruction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProcessInstanceCreationStartInstruction(): ProcessInstanceCreationStartInstruction {
  return { elementId: "" };
}

export const ProcessInstanceCreationStartInstruction = {
  encode(message: ProcessInstanceCreationStartInstruction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.elementId !== "") {
      writer.uint32(10).string(message.elementId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProcessInstanceCreationStartInstruction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessInstanceCreationStartInstruction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.elementId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProcessInstanceCreationStartInstruction {
    return { elementId: isSet(object.elementId) ? String(object.elementId) : "" };
  },

  toJSON(message: ProcessInstanceCreationStartInstruction): unknown {
    const obj: any = {};
    message.elementId !== undefined && (obj.elementId = message.elementId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ProcessInstanceCreationStartInstruction>, I>>(
    object: I,
  ): ProcessInstanceCreationStartInstruction {
    const message = createBaseProcessInstanceCreationStartInstruction();
    message.elementId = object.elementId ?? "";
    return message;
  },
};

function createBaseCreateProcessInstanceResponse(): CreateProcessInstanceResponse {
  return { processDefinitionKey: 0, bpmnProcessId: "", version: 0, processInstanceKey: 0 };
}

export const CreateProcessInstanceResponse = {
  encode(message: CreateProcessInstanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.processDefinitionKey !== 0) {
      writer.uint32(8).int64(message.processDefinitionKey);
    }
    if (message.bpmnProcessId !== "") {
      writer.uint32(18).string(message.bpmnProcessId);
    }
    if (message.version !== 0) {
      writer.uint32(24).int32(message.version);
    }
    if (message.processInstanceKey !== 0) {
      writer.uint32(32).int64(message.processInstanceKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProcessInstanceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProcessInstanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processDefinitionKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.bpmnProcessId = reader.string();
          break;
        case 3:
          message.version = reader.int32();
          break;
        case 4:
          message.processInstanceKey = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateProcessInstanceResponse {
    return {
      processDefinitionKey: isSet(object.processDefinitionKey) ? Number(object.processDefinitionKey) : 0,
      bpmnProcessId: isSet(object.bpmnProcessId) ? String(object.bpmnProcessId) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      processInstanceKey: isSet(object.processInstanceKey) ? Number(object.processInstanceKey) : 0,
    };
  },

  toJSON(message: CreateProcessInstanceResponse): unknown {
    const obj: any = {};
    message.processDefinitionKey !== undefined && (obj.processDefinitionKey = Math.round(message.processDefinitionKey));
    message.bpmnProcessId !== undefined && (obj.bpmnProcessId = message.bpmnProcessId);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.processInstanceKey !== undefined && (obj.processInstanceKey = Math.round(message.processInstanceKey));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateProcessInstanceResponse>, I>>(
    object: I,
  ): CreateProcessInstanceResponse {
    const message = createBaseCreateProcessInstanceResponse();
    message.processDefinitionKey = object.processDefinitionKey ?? 0;
    message.bpmnProcessId = object.bpmnProcessId ?? "";
    message.version = object.version ?? 0;
    message.processInstanceKey = object.processInstanceKey ?? 0;
    return message;
  },
};

function createBaseCreateProcessInstanceWithResultRequest(): CreateProcessInstanceWithResultRequest {
  return { request: undefined, requestTimeout: 0, fetchVariables: [] };
}

export const CreateProcessInstanceWithResultRequest = {
  encode(message: CreateProcessInstanceWithResultRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request !== undefined) {
      CreateProcessInstanceRequest.encode(message.request, writer.uint32(10).fork()).ldelim();
    }
    if (message.requestTimeout !== 0) {
      writer.uint32(16).int64(message.requestTimeout);
    }
    for (const v of message.fetchVariables) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProcessInstanceWithResultRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProcessInstanceWithResultRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.request = CreateProcessInstanceRequest.decode(reader, reader.uint32());
          break;
        case 2:
          message.requestTimeout = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.fetchVariables.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateProcessInstanceWithResultRequest {
    return {
      request: isSet(object.request) ? CreateProcessInstanceRequest.fromJSON(object.request) : undefined,
      requestTimeout: isSet(object.requestTimeout) ? Number(object.requestTimeout) : 0,
      fetchVariables: Array.isArray(object?.fetchVariables) ? object.fetchVariables.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: CreateProcessInstanceWithResultRequest): unknown {
    const obj: any = {};
    message.request !== undefined &&
      (obj.request = message.request ? CreateProcessInstanceRequest.toJSON(message.request) : undefined);
    message.requestTimeout !== undefined && (obj.requestTimeout = Math.round(message.requestTimeout));
    if (message.fetchVariables) {
      obj.fetchVariables = message.fetchVariables.map((e) => e);
    } else {
      obj.fetchVariables = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateProcessInstanceWithResultRequest>, I>>(
    object: I,
  ): CreateProcessInstanceWithResultRequest {
    const message = createBaseCreateProcessInstanceWithResultRequest();
    message.request = (object.request !== undefined && object.request !== null)
      ? CreateProcessInstanceRequest.fromPartial(object.request)
      : undefined;
    message.requestTimeout = object.requestTimeout ?? 0;
    message.fetchVariables = object.fetchVariables?.map((e) => e) || [];
    return message;
  },
};

function createBaseCreateProcessInstanceWithResultResponse(): CreateProcessInstanceWithResultResponse {
  return { processDefinitionKey: 0, bpmnProcessId: "", version: 0, processInstanceKey: 0, variables: "" };
}

export const CreateProcessInstanceWithResultResponse = {
  encode(message: CreateProcessInstanceWithResultResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.processDefinitionKey !== 0) {
      writer.uint32(8).int64(message.processDefinitionKey);
    }
    if (message.bpmnProcessId !== "") {
      writer.uint32(18).string(message.bpmnProcessId);
    }
    if (message.version !== 0) {
      writer.uint32(24).int32(message.version);
    }
    if (message.processInstanceKey !== 0) {
      writer.uint32(32).int64(message.processInstanceKey);
    }
    if (message.variables !== "") {
      writer.uint32(42).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProcessInstanceWithResultResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProcessInstanceWithResultResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processDefinitionKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.bpmnProcessId = reader.string();
          break;
        case 3:
          message.version = reader.int32();
          break;
        case 4:
          message.processInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateProcessInstanceWithResultResponse {
    return {
      processDefinitionKey: isSet(object.processDefinitionKey) ? Number(object.processDefinitionKey) : 0,
      bpmnProcessId: isSet(object.bpmnProcessId) ? String(object.bpmnProcessId) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      processInstanceKey: isSet(object.processInstanceKey) ? Number(object.processInstanceKey) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: CreateProcessInstanceWithResultResponse): unknown {
    const obj: any = {};
    message.processDefinitionKey !== undefined && (obj.processDefinitionKey = Math.round(message.processDefinitionKey));
    message.bpmnProcessId !== undefined && (obj.bpmnProcessId = message.bpmnProcessId);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.processInstanceKey !== undefined && (obj.processInstanceKey = Math.round(message.processInstanceKey));
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateProcessInstanceWithResultResponse>, I>>(
    object: I,
  ): CreateProcessInstanceWithResultResponse {
    const message = createBaseCreateProcessInstanceWithResultResponse();
    message.processDefinitionKey = object.processDefinitionKey ?? 0;
    message.bpmnProcessId = object.bpmnProcessId ?? "";
    message.version = object.version ?? 0;
    message.processInstanceKey = object.processInstanceKey ?? 0;
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBaseDeployProcessRequest(): DeployProcessRequest {
  return { processes: [] };
}

export const DeployProcessRequest = {
  encode(message: DeployProcessRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.processes) {
      ProcessRequestObject.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeployProcessRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeployProcessRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processes.push(ProcessRequestObject.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeployProcessRequest {
    return {
      processes: Array.isArray(object?.processes)
        ? object.processes.map((e: any) => ProcessRequestObject.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DeployProcessRequest): unknown {
    const obj: any = {};
    if (message.processes) {
      obj.processes = message.processes.map((e) => e ? ProcessRequestObject.toJSON(e) : undefined);
    } else {
      obj.processes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeployProcessRequest>, I>>(object: I): DeployProcessRequest {
    const message = createBaseDeployProcessRequest();
    message.processes = object.processes?.map((e) => ProcessRequestObject.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProcessRequestObject(): ProcessRequestObject {
  return { name: "", definition: Buffer.alloc(0) };
}

export const ProcessRequestObject = {
  encode(message: ProcessRequestObject, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.definition.length !== 0) {
      writer.uint32(18).bytes(message.definition);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProcessRequestObject {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessRequestObject();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.definition = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProcessRequestObject {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      definition: isSet(object.definition) ? Buffer.from(bytesFromBase64(object.definition)) : Buffer.alloc(0),
    };
  },

  toJSON(message: ProcessRequestObject): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.definition !== undefined &&
      (obj.definition = base64FromBytes(message.definition !== undefined ? message.definition : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ProcessRequestObject>, I>>(object: I): ProcessRequestObject {
    const message = createBaseProcessRequestObject();
    message.name = object.name ?? "";
    message.definition = object.definition ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseDeployProcessResponse(): DeployProcessResponse {
  return { key: 0, processes: [] };
}

export const DeployProcessResponse = {
  encode(message: DeployProcessResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int64(message.key);
    }
    for (const v of message.processes) {
      ProcessMetadata.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeployProcessResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeployProcessResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.processes.push(ProcessMetadata.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeployProcessResponse {
    return {
      key: isSet(object.key) ? Number(object.key) : 0,
      processes: Array.isArray(object?.processes) ? object.processes.map((e: any) => ProcessMetadata.fromJSON(e)) : [],
    };
  },

  toJSON(message: DeployProcessResponse): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = Math.round(message.key));
    if (message.processes) {
      obj.processes = message.processes.map((e) => e ? ProcessMetadata.toJSON(e) : undefined);
    } else {
      obj.processes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeployProcessResponse>, I>>(object: I): DeployProcessResponse {
    const message = createBaseDeployProcessResponse();
    message.key = object.key ?? 0;
    message.processes = object.processes?.map((e) => ProcessMetadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDeployResourceRequest(): DeployResourceRequest {
  return { resources: [] };
}

export const DeployResourceRequest = {
  encode(message: DeployResourceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.resources) {
      Resource.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeployResourceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeployResourceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.resources.push(Resource.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeployResourceRequest {
    return {
      resources: Array.isArray(object?.resources) ? object.resources.map((e: any) => Resource.fromJSON(e)) : [],
    };
  },

  toJSON(message: DeployResourceRequest): unknown {
    const obj: any = {};
    if (message.resources) {
      obj.resources = message.resources.map((e) => e ? Resource.toJSON(e) : undefined);
    } else {
      obj.resources = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeployResourceRequest>, I>>(object: I): DeployResourceRequest {
    const message = createBaseDeployResourceRequest();
    message.resources = object.resources?.map((e) => Resource.fromPartial(e)) || [];
    return message;
  },
};

function createBaseResource(): Resource {
  return { name: "", content: Buffer.alloc(0) };
}

export const Resource = {
  encode(message: Resource, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.content.length !== 0) {
      writer.uint32(18).bytes(message.content);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Resource {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResource();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.content = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Resource {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      content: isSet(object.content) ? Buffer.from(bytesFromBase64(object.content)) : Buffer.alloc(0),
    };
  },

  toJSON(message: Resource): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.content !== undefined &&
      (obj.content = base64FromBytes(message.content !== undefined ? message.content : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Resource>, I>>(object: I): Resource {
    const message = createBaseResource();
    message.name = object.name ?? "";
    message.content = object.content ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseDeployResourceResponse(): DeployResourceResponse {
  return { key: 0, deployments: [] };
}

export const DeployResourceResponse = {
  encode(message: DeployResourceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int64(message.key);
    }
    for (const v of message.deployments) {
      Deployment.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeployResourceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeployResourceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.deployments.push(Deployment.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeployResourceResponse {
    return {
      key: isSet(object.key) ? Number(object.key) : 0,
      deployments: Array.isArray(object?.deployments) ? object.deployments.map((e: any) => Deployment.fromJSON(e)) : [],
    };
  },

  toJSON(message: DeployResourceResponse): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = Math.round(message.key));
    if (message.deployments) {
      obj.deployments = message.deployments.map((e) => e ? Deployment.toJSON(e) : undefined);
    } else {
      obj.deployments = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeployResourceResponse>, I>>(object: I): DeployResourceResponse {
    const message = createBaseDeployResourceResponse();
    message.key = object.key ?? 0;
    message.deployments = object.deployments?.map((e) => Deployment.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDeployment(): Deployment {
  return { process: undefined, decision: undefined, decisionRequirements: undefined };
}

export const Deployment = {
  encode(message: Deployment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.process !== undefined) {
      ProcessMetadata.encode(message.process, writer.uint32(10).fork()).ldelim();
    }
    if (message.decision !== undefined) {
      DecisionMetadata.encode(message.decision, writer.uint32(18).fork()).ldelim();
    }
    if (message.decisionRequirements !== undefined) {
      DecisionRequirementsMetadata.encode(message.decisionRequirements, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Deployment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeployment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.process = ProcessMetadata.decode(reader, reader.uint32());
          break;
        case 2:
          message.decision = DecisionMetadata.decode(reader, reader.uint32());
          break;
        case 3:
          message.decisionRequirements = DecisionRequirementsMetadata.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Deployment {
    return {
      process: isSet(object.process) ? ProcessMetadata.fromJSON(object.process) : undefined,
      decision: isSet(object.decision) ? DecisionMetadata.fromJSON(object.decision) : undefined,
      decisionRequirements: isSet(object.decisionRequirements)
        ? DecisionRequirementsMetadata.fromJSON(object.decisionRequirements)
        : undefined,
    };
  },

  toJSON(message: Deployment): unknown {
    const obj: any = {};
    message.process !== undefined &&
      (obj.process = message.process ? ProcessMetadata.toJSON(message.process) : undefined);
    message.decision !== undefined &&
      (obj.decision = message.decision ? DecisionMetadata.toJSON(message.decision) : undefined);
    message.decisionRequirements !== undefined && (obj.decisionRequirements = message.decisionRequirements
      ? DecisionRequirementsMetadata.toJSON(message.decisionRequirements)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Deployment>, I>>(object: I): Deployment {
    const message = createBaseDeployment();
    message.process = (object.process !== undefined && object.process !== null)
      ? ProcessMetadata.fromPartial(object.process)
      : undefined;
    message.decision = (object.decision !== undefined && object.decision !== null)
      ? DecisionMetadata.fromPartial(object.decision)
      : undefined;
    message.decisionRequirements = (object.decisionRequirements !== undefined && object.decisionRequirements !== null)
      ? DecisionRequirementsMetadata.fromPartial(object.decisionRequirements)
      : undefined;
    return message;
  },
};

function createBaseProcessMetadata(): ProcessMetadata {
  return { bpmnProcessId: "", version: 0, processDefinitionKey: 0, resourceName: "" };
}

export const ProcessMetadata = {
  encode(message: ProcessMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bpmnProcessId !== "") {
      writer.uint32(10).string(message.bpmnProcessId);
    }
    if (message.version !== 0) {
      writer.uint32(16).int32(message.version);
    }
    if (message.processDefinitionKey !== 0) {
      writer.uint32(24).int64(message.processDefinitionKey);
    }
    if (message.resourceName !== "") {
      writer.uint32(34).string(message.resourceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProcessMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bpmnProcessId = reader.string();
          break;
        case 2:
          message.version = reader.int32();
          break;
        case 3:
          message.processDefinitionKey = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.resourceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProcessMetadata {
    return {
      bpmnProcessId: isSet(object.bpmnProcessId) ? String(object.bpmnProcessId) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      processDefinitionKey: isSet(object.processDefinitionKey) ? Number(object.processDefinitionKey) : 0,
      resourceName: isSet(object.resourceName) ? String(object.resourceName) : "",
    };
  },

  toJSON(message: ProcessMetadata): unknown {
    const obj: any = {};
    message.bpmnProcessId !== undefined && (obj.bpmnProcessId = message.bpmnProcessId);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.processDefinitionKey !== undefined && (obj.processDefinitionKey = Math.round(message.processDefinitionKey));
    message.resourceName !== undefined && (obj.resourceName = message.resourceName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ProcessMetadata>, I>>(object: I): ProcessMetadata {
    const message = createBaseProcessMetadata();
    message.bpmnProcessId = object.bpmnProcessId ?? "";
    message.version = object.version ?? 0;
    message.processDefinitionKey = object.processDefinitionKey ?? 0;
    message.resourceName = object.resourceName ?? "";
    return message;
  },
};

function createBaseDecisionMetadata(): DecisionMetadata {
  return {
    dmnDecisionId: "",
    dmnDecisionName: "",
    version: 0,
    decisionKey: 0,
    dmnDecisionRequirementsId: "",
    decisionRequirementsKey: 0,
  };
}

export const DecisionMetadata = {
  encode(message: DecisionMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dmnDecisionId !== "") {
      writer.uint32(10).string(message.dmnDecisionId);
    }
    if (message.dmnDecisionName !== "") {
      writer.uint32(18).string(message.dmnDecisionName);
    }
    if (message.version !== 0) {
      writer.uint32(24).int32(message.version);
    }
    if (message.decisionKey !== 0) {
      writer.uint32(32).int64(message.decisionKey);
    }
    if (message.dmnDecisionRequirementsId !== "") {
      writer.uint32(42).string(message.dmnDecisionRequirementsId);
    }
    if (message.decisionRequirementsKey !== 0) {
      writer.uint32(48).int64(message.decisionRequirementsKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecisionMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecisionMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmnDecisionId = reader.string();
          break;
        case 2:
          message.dmnDecisionName = reader.string();
          break;
        case 3:
          message.version = reader.int32();
          break;
        case 4:
          message.decisionKey = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.dmnDecisionRequirementsId = reader.string();
          break;
        case 6:
          message.decisionRequirementsKey = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DecisionMetadata {
    return {
      dmnDecisionId: isSet(object.dmnDecisionId) ? String(object.dmnDecisionId) : "",
      dmnDecisionName: isSet(object.dmnDecisionName) ? String(object.dmnDecisionName) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      decisionKey: isSet(object.decisionKey) ? Number(object.decisionKey) : 0,
      dmnDecisionRequirementsId: isSet(object.dmnDecisionRequirementsId)
        ? String(object.dmnDecisionRequirementsId)
        : "",
      decisionRequirementsKey: isSet(object.decisionRequirementsKey) ? Number(object.decisionRequirementsKey) : 0,
    };
  },

  toJSON(message: DecisionMetadata): unknown {
    const obj: any = {};
    message.dmnDecisionId !== undefined && (obj.dmnDecisionId = message.dmnDecisionId);
    message.dmnDecisionName !== undefined && (obj.dmnDecisionName = message.dmnDecisionName);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.decisionKey !== undefined && (obj.decisionKey = Math.round(message.decisionKey));
    message.dmnDecisionRequirementsId !== undefined &&
      (obj.dmnDecisionRequirementsId = message.dmnDecisionRequirementsId);
    message.decisionRequirementsKey !== undefined &&
      (obj.decisionRequirementsKey = Math.round(message.decisionRequirementsKey));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DecisionMetadata>, I>>(object: I): DecisionMetadata {
    const message = createBaseDecisionMetadata();
    message.dmnDecisionId = object.dmnDecisionId ?? "";
    message.dmnDecisionName = object.dmnDecisionName ?? "";
    message.version = object.version ?? 0;
    message.decisionKey = object.decisionKey ?? 0;
    message.dmnDecisionRequirementsId = object.dmnDecisionRequirementsId ?? "";
    message.decisionRequirementsKey = object.decisionRequirementsKey ?? 0;
    return message;
  },
};

function createBaseDecisionRequirementsMetadata(): DecisionRequirementsMetadata {
  return {
    dmnDecisionRequirementsId: "",
    dmnDecisionRequirementsName: "",
    version: 0,
    decisionRequirementsKey: 0,
    resourceName: "",
  };
}

export const DecisionRequirementsMetadata = {
  encode(message: DecisionRequirementsMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dmnDecisionRequirementsId !== "") {
      writer.uint32(10).string(message.dmnDecisionRequirementsId);
    }
    if (message.dmnDecisionRequirementsName !== "") {
      writer.uint32(18).string(message.dmnDecisionRequirementsName);
    }
    if (message.version !== 0) {
      writer.uint32(24).int32(message.version);
    }
    if (message.decisionRequirementsKey !== 0) {
      writer.uint32(32).int64(message.decisionRequirementsKey);
    }
    if (message.resourceName !== "") {
      writer.uint32(42).string(message.resourceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecisionRequirementsMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecisionRequirementsMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmnDecisionRequirementsId = reader.string();
          break;
        case 2:
          message.dmnDecisionRequirementsName = reader.string();
          break;
        case 3:
          message.version = reader.int32();
          break;
        case 4:
          message.decisionRequirementsKey = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.resourceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DecisionRequirementsMetadata {
    return {
      dmnDecisionRequirementsId: isSet(object.dmnDecisionRequirementsId)
        ? String(object.dmnDecisionRequirementsId)
        : "",
      dmnDecisionRequirementsName: isSet(object.dmnDecisionRequirementsName)
        ? String(object.dmnDecisionRequirementsName)
        : "",
      version: isSet(object.version) ? Number(object.version) : 0,
      decisionRequirementsKey: isSet(object.decisionRequirementsKey) ? Number(object.decisionRequirementsKey) : 0,
      resourceName: isSet(object.resourceName) ? String(object.resourceName) : "",
    };
  },

  toJSON(message: DecisionRequirementsMetadata): unknown {
    const obj: any = {};
    message.dmnDecisionRequirementsId !== undefined &&
      (obj.dmnDecisionRequirementsId = message.dmnDecisionRequirementsId);
    message.dmnDecisionRequirementsName !== undefined &&
      (obj.dmnDecisionRequirementsName = message.dmnDecisionRequirementsName);
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.decisionRequirementsKey !== undefined &&
      (obj.decisionRequirementsKey = Math.round(message.decisionRequirementsKey));
    message.resourceName !== undefined && (obj.resourceName = message.resourceName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DecisionRequirementsMetadata>, I>>(object: I): DecisionRequirementsMetadata {
    const message = createBaseDecisionRequirementsMetadata();
    message.dmnDecisionRequirementsId = object.dmnDecisionRequirementsId ?? "";
    message.dmnDecisionRequirementsName = object.dmnDecisionRequirementsName ?? "";
    message.version = object.version ?? 0;
    message.decisionRequirementsKey = object.decisionRequirementsKey ?? 0;
    message.resourceName = object.resourceName ?? "";
    return message;
  },
};

function createBaseFailJobRequest(): FailJobRequest {
  return { jobKey: 0, retries: 0, errorMessage: "", retryBackOff: 0, variables: "" };
}

export const FailJobRequest = {
  encode(message: FailJobRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.jobKey !== 0) {
      writer.uint32(8).int64(message.jobKey);
    }
    if (message.retries !== 0) {
      writer.uint32(16).int32(message.retries);
    }
    if (message.errorMessage !== "") {
      writer.uint32(26).string(message.errorMessage);
    }
    if (message.retryBackOff !== 0) {
      writer.uint32(32).int64(message.retryBackOff);
    }
    if (message.variables !== "") {
      writer.uint32(42).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FailJobRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFailJobRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.retries = reader.int32();
          break;
        case 3:
          message.errorMessage = reader.string();
          break;
        case 4:
          message.retryBackOff = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FailJobRequest {
    return {
      jobKey: isSet(object.jobKey) ? Number(object.jobKey) : 0,
      retries: isSet(object.retries) ? Number(object.retries) : 0,
      errorMessage: isSet(object.errorMessage) ? String(object.errorMessage) : "",
      retryBackOff: isSet(object.retryBackOff) ? Number(object.retryBackOff) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: FailJobRequest): unknown {
    const obj: any = {};
    message.jobKey !== undefined && (obj.jobKey = Math.round(message.jobKey));
    message.retries !== undefined && (obj.retries = Math.round(message.retries));
    message.errorMessage !== undefined && (obj.errorMessage = message.errorMessage);
    message.retryBackOff !== undefined && (obj.retryBackOff = Math.round(message.retryBackOff));
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FailJobRequest>, I>>(object: I): FailJobRequest {
    const message = createBaseFailJobRequest();
    message.jobKey = object.jobKey ?? 0;
    message.retries = object.retries ?? 0;
    message.errorMessage = object.errorMessage ?? "";
    message.retryBackOff = object.retryBackOff ?? 0;
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBaseFailJobResponse(): FailJobResponse {
  return {};
}

export const FailJobResponse = {
  encode(_: FailJobResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FailJobResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFailJobResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): FailJobResponse {
    return {};
  },

  toJSON(_: FailJobResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FailJobResponse>, I>>(_: I): FailJobResponse {
    const message = createBaseFailJobResponse();
    return message;
  },
};

function createBaseThrowErrorRequest(): ThrowErrorRequest {
  return { jobKey: 0, errorCode: "", errorMessage: "", variables: "" };
}

export const ThrowErrorRequest = {
  encode(message: ThrowErrorRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.jobKey !== 0) {
      writer.uint32(8).int64(message.jobKey);
    }
    if (message.errorCode !== "") {
      writer.uint32(18).string(message.errorCode);
    }
    if (message.errorMessage !== "") {
      writer.uint32(26).string(message.errorMessage);
    }
    if (message.variables !== "") {
      writer.uint32(34).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ThrowErrorRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThrowErrorRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.errorCode = reader.string();
          break;
        case 3:
          message.errorMessage = reader.string();
          break;
        case 4:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ThrowErrorRequest {
    return {
      jobKey: isSet(object.jobKey) ? Number(object.jobKey) : 0,
      errorCode: isSet(object.errorCode) ? String(object.errorCode) : "",
      errorMessage: isSet(object.errorMessage) ? String(object.errorMessage) : "",
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: ThrowErrorRequest): unknown {
    const obj: any = {};
    message.jobKey !== undefined && (obj.jobKey = Math.round(message.jobKey));
    message.errorCode !== undefined && (obj.errorCode = message.errorCode);
    message.errorMessage !== undefined && (obj.errorMessage = message.errorMessage);
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ThrowErrorRequest>, I>>(object: I): ThrowErrorRequest {
    const message = createBaseThrowErrorRequest();
    message.jobKey = object.jobKey ?? 0;
    message.errorCode = object.errorCode ?? "";
    message.errorMessage = object.errorMessage ?? "";
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBaseThrowErrorResponse(): ThrowErrorResponse {
  return {};
}

export const ThrowErrorResponse = {
  encode(_: ThrowErrorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ThrowErrorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThrowErrorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ThrowErrorResponse {
    return {};
  },

  toJSON(_: ThrowErrorResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ThrowErrorResponse>, I>>(_: I): ThrowErrorResponse {
    const message = createBaseThrowErrorResponse();
    return message;
  },
};

function createBasePublishMessageRequest(): PublishMessageRequest {
  return { name: "", correlationKey: "", timeToLive: 0, messageId: "", variables: "" };
}

export const PublishMessageRequest = {
  encode(message: PublishMessageRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.correlationKey !== "") {
      writer.uint32(18).string(message.correlationKey);
    }
    if (message.timeToLive !== 0) {
      writer.uint32(24).int64(message.timeToLive);
    }
    if (message.messageId !== "") {
      writer.uint32(34).string(message.messageId);
    }
    if (message.variables !== "") {
      writer.uint32(42).string(message.variables);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublishMessageRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublishMessageRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.correlationKey = reader.string();
          break;
        case 3:
          message.timeToLive = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.messageId = reader.string();
          break;
        case 5:
          message.variables = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PublishMessageRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      correlationKey: isSet(object.correlationKey) ? String(object.correlationKey) : "",
      timeToLive: isSet(object.timeToLive) ? Number(object.timeToLive) : 0,
      messageId: isSet(object.messageId) ? String(object.messageId) : "",
      variables: isSet(object.variables) ? String(object.variables) : "",
    };
  },

  toJSON(message: PublishMessageRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.correlationKey !== undefined && (obj.correlationKey = message.correlationKey);
    message.timeToLive !== undefined && (obj.timeToLive = Math.round(message.timeToLive));
    message.messageId !== undefined && (obj.messageId = message.messageId);
    message.variables !== undefined && (obj.variables = message.variables);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PublishMessageRequest>, I>>(object: I): PublishMessageRequest {
    const message = createBasePublishMessageRequest();
    message.name = object.name ?? "";
    message.correlationKey = object.correlationKey ?? "";
    message.timeToLive = object.timeToLive ?? 0;
    message.messageId = object.messageId ?? "";
    message.variables = object.variables ?? "";
    return message;
  },
};

function createBasePublishMessageResponse(): PublishMessageResponse {
  return { key: 0 };
}

export const PublishMessageResponse = {
  encode(message: PublishMessageResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int64(message.key);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublishMessageResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublishMessageResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PublishMessageResponse {
    return { key: isSet(object.key) ? Number(object.key) : 0 };
  },

  toJSON(message: PublishMessageResponse): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = Math.round(message.key));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PublishMessageResponse>, I>>(object: I): PublishMessageResponse {
    const message = createBasePublishMessageResponse();
    message.key = object.key ?? 0;
    return message;
  },
};

function createBaseResolveIncidentRequest(): ResolveIncidentRequest {
  return { incidentKey: 0 };
}

export const ResolveIncidentRequest = {
  encode(message: ResolveIncidentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.incidentKey !== 0) {
      writer.uint32(8).int64(message.incidentKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResolveIncidentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResolveIncidentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.incidentKey = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResolveIncidentRequest {
    return { incidentKey: isSet(object.incidentKey) ? Number(object.incidentKey) : 0 };
  },

  toJSON(message: ResolveIncidentRequest): unknown {
    const obj: any = {};
    message.incidentKey !== undefined && (obj.incidentKey = Math.round(message.incidentKey));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResolveIncidentRequest>, I>>(object: I): ResolveIncidentRequest {
    const message = createBaseResolveIncidentRequest();
    message.incidentKey = object.incidentKey ?? 0;
    return message;
  },
};

function createBaseResolveIncidentResponse(): ResolveIncidentResponse {
  return {};
}

export const ResolveIncidentResponse = {
  encode(_: ResolveIncidentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResolveIncidentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResolveIncidentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ResolveIncidentResponse {
    return {};
  },

  toJSON(_: ResolveIncidentResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResolveIncidentResponse>, I>>(_: I): ResolveIncidentResponse {
    const message = createBaseResolveIncidentResponse();
    return message;
  },
};

function createBaseTopologyRequest(): TopologyRequest {
  return {};
}

export const TopologyRequest = {
  encode(_: TopologyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TopologyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopologyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): TopologyRequest {
    return {};
  },

  toJSON(_: TopologyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TopologyRequest>, I>>(_: I): TopologyRequest {
    const message = createBaseTopologyRequest();
    return message;
  },
};

function createBaseTopologyResponse(): TopologyResponse {
  return { brokers: [], clusterSize: 0, partitionsCount: 0, replicationFactor: 0, gatewayVersion: "" };
}

export const TopologyResponse = {
  encode(message: TopologyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.brokers) {
      BrokerInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.clusterSize !== 0) {
      writer.uint32(16).int32(message.clusterSize);
    }
    if (message.partitionsCount !== 0) {
      writer.uint32(24).int32(message.partitionsCount);
    }
    if (message.replicationFactor !== 0) {
      writer.uint32(32).int32(message.replicationFactor);
    }
    if (message.gatewayVersion !== "") {
      writer.uint32(42).string(message.gatewayVersion);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TopologyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopologyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.brokers.push(BrokerInfo.decode(reader, reader.uint32()));
          break;
        case 2:
          message.clusterSize = reader.int32();
          break;
        case 3:
          message.partitionsCount = reader.int32();
          break;
        case 4:
          message.replicationFactor = reader.int32();
          break;
        case 5:
          message.gatewayVersion = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TopologyResponse {
    return {
      brokers: Array.isArray(object?.brokers) ? object.brokers.map((e: any) => BrokerInfo.fromJSON(e)) : [],
      clusterSize: isSet(object.clusterSize) ? Number(object.clusterSize) : 0,
      partitionsCount: isSet(object.partitionsCount) ? Number(object.partitionsCount) : 0,
      replicationFactor: isSet(object.replicationFactor) ? Number(object.replicationFactor) : 0,
      gatewayVersion: isSet(object.gatewayVersion) ? String(object.gatewayVersion) : "",
    };
  },

  toJSON(message: TopologyResponse): unknown {
    const obj: any = {};
    if (message.brokers) {
      obj.brokers = message.brokers.map((e) => e ? BrokerInfo.toJSON(e) : undefined);
    } else {
      obj.brokers = [];
    }
    message.clusterSize !== undefined && (obj.clusterSize = Math.round(message.clusterSize));
    message.partitionsCount !== undefined && (obj.partitionsCount = Math.round(message.partitionsCount));
    message.replicationFactor !== undefined && (obj.replicationFactor = Math.round(message.replicationFactor));
    message.gatewayVersion !== undefined && (obj.gatewayVersion = message.gatewayVersion);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TopologyResponse>, I>>(object: I): TopologyResponse {
    const message = createBaseTopologyResponse();
    message.brokers = object.brokers?.map((e) => BrokerInfo.fromPartial(e)) || [];
    message.clusterSize = object.clusterSize ?? 0;
    message.partitionsCount = object.partitionsCount ?? 0;
    message.replicationFactor = object.replicationFactor ?? 0;
    message.gatewayVersion = object.gatewayVersion ?? "";
    return message;
  },
};

function createBaseBrokerInfo(): BrokerInfo {
  return { nodeId: 0, host: "", port: 0, partitions: [], version: "" };
}

export const BrokerInfo = {
  encode(message: BrokerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nodeId !== 0) {
      writer.uint32(8).int32(message.nodeId);
    }
    if (message.host !== "") {
      writer.uint32(18).string(message.host);
    }
    if (message.port !== 0) {
      writer.uint32(24).int32(message.port);
    }
    for (const v of message.partitions) {
      Partition.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.version !== "") {
      writer.uint32(42).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BrokerInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBrokerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodeId = reader.int32();
          break;
        case 2:
          message.host = reader.string();
          break;
        case 3:
          message.port = reader.int32();
          break;
        case 4:
          message.partitions.push(Partition.decode(reader, reader.uint32()));
          break;
        case 5:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BrokerInfo {
    return {
      nodeId: isSet(object.nodeId) ? Number(object.nodeId) : 0,
      host: isSet(object.host) ? String(object.host) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      partitions: Array.isArray(object?.partitions) ? object.partitions.map((e: any) => Partition.fromJSON(e)) : [],
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: BrokerInfo): unknown {
    const obj: any = {};
    message.nodeId !== undefined && (obj.nodeId = Math.round(message.nodeId));
    message.host !== undefined && (obj.host = message.host);
    message.port !== undefined && (obj.port = Math.round(message.port));
    if (message.partitions) {
      obj.partitions = message.partitions.map((e) => e ? Partition.toJSON(e) : undefined);
    } else {
      obj.partitions = [];
    }
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BrokerInfo>, I>>(object: I): BrokerInfo {
    const message = createBaseBrokerInfo();
    message.nodeId = object.nodeId ?? 0;
    message.host = object.host ?? "";
    message.port = object.port ?? 0;
    message.partitions = object.partitions?.map((e) => Partition.fromPartial(e)) || [];
    message.version = object.version ?? "";
    return message;
  },
};

function createBasePartition(): Partition {
  return { partitionId: 0, role: 0, health: 0 };
}

export const Partition = {
  encode(message: Partition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.partitionId !== 0) {
      writer.uint32(8).int32(message.partitionId);
    }
    if (message.role !== 0) {
      writer.uint32(16).int32(message.role);
    }
    if (message.health !== 0) {
      writer.uint32(24).int32(message.health);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Partition {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePartition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.partitionId = reader.int32();
          break;
        case 2:
          message.role = reader.int32() as any;
          break;
        case 3:
          message.health = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Partition {
    return {
      partitionId: isSet(object.partitionId) ? Number(object.partitionId) : 0,
      role: isSet(object.role) ? partition_PartitionBrokerRoleFromJSON(object.role) : 0,
      health: isSet(object.health) ? partition_PartitionBrokerHealthFromJSON(object.health) : 0,
    };
  },

  toJSON(message: Partition): unknown {
    const obj: any = {};
    message.partitionId !== undefined && (obj.partitionId = Math.round(message.partitionId));
    message.role !== undefined && (obj.role = partition_PartitionBrokerRoleToJSON(message.role));
    message.health !== undefined && (obj.health = partition_PartitionBrokerHealthToJSON(message.health));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Partition>, I>>(object: I): Partition {
    const message = createBasePartition();
    message.partitionId = object.partitionId ?? 0;
    message.role = object.role ?? 0;
    message.health = object.health ?? 0;
    return message;
  },
};

function createBaseUpdateJobRetriesRequest(): UpdateJobRetriesRequest {
  return { jobKey: 0, retries: 0 };
}

export const UpdateJobRetriesRequest = {
  encode(message: UpdateJobRetriesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.jobKey !== 0) {
      writer.uint32(8).int64(message.jobKey);
    }
    if (message.retries !== 0) {
      writer.uint32(16).int32(message.retries);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateJobRetriesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateJobRetriesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jobKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.retries = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateJobRetriesRequest {
    return {
      jobKey: isSet(object.jobKey) ? Number(object.jobKey) : 0,
      retries: isSet(object.retries) ? Number(object.retries) : 0,
    };
  },

  toJSON(message: UpdateJobRetriesRequest): unknown {
    const obj: any = {};
    message.jobKey !== undefined && (obj.jobKey = Math.round(message.jobKey));
    message.retries !== undefined && (obj.retries = Math.round(message.retries));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateJobRetriesRequest>, I>>(object: I): UpdateJobRetriesRequest {
    const message = createBaseUpdateJobRetriesRequest();
    message.jobKey = object.jobKey ?? 0;
    message.retries = object.retries ?? 0;
    return message;
  },
};

function createBaseUpdateJobRetriesResponse(): UpdateJobRetriesResponse {
  return {};
}

export const UpdateJobRetriesResponse = {
  encode(_: UpdateJobRetriesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateJobRetriesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateJobRetriesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateJobRetriesResponse {
    return {};
  },

  toJSON(_: UpdateJobRetriesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateJobRetriesResponse>, I>>(_: I): UpdateJobRetriesResponse {
    const message = createBaseUpdateJobRetriesResponse();
    return message;
  },
};

function createBaseSetVariablesRequest(): SetVariablesRequest {
  return { elementInstanceKey: 0, variables: "", local: false };
}

export const SetVariablesRequest = {
  encode(message: SetVariablesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.elementInstanceKey !== 0) {
      writer.uint32(8).int64(message.elementInstanceKey);
    }
    if (message.variables !== "") {
      writer.uint32(18).string(message.variables);
    }
    if (message.local === true) {
      writer.uint32(24).bool(message.local);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetVariablesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetVariablesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.elementInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.variables = reader.string();
          break;
        case 3:
          message.local = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SetVariablesRequest {
    return {
      elementInstanceKey: isSet(object.elementInstanceKey) ? Number(object.elementInstanceKey) : 0,
      variables: isSet(object.variables) ? String(object.variables) : "",
      local: isSet(object.local) ? Boolean(object.local) : false,
    };
  },

  toJSON(message: SetVariablesRequest): unknown {
    const obj: any = {};
    message.elementInstanceKey !== undefined && (obj.elementInstanceKey = Math.round(message.elementInstanceKey));
    message.variables !== undefined && (obj.variables = message.variables);
    message.local !== undefined && (obj.local = message.local);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SetVariablesRequest>, I>>(object: I): SetVariablesRequest {
    const message = createBaseSetVariablesRequest();
    message.elementInstanceKey = object.elementInstanceKey ?? 0;
    message.variables = object.variables ?? "";
    message.local = object.local ?? false;
    return message;
  },
};

function createBaseSetVariablesResponse(): SetVariablesResponse {
  return { key: 0 };
}

export const SetVariablesResponse = {
  encode(message: SetVariablesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).int64(message.key);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetVariablesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetVariablesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SetVariablesResponse {
    return { key: isSet(object.key) ? Number(object.key) : 0 };
  },

  toJSON(message: SetVariablesResponse): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = Math.round(message.key));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SetVariablesResponse>, I>>(object: I): SetVariablesResponse {
    const message = createBaseSetVariablesResponse();
    message.key = object.key ?? 0;
    return message;
  },
};

function createBaseModifyProcessInstanceRequest(): ModifyProcessInstanceRequest {
  return { processInstanceKey: 0, activateInstructions: [], terminateInstructions: [] };
}

export const ModifyProcessInstanceRequest = {
  encode(message: ModifyProcessInstanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.processInstanceKey !== 0) {
      writer.uint32(8).int64(message.processInstanceKey);
    }
    for (const v of message.activateInstructions) {
      ModifyProcessInstanceRequest_ActivateInstruction.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.terminateInstructions) {
      ModifyProcessInstanceRequest_TerminateInstruction.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModifyProcessInstanceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModifyProcessInstanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.processInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.activateInstructions.push(
            ModifyProcessInstanceRequest_ActivateInstruction.decode(reader, reader.uint32()),
          );
          break;
        case 3:
          message.terminateInstructions.push(
            ModifyProcessInstanceRequest_TerminateInstruction.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ModifyProcessInstanceRequest {
    return {
      processInstanceKey: isSet(object.processInstanceKey) ? Number(object.processInstanceKey) : 0,
      activateInstructions: Array.isArray(object?.activateInstructions)
        ? object.activateInstructions.map((e: any) => ModifyProcessInstanceRequest_ActivateInstruction.fromJSON(e))
        : [],
      terminateInstructions: Array.isArray(object?.terminateInstructions)
        ? object.terminateInstructions.map((e: any) => ModifyProcessInstanceRequest_TerminateInstruction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ModifyProcessInstanceRequest): unknown {
    const obj: any = {};
    message.processInstanceKey !== undefined && (obj.processInstanceKey = Math.round(message.processInstanceKey));
    if (message.activateInstructions) {
      obj.activateInstructions = message.activateInstructions.map((e) =>
        e ? ModifyProcessInstanceRequest_ActivateInstruction.toJSON(e) : undefined
      );
    } else {
      obj.activateInstructions = [];
    }
    if (message.terminateInstructions) {
      obj.terminateInstructions = message.terminateInstructions.map((e) =>
        e ? ModifyProcessInstanceRequest_TerminateInstruction.toJSON(e) : undefined
      );
    } else {
      obj.terminateInstructions = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModifyProcessInstanceRequest>, I>>(object: I): ModifyProcessInstanceRequest {
    const message = createBaseModifyProcessInstanceRequest();
    message.processInstanceKey = object.processInstanceKey ?? 0;
    message.activateInstructions =
      object.activateInstructions?.map((e) => ModifyProcessInstanceRequest_ActivateInstruction.fromPartial(e)) || [];
    message.terminateInstructions =
      object.terminateInstructions?.map((e) => ModifyProcessInstanceRequest_TerminateInstruction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseModifyProcessInstanceRequest_ActivateInstruction(): ModifyProcessInstanceRequest_ActivateInstruction {
  return { elementId: "", ancestorElementInstanceKey: 0, variableInstructions: [] };
}

export const ModifyProcessInstanceRequest_ActivateInstruction = {
  encode(
    message: ModifyProcessInstanceRequest_ActivateInstruction,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.elementId !== "") {
      writer.uint32(10).string(message.elementId);
    }
    if (message.ancestorElementInstanceKey !== 0) {
      writer.uint32(16).int64(message.ancestorElementInstanceKey);
    }
    for (const v of message.variableInstructions) {
      ModifyProcessInstanceRequest_VariableInstruction.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModifyProcessInstanceRequest_ActivateInstruction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModifyProcessInstanceRequest_ActivateInstruction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.elementId = reader.string();
          break;
        case 2:
          message.ancestorElementInstanceKey = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.variableInstructions.push(
            ModifyProcessInstanceRequest_VariableInstruction.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ModifyProcessInstanceRequest_ActivateInstruction {
    return {
      elementId: isSet(object.elementId) ? String(object.elementId) : "",
      ancestorElementInstanceKey: isSet(object.ancestorElementInstanceKey)
        ? Number(object.ancestorElementInstanceKey)
        : 0,
      variableInstructions: Array.isArray(object?.variableInstructions)
        ? object.variableInstructions.map((e: any) => ModifyProcessInstanceRequest_VariableInstruction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ModifyProcessInstanceRequest_ActivateInstruction): unknown {
    const obj: any = {};
    message.elementId !== undefined && (obj.elementId = message.elementId);
    message.ancestorElementInstanceKey !== undefined &&
      (obj.ancestorElementInstanceKey = Math.round(message.ancestorElementInstanceKey));
    if (message.variableInstructions) {
      obj.variableInstructions = message.variableInstructions.map((e) =>
        e ? ModifyProcessInstanceRequest_VariableInstruction.toJSON(e) : undefined
      );
    } else {
      obj.variableInstructions = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModifyProcessInstanceRequest_ActivateInstruction>, I>>(
    object: I,
  ): ModifyProcessInstanceRequest_ActivateInstruction {
    const message = createBaseModifyProcessInstanceRequest_ActivateInstruction();
    message.elementId = object.elementId ?? "";
    message.ancestorElementInstanceKey = object.ancestorElementInstanceKey ?? 0;
    message.variableInstructions =
      object.variableInstructions?.map((e) => ModifyProcessInstanceRequest_VariableInstruction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseModifyProcessInstanceRequest_VariableInstruction(): ModifyProcessInstanceRequest_VariableInstruction {
  return { variables: "", scopeId: "" };
}

export const ModifyProcessInstanceRequest_VariableInstruction = {
  encode(
    message: ModifyProcessInstanceRequest_VariableInstruction,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.variables !== "") {
      writer.uint32(10).string(message.variables);
    }
    if (message.scopeId !== "") {
      writer.uint32(18).string(message.scopeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModifyProcessInstanceRequest_VariableInstruction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModifyProcessInstanceRequest_VariableInstruction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.variables = reader.string();
          break;
        case 2:
          message.scopeId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ModifyProcessInstanceRequest_VariableInstruction {
    return {
      variables: isSet(object.variables) ? String(object.variables) : "",
      scopeId: isSet(object.scopeId) ? String(object.scopeId) : "",
    };
  },

  toJSON(message: ModifyProcessInstanceRequest_VariableInstruction): unknown {
    const obj: any = {};
    message.variables !== undefined && (obj.variables = message.variables);
    message.scopeId !== undefined && (obj.scopeId = message.scopeId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModifyProcessInstanceRequest_VariableInstruction>, I>>(
    object: I,
  ): ModifyProcessInstanceRequest_VariableInstruction {
    const message = createBaseModifyProcessInstanceRequest_VariableInstruction();
    message.variables = object.variables ?? "";
    message.scopeId = object.scopeId ?? "";
    return message;
  },
};

function createBaseModifyProcessInstanceRequest_TerminateInstruction(): ModifyProcessInstanceRequest_TerminateInstruction {
  return { elementInstanceKey: 0 };
}

export const ModifyProcessInstanceRequest_TerminateInstruction = {
  encode(
    message: ModifyProcessInstanceRequest_TerminateInstruction,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.elementInstanceKey !== 0) {
      writer.uint32(8).int64(message.elementInstanceKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModifyProcessInstanceRequest_TerminateInstruction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModifyProcessInstanceRequest_TerminateInstruction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.elementInstanceKey = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ModifyProcessInstanceRequest_TerminateInstruction {
    return { elementInstanceKey: isSet(object.elementInstanceKey) ? Number(object.elementInstanceKey) : 0 };
  },

  toJSON(message: ModifyProcessInstanceRequest_TerminateInstruction): unknown {
    const obj: any = {};
    message.elementInstanceKey !== undefined && (obj.elementInstanceKey = Math.round(message.elementInstanceKey));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModifyProcessInstanceRequest_TerminateInstruction>, I>>(
    object: I,
  ): ModifyProcessInstanceRequest_TerminateInstruction {
    const message = createBaseModifyProcessInstanceRequest_TerminateInstruction();
    message.elementInstanceKey = object.elementInstanceKey ?? 0;
    return message;
  },
};

function createBaseModifyProcessInstanceResponse(): ModifyProcessInstanceResponse {
  return {};
}

export const ModifyProcessInstanceResponse = {
  encode(_: ModifyProcessInstanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModifyProcessInstanceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModifyProcessInstanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ModifyProcessInstanceResponse {
    return {};
  },

  toJSON(_: ModifyProcessInstanceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModifyProcessInstanceResponse>, I>>(_: I): ModifyProcessInstanceResponse {
    const message = createBaseModifyProcessInstanceResponse();
    return message;
  },
};

export type GatewayService = typeof GatewayService;
export const GatewayService = {
  /**
   * Iterates through all known partitions round-robin and activates up to the requested
   * maximum and streams them back to the client as they are activated.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - type is blank (empty string, null)
   * - worker is blank (empty string, null)
   * - timeout less than 1
   * - maxJobsToActivate is less than 1
   */
  activateJobs: {
    path: "/gateway_protocol.Gateway/ActivateJobs",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ActivateJobsRequest) => Buffer.from(ActivateJobsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ActivateJobsRequest.decode(value),
    responseSerialize: (value: ActivateJobsResponse) => Buffer.from(ActivateJobsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ActivateJobsResponse.decode(value),
  },
  /**
   * Cancels a running process instance
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   */
  cancelProcessInstance: {
    path: "/gateway_protocol.Gateway/CancelProcessInstance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CancelProcessInstanceRequest) =>
      Buffer.from(CancelProcessInstanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CancelProcessInstanceRequest.decode(value),
    responseSerialize: (value: CancelProcessInstanceResponse) =>
      Buffer.from(CancelProcessInstanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CancelProcessInstanceResponse.decode(value),
  },
  /**
   * Completes a job with the given variables, which allows completing the associated service task.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given job key. Note that since jobs are removed once completed,
   * it could be that this job did exist at some point.
   *
   * FAILED_PRECONDITION:
   * - the job was marked as failed. In that case, the related incident must be resolved before
   * the job can be activated again and completed.
   */
  completeJob: {
    path: "/gateway_protocol.Gateway/CompleteJob",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CompleteJobRequest) => Buffer.from(CompleteJobRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CompleteJobRequest.decode(value),
    responseSerialize: (value: CompleteJobResponse) => Buffer.from(CompleteJobResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CompleteJobResponse.decode(value),
  },
  /**
   * Creates and starts an instance of the specified process. The process definition to use to
   * create the instance can be specified either using its unique key (as returned by
   * DeployProcess), or using the BPMN process ID and a version. Pass -1 as the version to use the
   * latest deployed version. Note that only processes with none start events can be started through
   * this command.
   *
   * Errors:
   * NOT_FOUND:
   * - no process with the given key exists (if processDefinitionKey was given)
   * - no process with the given process ID exists (if bpmnProcessId was given but version was -1)
   * - no process with the given process ID and version exists (if both bpmnProcessId and version were given)
   *
   * FAILED_PRECONDITION:
   * - the process definition does not contain a none start event; only processes with none
   * start event can be started manually.
   *
   * INVALID_ARGUMENT:
   * - the given variables argument is not a valid JSON document; it is expected to be a valid
   * JSON document where the root node is an object.
   */
  createProcessInstance: {
    path: "/gateway_protocol.Gateway/CreateProcessInstance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateProcessInstanceRequest) =>
      Buffer.from(CreateProcessInstanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateProcessInstanceRequest.decode(value),
    responseSerialize: (value: CreateProcessInstanceResponse) =>
      Buffer.from(CreateProcessInstanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateProcessInstanceResponse.decode(value),
  },
  /** Behaves similarly to `rpc CreateProcessInstance`, except that a successful response is received when the process completes successfully. */
  createProcessInstanceWithResult: {
    path: "/gateway_protocol.Gateway/CreateProcessInstanceWithResult",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateProcessInstanceWithResultRequest) =>
      Buffer.from(CreateProcessInstanceWithResultRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateProcessInstanceWithResultRequest.decode(value),
    responseSerialize: (value: CreateProcessInstanceWithResultResponse) =>
      Buffer.from(CreateProcessInstanceWithResultResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateProcessInstanceWithResultResponse.decode(value),
  },
  /**
   * Deploys one or more processes to Zeebe. Note that this is an atomic call,
   * i.e. either all processes are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the resource data is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the process is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   *
   * @deprecated
   */
  deployProcess: {
    path: "/gateway_protocol.Gateway/DeployProcess",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeployProcessRequest) => Buffer.from(DeployProcessRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeployProcessRequest.decode(value),
    responseSerialize: (value: DeployProcessResponse) => Buffer.from(DeployProcessResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => DeployProcessResponse.decode(value),
  },
  /**
   * Deploys one or more resources (e.g. processes or decision models) to Zeebe.
   * Note that this is an atomic call, i.e. either all resources are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the content is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the content is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   */
  deployResource: {
    path: "/gateway_protocol.Gateway/DeployResource",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeployResourceRequest) => Buffer.from(DeployResourceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeployResourceRequest.decode(value),
    responseSerialize: (value: DeployResourceResponse) => Buffer.from(DeployResourceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => DeployResourceResponse.decode(value),
  },
  /**
   * Marks the job as failed; if the retries argument is positive, then the job will be immediately
   * activatable again, and a worker could try again to process it. If it is zero or negative however,
   * an incident will be raised, tagged with the given errorMessage, and the job will not be
   * activatable until the incident is resolved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job was not activated
   * - the job is already in a failed state, i.e. ran out of retries
   */
  failJob: {
    path: "/gateway_protocol.Gateway/FailJob",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FailJobRequest) => Buffer.from(FailJobRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FailJobRequest.decode(value),
    responseSerialize: (value: FailJobResponse) => Buffer.from(FailJobResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => FailJobResponse.decode(value),
  },
  /**
   * Reports a business error (i.e. non-technical) that occurs while processing a job. The error is handled in the process by an error catch event. If there is no error catch event with the specified errorCode then an incident will be raised instead.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job is not in an activated state
   */
  throwError: {
    path: "/gateway_protocol.Gateway/ThrowError",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ThrowErrorRequest) => Buffer.from(ThrowErrorRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ThrowErrorRequest.decode(value),
    responseSerialize: (value: ThrowErrorResponse) => Buffer.from(ThrowErrorResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ThrowErrorResponse.decode(value),
  },
  /**
   * Publishes a single message. Messages are published to specific partitions computed from their
   * correlation keys.
   *
   * Errors:
   * ALREADY_EXISTS:
   * - a message with the same ID was previously published (and is still alive)
   */
  publishMessage: {
    path: "/gateway_protocol.Gateway/PublishMessage",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: PublishMessageRequest) => Buffer.from(PublishMessageRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => PublishMessageRequest.decode(value),
    responseSerialize: (value: PublishMessageResponse) => Buffer.from(PublishMessageResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => PublishMessageResponse.decode(value),
  },
  /**
   * Resolves a given incident. This simply marks the incident as resolved; most likely a call to
   * UpdateJobRetries or SetVariables will be necessary to actually resolve the
   * problem, following by this call.
   *
   * Errors:
   * NOT_FOUND:
   * - no incident with the given key exists
   */
  resolveIncident: {
    path: "/gateway_protocol.Gateway/ResolveIncident",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ResolveIncidentRequest) => Buffer.from(ResolveIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ResolveIncidentRequest.decode(value),
    responseSerialize: (value: ResolveIncidentResponse) => Buffer.from(ResolveIncidentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ResolveIncidentResponse.decode(value),
  },
  /**
   * Updates all the variables of a particular scope (e.g. process instance, flow element instance)
   * from the given JSON document.
   *
   * Errors:
   * NOT_FOUND:
   * - no element with the given elementInstanceKey exists
   * INVALID_ARGUMENT:
   * - the given variables document is not a valid JSON document; valid documents are expected to
   * be JSON documents where the root node is an object.
   */
  setVariables: {
    path: "/gateway_protocol.Gateway/SetVariables",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SetVariablesRequest) => Buffer.from(SetVariablesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SetVariablesRequest.decode(value),
    responseSerialize: (value: SetVariablesResponse) => Buffer.from(SetVariablesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SetVariablesResponse.decode(value),
  },
  /** Obtains the current topology of the cluster the gateway is part of. */
  topology: {
    path: "/gateway_protocol.Gateway/Topology",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TopologyRequest) => Buffer.from(TopologyRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TopologyRequest.decode(value),
    responseSerialize: (value: TopologyResponse) => Buffer.from(TopologyResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TopologyResponse.decode(value),
  },
  /**
   * Updates the number of retries a job has left. This is mostly useful for jobs that have run out of
   * retries, should the underlying problem be solved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given key
   *
   * INVALID_ARGUMENT:
   * - retries is not greater than 0
   */
  updateJobRetries: {
    path: "/gateway_protocol.Gateway/UpdateJobRetries",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateJobRetriesRequest) => Buffer.from(UpdateJobRetriesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateJobRetriesRequest.decode(value),
    responseSerialize: (value: UpdateJobRetriesResponse) =>
      Buffer.from(UpdateJobRetriesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateJobRetriesResponse.decode(value),
  },
  /**
   * Modifies the process instance. This is done by activating and/or terminating specific elements of the instance.
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   *
   * FAILED_PRECONDITION:
   * - trying to activate element inside of a multi-instance
   *
   * INVALID_ARGUMENT:
   * - activating or terminating unknown element
   * - ancestor of element for activation doesn't exist
   * - scope of variable is unknown
   */
  modifyProcessInstance: {
    path: "/gateway_protocol.Gateway/ModifyProcessInstance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ModifyProcessInstanceRequest) =>
      Buffer.from(ModifyProcessInstanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ModifyProcessInstanceRequest.decode(value),
    responseSerialize: (value: ModifyProcessInstanceResponse) =>
      Buffer.from(ModifyProcessInstanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ModifyProcessInstanceResponse.decode(value),
  },
} as const;

export interface GatewayServer extends UntypedServiceImplementation {
  /**
   * Iterates through all known partitions round-robin and activates up to the requested
   * maximum and streams them back to the client as they are activated.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - type is blank (empty string, null)
   * - worker is blank (empty string, null)
   * - timeout less than 1
   * - maxJobsToActivate is less than 1
   */
  activateJobs: handleServerStreamingCall<ActivateJobsRequest, ActivateJobsResponse>;
  /**
   * Cancels a running process instance
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   */
  cancelProcessInstance: handleUnaryCall<CancelProcessInstanceRequest, CancelProcessInstanceResponse>;
  /**
   * Completes a job with the given variables, which allows completing the associated service task.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given job key. Note that since jobs are removed once completed,
   * it could be that this job did exist at some point.
   *
   * FAILED_PRECONDITION:
   * - the job was marked as failed. In that case, the related incident must be resolved before
   * the job can be activated again and completed.
   */
  completeJob: handleUnaryCall<CompleteJobRequest, CompleteJobResponse>;
  /**
   * Creates and starts an instance of the specified process. The process definition to use to
   * create the instance can be specified either using its unique key (as returned by
   * DeployProcess), or using the BPMN process ID and a version. Pass -1 as the version to use the
   * latest deployed version. Note that only processes with none start events can be started through
   * this command.
   *
   * Errors:
   * NOT_FOUND:
   * - no process with the given key exists (if processDefinitionKey was given)
   * - no process with the given process ID exists (if bpmnProcessId was given but version was -1)
   * - no process with the given process ID and version exists (if both bpmnProcessId and version were given)
   *
   * FAILED_PRECONDITION:
   * - the process definition does not contain a none start event; only processes with none
   * start event can be started manually.
   *
   * INVALID_ARGUMENT:
   * - the given variables argument is not a valid JSON document; it is expected to be a valid
   * JSON document where the root node is an object.
   */
  createProcessInstance: handleUnaryCall<CreateProcessInstanceRequest, CreateProcessInstanceResponse>;
  /** Behaves similarly to `rpc CreateProcessInstance`, except that a successful response is received when the process completes successfully. */
  createProcessInstanceWithResult: handleUnaryCall<
    CreateProcessInstanceWithResultRequest,
    CreateProcessInstanceWithResultResponse
  >;
  /**
   * Deploys one or more processes to Zeebe. Note that this is an atomic call,
   * i.e. either all processes are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the resource data is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the process is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   *
   * @deprecated
   */
  deployProcess: handleUnaryCall<DeployProcessRequest, DeployProcessResponse>;
  /**
   * Deploys one or more resources (e.g. processes or decision models) to Zeebe.
   * Note that this is an atomic call, i.e. either all resources are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the content is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the content is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   */
  deployResource: handleUnaryCall<DeployResourceRequest, DeployResourceResponse>;
  /**
   * Marks the job as failed; if the retries argument is positive, then the job will be immediately
   * activatable again, and a worker could try again to process it. If it is zero or negative however,
   * an incident will be raised, tagged with the given errorMessage, and the job will not be
   * activatable until the incident is resolved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job was not activated
   * - the job is already in a failed state, i.e. ran out of retries
   */
  failJob: handleUnaryCall<FailJobRequest, FailJobResponse>;
  /**
   * Reports a business error (i.e. non-technical) that occurs while processing a job. The error is handled in the process by an error catch event. If there is no error catch event with the specified errorCode then an incident will be raised instead.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job is not in an activated state
   */
  throwError: handleUnaryCall<ThrowErrorRequest, ThrowErrorResponse>;
  /**
   * Publishes a single message. Messages are published to specific partitions computed from their
   * correlation keys.
   *
   * Errors:
   * ALREADY_EXISTS:
   * - a message with the same ID was previously published (and is still alive)
   */
  publishMessage: handleUnaryCall<PublishMessageRequest, PublishMessageResponse>;
  /**
   * Resolves a given incident. This simply marks the incident as resolved; most likely a call to
   * UpdateJobRetries or SetVariables will be necessary to actually resolve the
   * problem, following by this call.
   *
   * Errors:
   * NOT_FOUND:
   * - no incident with the given key exists
   */
  resolveIncident: handleUnaryCall<ResolveIncidentRequest, ResolveIncidentResponse>;
  /**
   * Updates all the variables of a particular scope (e.g. process instance, flow element instance)
   * from the given JSON document.
   *
   * Errors:
   * NOT_FOUND:
   * - no element with the given elementInstanceKey exists
   * INVALID_ARGUMENT:
   * - the given variables document is not a valid JSON document; valid documents are expected to
   * be JSON documents where the root node is an object.
   */
  setVariables: handleUnaryCall<SetVariablesRequest, SetVariablesResponse>;
  /** Obtains the current topology of the cluster the gateway is part of. */
  topology: handleUnaryCall<TopologyRequest, TopologyResponse>;
  /**
   * Updates the number of retries a job has left. This is mostly useful for jobs that have run out of
   * retries, should the underlying problem be solved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given key
   *
   * INVALID_ARGUMENT:
   * - retries is not greater than 0
   */
  updateJobRetries: handleUnaryCall<UpdateJobRetriesRequest, UpdateJobRetriesResponse>;
  /**
   * Modifies the process instance. This is done by activating and/or terminating specific elements of the instance.
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   *
   * FAILED_PRECONDITION:
   * - trying to activate element inside of a multi-instance
   *
   * INVALID_ARGUMENT:
   * - activating or terminating unknown element
   * - ancestor of element for activation doesn't exist
   * - scope of variable is unknown
   */
  modifyProcessInstance: handleUnaryCall<ModifyProcessInstanceRequest, ModifyProcessInstanceResponse>;
}

export interface GatewayClient extends Client {
  /**
   * Iterates through all known partitions round-robin and activates up to the requested
   * maximum and streams them back to the client as they are activated.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - type is blank (empty string, null)
   * - worker is blank (empty string, null)
   * - timeout less than 1
   * - maxJobsToActivate is less than 1
   */
  activateJobs(
    request: ActivateJobsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<ActivateJobsResponse>;
  activateJobs(
    request: ActivateJobsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<ActivateJobsResponse>;
  /**
   * Cancels a running process instance
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   */
  cancelProcessInstance(
    request: CancelProcessInstanceRequest,
    callback: (error: ServiceError | null, response: CancelProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  cancelProcessInstance(
    request: CancelProcessInstanceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CancelProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  cancelProcessInstance(
    request: CancelProcessInstanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CancelProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  /**
   * Completes a job with the given variables, which allows completing the associated service task.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given job key. Note that since jobs are removed once completed,
   * it could be that this job did exist at some point.
   *
   * FAILED_PRECONDITION:
   * - the job was marked as failed. In that case, the related incident must be resolved before
   * the job can be activated again and completed.
   */
  completeJob(
    request: CompleteJobRequest,
    callback: (error: ServiceError | null, response: CompleteJobResponse) => void,
  ): ClientUnaryCall;
  completeJob(
    request: CompleteJobRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CompleteJobResponse) => void,
  ): ClientUnaryCall;
  completeJob(
    request: CompleteJobRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CompleteJobResponse) => void,
  ): ClientUnaryCall;
  /**
   * Creates and starts an instance of the specified process. The process definition to use to
   * create the instance can be specified either using its unique key (as returned by
   * DeployProcess), or using the BPMN process ID and a version. Pass -1 as the version to use the
   * latest deployed version. Note that only processes with none start events can be started through
   * this command.
   *
   * Errors:
   * NOT_FOUND:
   * - no process with the given key exists (if processDefinitionKey was given)
   * - no process with the given process ID exists (if bpmnProcessId was given but version was -1)
   * - no process with the given process ID and version exists (if both bpmnProcessId and version were given)
   *
   * FAILED_PRECONDITION:
   * - the process definition does not contain a none start event; only processes with none
   * start event can be started manually.
   *
   * INVALID_ARGUMENT:
   * - the given variables argument is not a valid JSON document; it is expected to be a valid
   * JSON document where the root node is an object.
   */
  createProcessInstance(
    request: CreateProcessInstanceRequest,
    callback: (error: ServiceError | null, response: CreateProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  createProcessInstance(
    request: CreateProcessInstanceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  createProcessInstance(
    request: CreateProcessInstanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  /** Behaves similarly to `rpc CreateProcessInstance`, except that a successful response is received when the process completes successfully. */
  createProcessInstanceWithResult(
    request: CreateProcessInstanceWithResultRequest,
    callback: (error: ServiceError | null, response: CreateProcessInstanceWithResultResponse) => void,
  ): ClientUnaryCall;
  createProcessInstanceWithResult(
    request: CreateProcessInstanceWithResultRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateProcessInstanceWithResultResponse) => void,
  ): ClientUnaryCall;
  createProcessInstanceWithResult(
    request: CreateProcessInstanceWithResultRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateProcessInstanceWithResultResponse) => void,
  ): ClientUnaryCall;
  /**
   * Deploys one or more processes to Zeebe. Note that this is an atomic call,
   * i.e. either all processes are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the resource data is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the process is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   *
   * @deprecated
   */
  deployProcess(
    request: DeployProcessRequest,
    callback: (error: ServiceError | null, response: DeployProcessResponse) => void,
  ): ClientUnaryCall;
  deployProcess(
    request: DeployProcessRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: DeployProcessResponse) => void,
  ): ClientUnaryCall;
  deployProcess(
    request: DeployProcessRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: DeployProcessResponse) => void,
  ): ClientUnaryCall;
  /**
   * Deploys one or more resources (e.g. processes or decision models) to Zeebe.
   * Note that this is an atomic call, i.e. either all resources are deployed, or none of them are.
   *
   * Errors:
   * INVALID_ARGUMENT:
   * - no resources given.
   * - if at least one resource is invalid. A resource is considered invalid if:
   * - the content is not deserializable (e.g. detected as BPMN, but it's broken XML)
   * - the content is invalid (e.g. an event-based gateway has an outgoing sequence flow to a task)
   */
  deployResource(
    request: DeployResourceRequest,
    callback: (error: ServiceError | null, response: DeployResourceResponse) => void,
  ): ClientUnaryCall;
  deployResource(
    request: DeployResourceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: DeployResourceResponse) => void,
  ): ClientUnaryCall;
  deployResource(
    request: DeployResourceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: DeployResourceResponse) => void,
  ): ClientUnaryCall;
  /**
   * Marks the job as failed; if the retries argument is positive, then the job will be immediately
   * activatable again, and a worker could try again to process it. If it is zero or negative however,
   * an incident will be raised, tagged with the given errorMessage, and the job will not be
   * activatable until the incident is resolved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job was not activated
   * - the job is already in a failed state, i.e. ran out of retries
   */
  failJob(
    request: FailJobRequest,
    callback: (error: ServiceError | null, response: FailJobResponse) => void,
  ): ClientUnaryCall;
  failJob(
    request: FailJobRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: FailJobResponse) => void,
  ): ClientUnaryCall;
  failJob(
    request: FailJobRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: FailJobResponse) => void,
  ): ClientUnaryCall;
  /**
   * Reports a business error (i.e. non-technical) that occurs while processing a job. The error is handled in the process by an error catch event. If there is no error catch event with the specified errorCode then an incident will be raised instead.
   *
   * Errors:
   * NOT_FOUND:
   * - no job was found with the given key
   *
   * FAILED_PRECONDITION:
   * - the job is not in an activated state
   */
  throwError(
    request: ThrowErrorRequest,
    callback: (error: ServiceError | null, response: ThrowErrorResponse) => void,
  ): ClientUnaryCall;
  throwError(
    request: ThrowErrorRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ThrowErrorResponse) => void,
  ): ClientUnaryCall;
  throwError(
    request: ThrowErrorRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ThrowErrorResponse) => void,
  ): ClientUnaryCall;
  /**
   * Publishes a single message. Messages are published to specific partitions computed from their
   * correlation keys.
   *
   * Errors:
   * ALREADY_EXISTS:
   * - a message with the same ID was previously published (and is still alive)
   */
  publishMessage(
    request: PublishMessageRequest,
    callback: (error: ServiceError | null, response: PublishMessageResponse) => void,
  ): ClientUnaryCall;
  publishMessage(
    request: PublishMessageRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: PublishMessageResponse) => void,
  ): ClientUnaryCall;
  publishMessage(
    request: PublishMessageRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: PublishMessageResponse) => void,
  ): ClientUnaryCall;
  /**
   * Resolves a given incident. This simply marks the incident as resolved; most likely a call to
   * UpdateJobRetries or SetVariables will be necessary to actually resolve the
   * problem, following by this call.
   *
   * Errors:
   * NOT_FOUND:
   * - no incident with the given key exists
   */
  resolveIncident(
    request: ResolveIncidentRequest,
    callback: (error: ServiceError | null, response: ResolveIncidentResponse) => void,
  ): ClientUnaryCall;
  resolveIncident(
    request: ResolveIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ResolveIncidentResponse) => void,
  ): ClientUnaryCall;
  resolveIncident(
    request: ResolveIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ResolveIncidentResponse) => void,
  ): ClientUnaryCall;
  /**
   * Updates all the variables of a particular scope (e.g. process instance, flow element instance)
   * from the given JSON document.
   *
   * Errors:
   * NOT_FOUND:
   * - no element with the given elementInstanceKey exists
   * INVALID_ARGUMENT:
   * - the given variables document is not a valid JSON document; valid documents are expected to
   * be JSON documents where the root node is an object.
   */
  setVariables(
    request: SetVariablesRequest,
    callback: (error: ServiceError | null, response: SetVariablesResponse) => void,
  ): ClientUnaryCall;
  setVariables(
    request: SetVariablesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SetVariablesResponse) => void,
  ): ClientUnaryCall;
  setVariables(
    request: SetVariablesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SetVariablesResponse) => void,
  ): ClientUnaryCall;
  /** Obtains the current topology of the cluster the gateway is part of. */
  topology(
    request: TopologyRequest,
    callback: (error: ServiceError | null, response: TopologyResponse) => void,
  ): ClientUnaryCall;
  topology(
    request: TopologyRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TopologyResponse) => void,
  ): ClientUnaryCall;
  topology(
    request: TopologyRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TopologyResponse) => void,
  ): ClientUnaryCall;
  /**
   * Updates the number of retries a job has left. This is mostly useful for jobs that have run out of
   * retries, should the underlying problem be solved.
   *
   * Errors:
   * NOT_FOUND:
   * - no job exists with the given key
   *
   * INVALID_ARGUMENT:
   * - retries is not greater than 0
   */
  updateJobRetries(
    request: UpdateJobRetriesRequest,
    callback: (error: ServiceError | null, response: UpdateJobRetriesResponse) => void,
  ): ClientUnaryCall;
  updateJobRetries(
    request: UpdateJobRetriesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UpdateJobRetriesResponse) => void,
  ): ClientUnaryCall;
  updateJobRetries(
    request: UpdateJobRetriesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UpdateJobRetriesResponse) => void,
  ): ClientUnaryCall;
  /**
   * Modifies the process instance. This is done by activating and/or terminating specific elements of the instance.
   *
   * Errors:
   * NOT_FOUND:
   * - no process instance exists with the given key
   *
   * FAILED_PRECONDITION:
   * - trying to activate element inside of a multi-instance
   *
   * INVALID_ARGUMENT:
   * - activating or terminating unknown element
   * - ancestor of element for activation doesn't exist
   * - scope of variable is unknown
   */
  modifyProcessInstance(
    request: ModifyProcessInstanceRequest,
    callback: (error: ServiceError | null, response: ModifyProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  modifyProcessInstance(
    request: ModifyProcessInstanceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ModifyProcessInstanceResponse) => void,
  ): ClientUnaryCall;
  modifyProcessInstance(
    request: ModifyProcessInstanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ModifyProcessInstanceResponse) => void,
  ): ClientUnaryCall;
}

export const GatewayClient = makeGenericClientConstructor(GatewayService, "gateway_protocol.Gateway") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GatewayClient;
  service: typeof GatewayService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
