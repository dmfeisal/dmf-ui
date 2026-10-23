/** Local Ego Browser helpers. No fixed sleeps; observe the actual component state. */
export async function resetBrowser(page) {
  await page.cdp('Emulation.clearDeviceMetricsOverride');
  await page.cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
  await page.cdp('Emulation.setEmulatedMedia', {features:[]});
  await page.cdp('Emulation.setPageScaleFactor', {pageScaleFactor:1});
}
export async function mobile(page) {
  await page.cdp('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
  await page.cdp('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:1});
}
export async function settle(page, selector = 'body') {
  await page.evaluate(async selector => {
    await document.fonts.ready;
    const element=document.querySelector(selector);
    if(!element) throw new Error(`Missing layout target: ${selector}`);
    const finite=element.getAnimations({subtree:true}).filter(animation=>{
      const end=animation.effect?.getComputedTiming().endTime;
      return Number.isFinite(end)&&end<=3000;
    });
    await Promise.allSettled(finite.map(animation=>animation.finished));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  },selector);
}
async function targetPoint(page, selector) {
  await settle(page);
  return await page.evaluate(async selector=>{
    const trigger=document.querySelector(selector);
    if(!trigger)throw new Error(`Missing touch target: ${selector}`);
    trigger.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const rect=trigger.getBoundingClientRect();
    const point={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
    if(point.x<0||point.x>document.documentElement.clientWidth||point.y<0||point.y>innerHeight)throw new Error(`Touch target outside viewport: ${selector}`);
    return point;
  },selector);
}
export async function tap(page, selector) {
  const point=await targetPoint(page,selector);
  await page.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...point,id:1}]});
  await page.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
export async function hover(page, selector) {
  const point=await targetPoint(page,selector);
  await page.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
}
export async function click(page, selector) {
  const point=await targetPoint(page,selector);
  await page.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
  await page.cdp('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
  await page.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});
}
export async function opened(page, selector) {
  await page.evaluate(selector=>new Promise((resolve,reject)=>{
    const start=performance.now();function check(){
      const element=document.querySelector(selector);
      if(element&&!element.hidden)resolve(true);
      else if(performance.now()-start>3000)reject(new Error(`Component did not open: ${selector}`));
      else requestAnimationFrame(check);
    }check();
  }),selector);
  await settle(page,selector);
}
export async function focused(page, id) {
  await page.evaluate(id=>new Promise((resolve,reject)=>{
    const start=performance.now();function check(){
      if(document.activeElement.id===id)resolve(true);
      else if(performance.now()-start>3000)reject(new Error(`Focus did not return to ${id}`));
      else requestAnimationFrame(check);
    }check();
  }),id);
}
