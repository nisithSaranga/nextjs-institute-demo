import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const server=spawn(process.execPath,['scripts/preview.mjs'],{env:{...process.env,PORT:'4177'},windowsHide:true,stdio:['ignore','pipe','inherit']});
const base='http://127.0.0.1:4177'; let browser; const results=[];
try {
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
 await mkdir('test-results/saved-evidence',{recursive:true});
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{window.observers={created:0,disconnected:0};const Original=window.IntersectionObserver;window.IntersectionObserver=class extends Original{constructor(...args){super(...args);window.observers.created++}disconnect(){window.observers.disconnected++;super.disconnect()}};window.entrances=[];document.addEventListener('animationstart',e=>{if(e.animationName==='evidence-enter')window.entrances.push(location.pathname)});});
 const page=await context.newPage();
 for(const route of ['about','services','support','approach','contact']) {
  await page.goto(base+'/'+route+'/');await page.waitForTimeout(800);
  assert.ok(await page.evaluate(()=>window.entrances.length>0),route+' direct entrance');
  await page.reload();await page.waitForTimeout(800);assert.ok(await page.evaluate(()=>window.entrances.length>0),route+' refresh entrance');
  await page.locator('header a[href="/"]').first().click();await page.waitForURL(base+'/');
  await page.locator('header a[href="/'+route+'/"]').first().click();await page.waitForURL(base+'/'+route+'/');await page.waitForTimeout(800);
  assert.ok(await page.evaluate(()=>window.entrances.length>=2),route+' navigation return entrance');
  const lifecycle=await page.evaluate(()=>window.observers);assert.ok(lifecycle.disconnected>0);assert.ok(lifecycle.created>lifecycle.disconnected);
  const below=page.locator('[data-reveal]').last();await below.scrollIntoViewIfNeeded();await page.waitForTimeout(800);assert.equal(await below.evaluate(e=>getComputedStyle(e).opacity),'1');
  results.push(route+': direct/refresh/client return entrance, observer cleanup, below-fold reveal');
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/'+route+'/');
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,35))}scrollTo(0,0)});
   await page.evaluate(async()=>{await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})))});
   await page.screenshot({path:`test-results/saved-evidence/nexora-${route}-${width}.png`,fullPage:true});
   const metrics=await page.evaluate(()=>{const hero=document.querySelector('.evidence-hero'),h1=document.querySelector('h1');return {hero:hero.getBoundingClientRect().height,h1:getComputedStyle(h1).fontSize,weight:getComputedStyle(h1).fontWeight,sections:[...document.querySelectorAll('main>section')].map(e=>({heading:e.querySelector('h2')?.textContent,padding:getComputedStyle(e).padding})),overflow:document.documentElement.scrollWidth>innerWidth}});
   assert.equal(metrics.overflow,false);results.push({route,width,...metrics});
  }
  await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});
 }
 for(const route of ['about','support']){
  await page.goto(base+'/'+route+'/');const pause=page.locator('.evidence-pause');await pause.click();await page.mouse.move(1,1);
  const current=()=>page.locator('.evidence-dots [aria-pressed="true"]').getAttribute('aria-label');const initial=await current();await page.waitForTimeout(5300);assert.equal(await current(),initial);
  await pause.click();await page.mouse.move(1,1);await page.waitForTimeout(5300);assert.notEqual(await current(),initial);
  await page.locator('.evidence-prev').focus();await page.keyboard.press('Tab');const focused=await current();await page.waitForTimeout(5300);assert.equal(await current(),focused);
  results.push(route+': persistent pause/resume and keyboard-focus pause');
 }
 await writeFile('test-results/saved-evidence/local-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser?.close();server.kill()}
