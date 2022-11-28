import {Deployment} from "./Deployment";

export interface DeployResourceResponse {
    /** the unique key identifying the deployment */
    key: number;
    /** a list of deployed resources, e.g. processes */
    deployments: Deployment[];
}