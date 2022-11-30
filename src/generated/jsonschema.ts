import * as ActivateJobsRequest from './jsonschema/io/zeebe/command/v1/ActivateJobsRequest.json'
import * as ActivateJobsResponse from './jsonschema/io/zeebe/command/v1/ActivateJobsResponse.json'
import * as CancelProcessInstanceRequest from './jsonschema/io/zeebe/command/v1/CancelProcessInstanceRequest.json'
import * as CancelProcessInstanceResponse from './jsonschema/io/zeebe/command/v1/CancelProcessInstanceResponse.json'
import * as CompleteJobRequest from './jsonschema/io/zeebe/command/v1/CompleteJobRequest.json'
import * as CompleteJobResponse from './jsonschema/io/zeebe/command/v1/CompleteJobResponse.json'
import * as CreateProcessInstanceRequest from './jsonschema/io/zeebe/command/v1/CreateProcessInstanceRequest.json'
import * as CreateProcessInstanceResponse from './jsonschema/io/zeebe/command/v1/CreateProcessInstanceResponse.json'
import * as CreateProcessInstanceWithResultRequest from './jsonschema/io/zeebe/command/v1/CreateProcessInstanceWithResultRequest.json'
import * as CreateProcessInstanceWithResultResponse from './jsonschema/io/zeebe/command/v1/CreateProcessInstanceWithResultResponse.json'
import * as DeployProcessRequest from './jsonschema/io/zeebe/command/v1/DeployProcessRequest.json'
import * as DeployProcessResponse from './jsonschema/io/zeebe/command/v1/DeployProcessResponse.json'
import * as DeployResourceRequest from './jsonschema/io/zeebe/command/v1/DeployResourceRequest.json'
import * as DeployResourceResponse from './jsonschema/io/zeebe/command/v1/DeployResourceResponse.json'
import * as FailJobRequest from './jsonschema/io/zeebe/command/v1/FailJobRequest.json'
import * as FailJobResponse from './jsonschema/io/zeebe/command/v1/FailJobResponse.json'
import * as ThrowErrorRequest from './jsonschema/io/zeebe/command/v1/ThrowErrorRequest.json'
import * as ThrowErrorResponse from './jsonschema/io/zeebe/command/v1/ThrowErrorResponse.json'
import * as PublishMessageRequest from './jsonschema/io/zeebe/command/v1/PublishMessageRequest.json'
import * as PublishMessageResponse from './jsonschema/io/zeebe/command/v1/PublishMessageResponse.json'
import * as ResolveIncidentRequest from './jsonschema/io/zeebe/command/v1/ResolveIncidentRequest.json'
import * as ResolveIncidentResponse from './jsonschema/io/zeebe/command/v1/ResolveIncidentResponse.json'
import * as TopologyRequest from './jsonschema/io/zeebe/command/v1/TopologyRequest.json'
import * as TopologyResponse from './jsonschema/io/zeebe/command/v1/TopologyResponse.json'
import * as UpdateJobRetriesRequest from './jsonschema/io/zeebe/command/v1/UpdateJobRetriesRequest.json'
import * as UpdateJobRetriesResponse from './jsonschema/io/zeebe/command/v1/UpdateJobRetriesResponse.json'
import * as SetVariablesRequest from './jsonschema/io/zeebe/command/v1/SetVariablesRequest.json'
import * as SetVariablesResponse from './jsonschema/io/zeebe/command/v1/SetVariablesResponse.json'
import * as ModifyProcessInstanceRequest from './jsonschema/io/zeebe/command/v1/ModifyProcessInstanceRequest.json'
import * as ModifyProcessInstanceResponse from './jsonschema/io/zeebe/command/v1/ModifyProcessInstanceResponse.json'
export const ZeebeGatewayCommandJsonSchemaRegistry = {
  'io.zeebe.command.v1.ActivateJobsRequest': ActivateJobsRequest,
  'io.zeebe.command.v1.ActivateJobsResponse': ActivateJobsResponse,
  'io.zeebe.command.v1.CancelProcessInstanceRequest': CancelProcessInstanceRequest,
  'io.zeebe.command.v1.CancelProcessInstanceResponse': CancelProcessInstanceResponse,
  'io.zeebe.command.v1.CompleteJobRequest': CompleteJobRequest,
  'io.zeebe.command.v1.CompleteJobResponse': CompleteJobResponse,
  'io.zeebe.command.v1.CreateProcessInstanceRequest': CreateProcessInstanceRequest,
  'io.zeebe.command.v1.CreateProcessInstanceResponse': CreateProcessInstanceResponse,
  'io.zeebe.command.v1.CreateProcessInstanceWithResultRequest': CreateProcessInstanceWithResultRequest,
  'io.zeebe.command.v1.CreateProcessInstanceWithResultResponse': CreateProcessInstanceWithResultResponse,
  'io.zeebe.command.v1.DeployProcessRequest': DeployProcessRequest,
  'io.zeebe.command.v1.DeployProcessResponse': DeployProcessResponse,
  'io.zeebe.command.v1.DeployResourceRequest': DeployResourceRequest,
  'io.zeebe.command.v1.DeployResourceResponse': DeployResourceResponse,
  'io.zeebe.command.v1.FailJobRequest': FailJobRequest,
  'io.zeebe.command.v1.FailJobResponse': FailJobResponse,
  'io.zeebe.command.v1.ThrowErrorRequest': ThrowErrorRequest,
  'io.zeebe.command.v1.ThrowErrorResponse': ThrowErrorResponse,
  'io.zeebe.command.v1.PublishMessageRequest': PublishMessageRequest,
  'io.zeebe.command.v1.PublishMessageResponse': PublishMessageResponse,
  'io.zeebe.command.v1.ResolveIncidentRequest': ResolveIncidentRequest,
  'io.zeebe.command.v1.ResolveIncidentResponse': ResolveIncidentResponse,
  'io.zeebe.command.v1.TopologyRequest': TopologyRequest,
  'io.zeebe.command.v1.TopologyResponse': TopologyResponse,
  'io.zeebe.command.v1.UpdateJobRetriesRequest': UpdateJobRetriesRequest,
  'io.zeebe.command.v1.UpdateJobRetriesResponse': UpdateJobRetriesResponse,
  'io.zeebe.command.v1.SetVariablesRequest': SetVariablesRequest,
  'io.zeebe.command.v1.SetVariablesResponse': SetVariablesResponse,
  'io.zeebe.command.v1.ModifyProcessInstanceRequest': ModifyProcessInstanceRequest,
  'io.zeebe.command.v1.ModifyProcessInstanceResponse': ModifyProcessInstanceResponse,
}
export type ZeebeGatewayCommandTypes = 'io.zeebe.command.v1.ActivateJobsRequest' | 'io.zeebe.command.v1.ActivateJobsResponse' | 'io.zeebe.command.v1.CancelProcessInstanceRequest' | 'io.zeebe.command.v1.CancelProcessInstanceResponse' | 'io.zeebe.command.v1.CompleteJobRequest' | 'io.zeebe.command.v1.CompleteJobResponse' | 'io.zeebe.command.v1.CreateProcessInstanceRequest' | 'io.zeebe.command.v1.CreateProcessInstanceResponse' | 'io.zeebe.command.v1.CreateProcessInstanceWithResultRequest' | 'io.zeebe.command.v1.CreateProcessInstanceWithResultResponse' | 'io.zeebe.command.v1.DeployProcessRequest' | 'io.zeebe.command.v1.DeployProcessResponse' | 'io.zeebe.command.v1.DeployResourceRequest' | 'io.zeebe.command.v1.DeployResourceResponse' | 'io.zeebe.command.v1.FailJobRequest' | 'io.zeebe.command.v1.FailJobResponse' | 'io.zeebe.command.v1.ThrowErrorRequest' | 'io.zeebe.command.v1.ThrowErrorResponse' | 'io.zeebe.command.v1.PublishMessageRequest' | 'io.zeebe.command.v1.PublishMessageResponse' | 'io.zeebe.command.v1.ResolveIncidentRequest' | 'io.zeebe.command.v1.ResolveIncidentResponse' | 'io.zeebe.command.v1.TopologyRequest' | 'io.zeebe.command.v1.TopologyResponse' | 'io.zeebe.command.v1.UpdateJobRetriesRequest' | 'io.zeebe.command.v1.UpdateJobRetriesResponse' | 'io.zeebe.command.v1.SetVariablesRequest' | 'io.zeebe.command.v1.SetVariablesResponse' | 'io.zeebe.command.v1.ModifyProcessInstanceRequest' | 'io.zeebe.command.v1.ModifyProcessInstanceResponse';