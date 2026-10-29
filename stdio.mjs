#!/usr/bin/env node
import {createProtocol,parseMessage} from './server.mjs';
const dispatch=await createProtocol();let pending='';
process.stdin.setEncoding('utf8');
for await(const chunk of process.stdin){pending+=chunk;let at;while((at=pending.indexOf('\n'))>=0){const line=pending.slice(0,at);pending=pending.slice(at+1);if(Buffer.byteLength(line)>65536){process.stderr.write('MCP message exceeds 64 KiB\n');process.exitCode=1;process.stdin.destroy();break;}if(!line.trim())continue;const reply=await parseMessage(line,dispatch);if(reply)process.stdout.write(JSON.stringify(reply)+'\n');}if(Buffer.byteLength(pending)>65536){process.stderr.write('MCP message exceeds 64 KiB\n');process.exitCode=1;process.stdin.destroy();break;}}
