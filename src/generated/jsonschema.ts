import * as ServiceError from './jsonschema/ServiceError.json'
import * as ActivateJobsRequest from './jsonschema/ActivateJobsRequest.json'
import * as ActivateJobsResponse from './jsonschema/ActivateJobsResponse.json'
import * as CancelProcessInstanceRequest from './jsonschema/CancelProcessInstanceRequest.json'
import * as CancelProcessInstanceResponse from './jsonschema/CancelProcessInstanceResponse.json'
import * as CompleteJobRequest from './jsonschema/CompleteJobRequest.json'
import * as CompleteJobResponse from './jsonschema/CompleteJobResponse.json'
import * as CreateProcessInstanceRequest from './jsonschema/CreateProcessInstanceRequest.json'
import * as CreateProcessInstanceResponse from './jsonschema/CreateProcessInstanceResponse.json'
import * as CreateProcessInstanceWithResultRequest from './jsonschema/CreateProcessInstanceWithResultRequest.json'
import * as CreateProcessInstanceWithResultResponse from './jsonschema/CreateProcessInstanceWithResultResponse.json'
import * as DeployResourceRequest from './jsonschema/DeployResourceRequest.json'
import * as DeployResourceResponse from './jsonschema/DeployResourceResponse.json'
import * as FailJobRequest from './jsonschema/FailJobRequest.json'
import * as FailJobResponse from './jsonschema/FailJobResponse.json'
import * as ThrowErrorRequest from './jsonschema/ThrowErrorRequest.json'
import * as ThrowErrorResponse from './jsonschema/ThrowErrorResponse.json'
import * as PublishMessageRequest from './jsonschema/PublishMessageRequest.json'
import * as PublishMessageResponse from './jsonschema/PublishMessageResponse.json'
import * as ResolveIncidentRequest from './jsonschema/ResolveIncidentRequest.json'
import * as ResolveIncidentResponse from './jsonschema/ResolveIncidentResponse.json'
import * as TopologyRequest from './jsonschema/TopologyRequest.json'
import * as TopologyResponse from './jsonschema/TopologyResponse.json'
import * as UpdateJobRetriesRequest from './jsonschema/UpdateJobRetriesRequest.json'
import * as UpdateJobRetriesResponse from './jsonschema/UpdateJobRetriesResponse.json'
import * as SetVariablesRequest from './jsonschema/SetVariablesRequest.json'
import * as SetVariablesResponse from './jsonschema/SetVariablesResponse.json'
import * as ModifyProcessInstanceRequest from './jsonschema/ModifyProcessInstanceRequest.json'
import * as ModifyProcessInstanceResponse from './jsonschema/ModifyProcessInstanceResponse.json'
export const JsonSchemaRegistry = {
  'ServiceError': ServiceError,
  'ActivateJobsRequest': ActivateJobsRequest,
  'ActivateJobsResponse': ActivateJobsResponse,
  'CancelProcessInstanceRequest': CancelProcessInstanceRequest,
  'CancelProcessInstanceResponse': CancelProcessInstanceResponse,
  'CompleteJobRequest': CompleteJobRequest,
  'CompleteJobResponse': CompleteJobResponse,
  'CreateProcessInstanceRequest': CreateProcessInstanceRequest,
  'CreateProcessInstanceResponse': CreateProcessInstanceResponse,
  'CreateProcessInstanceWithResultRequest': CreateProcessInstanceWithResultRequest,
  'CreateProcessInstanceWithResultResponse': CreateProcessInstanceWithResultResponse,
  'DeployResourceRequest': DeployResourceRequest,
  'DeployResourceResponse': DeployResourceResponse,
  'FailJobRequest': FailJobRequest,
  'FailJobResponse': FailJobResponse,
  'ThrowErrorRequest': ThrowErrorRequest,
  'ThrowErrorResponse': ThrowErrorResponse,
  'PublishMessageRequest': PublishMessageRequest,
  'PublishMessageResponse': PublishMessageResponse,
  'ResolveIncidentRequest': ResolveIncidentRequest,
  'ResolveIncidentResponse': ResolveIncidentResponse,
  'TopologyRequest': TopologyRequest,
  'TopologyResponse': TopologyResponse,
  'UpdateJobRetriesRequest': UpdateJobRetriesRequest,
  'UpdateJobRetriesResponse': UpdateJobRetriesResponse,
  'SetVariablesRequest': SetVariablesRequest,
  'SetVariablesResponse': SetVariablesResponse,
  'ModifyProcessInstanceRequest': ModifyProcessInstanceRequest,
  'ModifyProcessInstanceResponse': ModifyProcessInstanceResponse,
}
export type JsonSchemaRegistryTypes = keyof typeof JsonSchemaRegistry
