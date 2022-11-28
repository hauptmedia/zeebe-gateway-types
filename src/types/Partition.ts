import {PartitionBrokerRole} from "./PartitionBrokerRole";
import {PartitionBrokerHealth} from "./PartitionBrokerHealth";

export interface Partition {
    /** the unique ID of this partition */
    partitionId: number;
    /** the role of the broker for this partition */
    role: PartitionBrokerRole;
    /** the health of this partition */
    health: PartitionBrokerHealth;
}