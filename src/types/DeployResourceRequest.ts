import {Resource} from "./Resource";

export interface DeployResourceRequest {
    /** list of resources to deploy */
    resources: Resource[];
}