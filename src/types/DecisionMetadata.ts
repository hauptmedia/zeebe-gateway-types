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