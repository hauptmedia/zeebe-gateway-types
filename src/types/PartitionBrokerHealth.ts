/** Describes the current health of the partition */
export enum PartitionBrokerHealth {
    HEALTHY = 0,
    UNHEALTHY = 1,
    DEAD = 2,
    UNRECOGNIZED = -1,
}