// for docs see https://github.com/YousefED/typescript-json-schema

import * as TJS from "typescript-json-schema";
import {writeFileSync} from "node:fs";

const settings: TJS.PartialArgs = {
    required: false
    },
    compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
        esModuleInterop: true
    },
    basePath = "./src/generated";

const program = TJS.getProgramFromFiles(
    ["src/generated/gateway.ts"],
    compilerOptions,
    basePath
);

const generator = TJS.buildGenerator(program, settings);

const blacklist = [
    "GetChannelRequest", "GetChannelResponse", "GetServerRequest", "GetServerResponse", "GetServerSocketsRequest",
    "GetServerSocketsResponse", "GetServersRequest", "GetServersResponse", "GetSocketRequest", "GetSocketResponse",
    "GetSubchannelRequest", "GetSubchannelResponse", "GetTopChannelsRequest", "GetTopChannelsResponse",
    "ServerStatusResponse", "ServerErrorResponse",
    "Http2ServerRequest", "Http2ServerResponse", "ServerResponse", "ClientRequest"
];
const symbols = generator.getUserSymbols().filter(name => (name.endsWith("Request") || name.endsWith("Response")) && !blacklist.includes(name))

// Write JSON Schema Files
symbols.forEach(symbol => {
    let schema = generator.getSchemaForSymbol(symbol);
    writeFileSync(`src/generated/jsonschema/io/zeebe/command/v1/${symbol}.json`, JSON.stringify(schema, null, 2));
});


let exportFile = "";

symbols.forEach(symbol => {
    exportFile += `import * as ${symbol} from './jsonschema/io/zeebe/command/v1/${symbol}.json'\n`;
});

exportFile += "export const ZeebeGatewayCommandJsonSchemaRegistry = {\n";
symbols.forEach(symbol => {
    exportFile += "  'io.zeebe.command.v1." + symbol + "': " + symbol + ",\n";
});
exportFile += "}\n";


exportFile += "export type ZeebeGatewayCommandTypes = ";
exportFile += symbols.map(symbol => `'${symbol}'`).join(" | ")
exportFile += ";"

writeFileSync(`src/generated/jsonschema.ts`, exportFile);
