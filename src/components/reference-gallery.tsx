"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
const photos = [
 ["workspace", "Website development workspace", "center"],
 ["it-support", "Illustrative computer maintenance", "center"],
 ["networking", "Network equipment", "center"],
 ["development", "Code editor on a laptop", "center"],
 ["restaurant", "Illustrative restaurant website subject", "center"],
 ["workspace", "Detail of a development workspace", "75% center"],
 ["networking", "Detail of network connections", "75% center"],
 ["development", "Detail of a laptop workspace", "25% center"],
];
export function ReferenceGallery() {
 const [ready,setReady]=useState(false);
 const [active,setActive]=useState(0),[hover,setHover]=useState(false),[focused,setFocused]=useState(false),[motion,setMotion]=useState(true),[restart,setRestart]=useState(0);
 useEffect(()=>{setReady(true);const m=matchMedia("(prefers-reduced-motion: reduce)");const sync=()=>setMotion(m.matches);sync();m.addEventListener("change",sync);return()=>m.removeEventListener("change",sync)},[]);
 useEffect(()=>{if(motion||hover||focused)return;const timer=setInterval(()=>setActive(i=>(i+1)%photos.length),5000);return()=>clearInterval(timer)},[motion,hover,focused,restart]);
 function select(i:number){setHover(false);setActive((i+photos.length)%photos.length);setRestart(i=>i+1)}
 return <div className="reference-gallery" aria-label="Illustrative technology gallery" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setRestart(i=>i+1)}} onPointerDown={()=>setFocused(false)} onFocusCapture={e=>{if((e.target as HTMLElement).matches(":focus-visible"))setFocused(true)}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}}>
 <div className="gallery-viewport"><div className="gallery-track">{photos.map(([file,alt,position],i)=><div key={i} className="gallery-photo" hidden={!Array.from({length:3},(_,n)=>(active+n)%photos.length).includes(i)}><Image src={"/images/nexora/"+file+".webp"} alt={alt+" (stock photograph)"} width={800} height={800} style={{objectPosition:position}} loading="lazy"/></div>)}</div><button type="button" hidden={!ready} className="gallery-prev" aria-label="Previous images" onClick={()=>select(active-1)}>&#10094;</button><button type="button" hidden={!ready} className="gallery-next" aria-label="Next images" onClick={()=>select(active+1)}>&#10095;</button></div>
 <div className="gallery-dots" hidden={!ready}>{photos.map((_,i)=><button key={i} type="button" aria-label={"Show image group "+(i+1)} aria-pressed={active===i} onClick={()=>select(i)}><span/></button>)}</div>
 </div>;
}
