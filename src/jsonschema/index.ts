import * as ActivateJobs from './io/zeebe/command/v1/ActivateJobs.json'
import * as CancelProcessInstance from './io/zeebe/command/v1/CancelProcessInstance.json'
import * as CompleteJob from './io/zeebe/command/v1/CompleteJob.json'
import * as CreateProcessInstance from './io/zeebe/command/v1/CreateProcessInstance.json'
import * as CreateProcessInstanceWithResult from './io/zeebe/command/v1/CreateProcessInstanceWithResult.json'
import * as DeployResource from './io/zeebe/command/v1/DeployResource.json'
import * as FailJob from './io/zeebe/command/v1/FailJob.json'
import * as PublishMessage from './io/zeebe/command/v1/PublishMessage.json'
import * as ResolveIncident from './io/zeebe/command/v1/ResolveIncident.json'
import * as ThrowError from './io/zeebe/command/v1/ThrowError.json'
import * as Topology from './io/zeebe/command/v1/Topology.json'

export const ZeebeGatewayCommandJsonSchemaRegistry = {
    'io.zeebe.command.v1.ActivateJobs': ActivateJobs,
    'io.zeebe.command.v1.CancelProcessInstance.json': CancelProcessInstance,
    'io.zeebe.command.v1.CompleteJob': CompleteJob,
    'io.zeebe.command.v1.CreateProcessInstance': CreateProcessInstance,
    'io.zeebe.command.v1.CreateProcessInstanceWithResult': CreateProcessInstanceWithResult,
    'io.zeebe.command.v1.DeployResource.json': DeployResource,
    'io.zeebe.command.v1.FailJob': FailJob,
    'io.zeebe.command.v1.PublishMessage': PublishMessage,
    'io.zeebe.command.v1.ResolveIncident': ResolveIncident,
    'io.zeebe.command.v1.ThrowError.json': ThrowError,
    'io.zeebe.command.v1.Topology': Topology
}