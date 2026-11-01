// Rebuild the English move-name variant from the exact upstream PT-BR files.
// Node.js, built-in modules only. Originals are opened read-only.
const fs=require('node:fs'),path=require('node:path'),z=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const spec=require('./moves-en.json');
const source=path.resolve(process.argv[2]||'romfs'),output=path.resolve(process.argv[3]||'build/romfs');
assert.notEqual(source,output,'Use a separate output directory');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['LD_C0_R.BIN','LI_C0_R.IDX'];
const [bin,index]=files.map(name=>{const b=fs.readFileSync(path.join(source,name));assert.equal(hash(b),spec.sourceHashes[name],`Wrong upstream version: ${name}`);return b;});
const align=(n,a)=>Math.ceil(n/a)*a;
function decode(idx,b,n){let at=Number(idx.readBigUInt64LE(n*32)),count=b.readUInt32LE(at+4),p=at+128;assert(count>0&&count<=29);const parts=[];for(let k=0;k<count;k++){let size=b.readUInt32LE(p);if(!size){p=align(p,128);size=b.readUInt32LE(p);}assert(size>0&&p+4+size<=b.length);parts.push(z.inflateSync(b.subarray(p+4,p+4+size)));p+=4+size;}const data=Buffer.concat(parts);assert.equal(data.length,Number(idx.readBigUInt64LE(n*32+8)));return {data,header:Buffer.from(b.subarray(at,at+128))};}
function strings(b){assert.equal(b.readUInt32LE(4),2);const count=b.readUInt32LE(0);assert(count>0&&64+8*count<=b.length);const out=[];for(let i=0;i<count;i++){const p=64+8*i,start=p+b.readUInt32LE(p),end=b.indexOf(0,start);assert(start>=64+count*8&&end>=start);out.push(b.toString('utf8',start,end));}return out;}
const maps={};for(const c of spec.changes)(maps[c.table]??={})[c.entry]=c;
const idx=Buffer.from(index),pieces=[bin];let cursor=bin.length;
for(const [key,changes] of Object.entries(maps)){
 const n=Number(key),{data,header}=decode(index,bin,n),before=strings(data),after=before.map((s,i)=>{if(!changes[i])return s;assert.equal(s,changes[i].before,`Source text mismatch ${n}:${i}`);const t=changes[i].after;assert.deepEqual(s.match(/<[^>]*>/g)||[],t.match(/<[^>]*>/g)||[]);return t;});
 const prefix=Buffer.from(data.subarray(0,64+before.length*8)),parts=[];let offset=prefix.length;
 for(let i=0;i<after.length;i++){const b=Buffer.from(after[i]+'\0','utf8');prefix.writeUInt32LE(offset-64-i*8,64+i*8);parts.push(b);offset+=b.length;}
 const result=Buffer.concat([prefix,...parts,Buffer.alloc(align(offset,8)-offset)]);assert.deepEqual(strings(result),after);
 const count=Math.ceil(result.length/65536);assert(count<=29);header.fill(0,12);header.writeUInt32LE(count,4);header.writeUInt32LE(result.length,8);const blocks=[header];let size=128;
 for(let k=0;k<count;k++){const pad=align(size,128)-size;blocks.push(Buffer.alloc(pad));size+=pad;const compressed=z.deflateSync(result.subarray(k*65536,(k+1)*65536),{level:9}),len=Buffer.alloc(4);len.writeUInt32LE(compressed.length);header.writeUInt32LE(compressed.length+4,12+k*4);blocks.push(len,compressed);size+=4+compressed.length;}
 const block=Buffer.concat([...blocks,Buffer.alloc(align(size,256)-size)]),start=align(cursor,256);pieces.push(Buffer.alloc(start-cursor),block);cursor=start+block.length;idx.writeBigUInt64LE(BigInt(start),n*32);idx.writeBigUInt64LE(BigInt(result.length),n*32+8);idx.writeBigUInt64LE(BigInt(block.length),n*32+16);
}
const patched=Buffer.concat(pieces);assert.deepEqual(patched.subarray(0,bin.length),bin);
for(let n=0;n<index.length/32;n++)if(!maps[n])assert.deepEqual(idx.subarray(n*32,n*32+32),index.subarray(n*32,n*32+32));
fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,files[0]),patched);fs.writeFileSync(path.join(output,files[1]),idx);
const finalBin=fs.readFileSync(path.join(output,files[0])),finalIdx=fs.readFileSync(path.join(output,files[1]));
for(const key of Object.keys(maps)){const n=Number(key),before=strings(decode(index,bin,n).data),after=strings(decode(finalIdx,finalBin,n).data);assert.deepEqual(after,before.map((s,i)=>maps[n][i]?.after??s));}
console.log(JSON.stringify({translatedEntries:spec.changes.length,output,hashes:{[files[0]]:hash(finalBin),[files[1]]:hash(finalIdx)},verified:true},null,2));
