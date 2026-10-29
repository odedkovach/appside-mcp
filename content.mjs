import {readFile,readdir} from 'node:fs/promises';
export const platforms=['web','ios','android','unity','react-native','flutter','node','python'];
const repo=new URL('../../',import.meta.url);
export async function repositoryContent(){
  const docs=[];
  for(const name of (await readdir(new URL('site/docs/src/',repo))).filter(n=>n.endsWith('.md')).sort()){
    const text=await readFile(new URL('site/docs/src/'+name,repo),'utf8');
    docs.push({title:text.match(/^# (.+)$/m)?.[1]||name,url:'https://appside.build/docs/'+(name==='index.md'?'':name.replace('.md','')+'/'),text});
  }
  const snippets={};for(const platform of platforms)snippets[platform]=await readFile(new URL(`sdks/${platform}/README.md`,repo),'utf8');
  const unity=docs.find(d=>d.url.endsWith('/quickstart/'))?.text.match(/```csharp Unity\n([\s\S]*?)```/);
  if(unity)snippets.unity+='\n## Quickstart example\n\n```csharp\n'+unity[1]+'```\n';
  const {renderLlms}=await import('../../site/seo/llms.mjs');
  const {loadContent:loadPages}=await import('../../site/seo/content.mjs');
  const {gateContent,readLedger}=await import('../../site/seo/velocity.mjs');
  const {comparisonHub}=await import('../../site/seo/generated.mjs');
  const pages=JSON.parse(await readFile(new URL('site/seo/pages.json',repo),'utf8')).filter(p=>!p.draft);
  pages.push(...gateContent(await loadPages(),await readLedger()).published);
  pages.push(comparisonHub(pages));
  return {docs,snippets,llms:renderLlms(pages)};
}
export async function loadContent(){
  // Repository deployments use current authored docs. Installed packages use bundled public data.
  try{return await repositoryContent();}catch(error){if(error.code!=='ENOENT')throw error;return JSON.parse(await readFile(new URL('data.json',import.meta.url),'utf8'));}
}
