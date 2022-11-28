import {BrokerInfo} from "./BrokerInfo";

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