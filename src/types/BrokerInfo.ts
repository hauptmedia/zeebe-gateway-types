import {Partition} from "./Partition";

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