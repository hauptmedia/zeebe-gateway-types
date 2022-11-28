import {ProcessMetadata} from "./ProcessMetadata";
import {DecisionMetadata} from "./DecisionMetadata";
import {DecisionRequirementsMetadata} from "./DecisionRequirementsMetadata";

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
