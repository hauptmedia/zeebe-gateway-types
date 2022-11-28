export interface PublishMessageRequest {
    /** the name of the message */
    name: string;
    /** the correlation key of the message */
    correlationKey: string;
    /** how long the message should be buffered on the broker, in milliseconds */
    timeToLive: number;
    /**
     * the unique ID of the message; can be omitted. only useful to ensure only one message
     * with the given ID will ever be published (during its lifetime)
     */
    messageId: string;
    /**
     * the message variables as a JSON document; to be valid, the root of the document must be an
     * object, e.g. { "a": "foo" }. [ "foo" ] would not be valid.
     */
    variables: string;
}