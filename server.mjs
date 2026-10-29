import {loadContent,platforms} from './content.mjs';
import {sdkStatuses} from './sdk-status.mjs';
export const protocolVersion='2025-03-26';
const schema=properties=>({type:'object',properties,additionalProperties:false});
export const tools=[
  {name:'search_docs',description:'Search Appside public developer Markdown; returns source links and excerpts.',inputSchema:{...schema({query:{type:'string',minLength:1,maxLength:200}}),required:['query']}},
  {name:'get_sdk_snippet',description:'Get a repository SDK example and its documented verification status. Grant items only on verified backend delivery.',inputSchema:{...schema({platform:{type:'string',enum:platforms}}),required:['platform']}},
  {name:'get_sdk_status',description:'List all SDK download URLs, install instructions and scoped verification status, or select one platform. All SDKs operate in test mode.',inputSchema:schema({platform:{type:'string',enum:platforms}})},
  {name:'get_pricing',description:'Get Appside published payment fee and fixed-fee policy.',inputSchema:schema({})}
].map(t=>({...t,annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}));
const resource={uri:'https://appside.build/llms.txt',name:'Appside llms.txt',description:'Public Appside overview for coding agents',mimeType:'text/plain'};
const error=(id,code,message)=>({jsonrpc:'2.0',id:id??null,error:{code,message}});
const text=value=>({content:[{type:'text',text:typeof value==='string'?value:JSON.stringify(value,null,2)}]});
function argsFor(name,args){const tool=tools.find(t=>t.name===name);if(!tool)throw Error('Unknown tool');if(!args||typeof args!=='object'||Array.isArray(args))throw Error('Arguments must be an object');if(Object.keys(args).some(k=>!(k in tool.inputSchema.properties)))throw Error('Unknown argument');if(name==='search_docs'&&(typeof args.query!=='string'||!args.query.trim()||args.query.length>200))throw Error('query must contain 1–200 characters');if((name==='get_sdk_snippet'||(name==='get_sdk_status'&&'platform' in args))&&!platforms.includes(args.platform))throw Error('Unsupported platform');}
export async function createProtocol(){
  const content=await loadContent();
  async function single(message){
    if(!message||typeof message!=='object'||Array.isArray(message)||message.jsonrpc!=='2.0'||typeof message.method!=='string'||('id' in message&&!['string','number'].includes(typeof message.id)))return error(null,-32600,'Invalid request');
    const notification=!('id' in message);
    if(notification)return null;
    const {id,method}=message,p=message.params??{};
    if(typeof p!=='object'||Array.isArray(p)||p===null)return error(id,-32602,'Invalid params');
    let result;
    switch(method){
      case 'initialize':
        if(typeof p.protocolVersion!=='string'||!p.clientInfo||typeof p.clientInfo.name!=='string'||!p.capabilities)return error(id,-32602,'Invalid initialize params');
        result={protocolVersion,capabilities:{tools:{},resources:{}},serverInfo:{name:'appside-mcp',version:'0.1.0'},instructions:'Read-only public documentation. SDK snippets retain test-mode and verification status. Never grant items from client callbacks.'};break;
      case 'ping':result={};break;
      case 'tools/list':result={tools};break;
      case 'resources/list':result={resources:[resource]};break;
      case 'resources/templates/list':result={resourceTemplates:[]};break;
      case 'resources/read':if(p.uri!==resource.uri)return error(id,-32602,'Unknown resource');result={contents:[{uri:resource.uri,mimeType:'text/plain',text:content.llms}]};break;
      case 'tools/call':{
        const args=p.arguments??{};try{argsFor(p.name,args);}catch(e){return error(id,-32602,e.message);}
        if(p.name==='get_pricing')result=text({currency:'USD',feePercent:3.9,basis:'per successful payment',setupFee:0,subscriptionFee:0,minimumFee:0,source:'https://appside.build/appcharge-alternative/'});
        if(p.name==='get_sdk_status')result=text({observedAt:'2026-10-25',sdks:sdkStatuses.filter(s=>!args.platform||s.platform===args.platform)});
        if(p.name==='get_sdk_snippet')result=text({...sdkStatuses.find(s=>s.platform===args.platform),platform:args.platform,source:`sdks/${args.platform}/README.md`,documentation:'https://appside.build/docs/sdks/',markdown:content.snippets[args.platform]});
        if(p.name==='search_docs'){
          const words=[...new Set(args.query.toLowerCase().split(/\W+/).filter(Boolean))];
          const results=content.docs.map(d=>{const lower=d.text.toLowerCase(),score=words.reduce((n,w)=>n+(lower.includes(w)?1:0)+(d.title.toLowerCase().includes(w)?2:0),0);const hit=Math.min(...words.map(w=>lower.indexOf(w)).filter(i=>i>=0));return {title:d.title,url:d.url,score,excerpt:d.text.slice(Math.max(0,hit-180),Math.max(0,hit-180)+1600)};}).filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.url.localeCompare(b.url)).slice(0,5);result=text({results});
        }break;
      }
      default:return error(id,-32601,'Method not found');
    }
    return {jsonrpc:'2.0',id,result};
  }
  return async message=>{if(Array.isArray(message)){if(!message.length||message.length>20)return error(null,-32600,'Batch must contain 1–20 messages');const responses=(await Promise.all(message.map(single))).filter(Boolean);return responses.length?responses:null;}return single(message);};
}
export async function parseMessage(raw,dispatch){try{return await dispatch(JSON.parse(raw));}catch(e){return error(null,e instanceof SyntaxError?-32700:-32603,e instanceof SyntaxError?'Parse error':'Internal error');}}
