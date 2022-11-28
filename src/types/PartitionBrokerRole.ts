/** Describes the Raft role of the broker for a given partition */
export enum PartitionBrokerRole {
    LEADER = 0,
    FOLLOWER = 1,
    INACTIVE = 2,
    UNRECOGNIZED = -1,
}