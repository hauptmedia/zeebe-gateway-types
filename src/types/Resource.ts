export interface Resource {
    /** the resource name, e.g. myProcess.bpmn or myDecision.dmn */
    name: string;
    /** the file content as a UTF8-encoded string */
    content: Uint8Array;
}