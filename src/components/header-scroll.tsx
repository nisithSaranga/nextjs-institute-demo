"use client";
import { useEffect, useRef } from "react";
export function HeaderScroll() {
 const progress=useRef<HTMLDivElement>(null);
 useEffect(()=>{let frame=0;const paint=()=>{document.querySelector(".site-header")?.classList.toggle("scrolled",scrollY>25);const max=document.documentElement.scrollHeight-innerHeight;if(progress.current)progress.current.style.width=(max>0?scrollY/max*100:0)+"%";};const scroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(paint)};paint();addEventListener("scroll",scroll,{passive:true});addEventListener("resize",scroll);return()=>{cancelAnimationFrame(frame);removeEventListener("scroll",scroll);removeEventListener("resize",scroll)}} ,[]);
 return <div ref={progress} className="reading-progress" aria-hidden="true"/>;
}
