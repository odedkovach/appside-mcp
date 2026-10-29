import {test} from 'node:test';import assert from 'node:assert/strict';
import {createProtocol} from './server.mjs';
const request=(method,params={},id=1)=>({jsonrpc:'2.0',id,method,params});
test('initialize, tools, search, snippets and pricing over the bundled snapshot',async()=>{
 const call=await createProtocol();
 assert.equal((await call(request('initialize',{protocolVersion:'2025-03-26',clientInfo:{name:'fixture',version:'1'},capabilities:{}}))).result.serverInfo.name,'appside-mcp');
 const names=(await call(request('tools/list'))).result.tools.map(t=>t.name);
 for(const n of ['search_docs','get_sdk_snippet','get_sdk_status','get_pricing'])assert(names.includes(n),n);
 const tool=async(name,args={})=>JSON.parse((await call(request('tools/call',{name,arguments:args}))).result.content[0].text);
 const found=await tool('search_docs',{query:'webhook'});assert(found.results.length>0);assert(found.results.every(r=>r.url.startsWith('https://appside.build/docs/')));
 for(const platform of ['web','node','unity'])assert((await tool('get_sdk_snippet',{platform})).markdown.includes('```'));
 assert.equal((await tool('get_pricing')).feePercent,3.9);
 assert.equal((await call(request('tools/call',{name:'create_store'}))).error.code,-32601);
});
