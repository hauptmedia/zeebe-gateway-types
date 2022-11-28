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