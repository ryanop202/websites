import sys, asyncio, os, time
from playwright.async_api import async_playwright
OUT=sys.argv[1]; FPS=30
CSS = ".marque,.aide,.badge-demo{display:none!important} *{transition-duration:0s!important}"
INIT = """(()=>{let t=0;let cbs=[];window.__step=ms=>{t+=ms;const l=cbs;cbs=[];l.forEach(f=>{try{f(t)}catch(e){}});};
performance.now=()=>t;const D=Date.now.bind(Date),b=D();Date.now=()=>b+t;
window.requestAnimationFrame=f=>{cbs.push(f);return cbs.length};window.cancelAnimationFrame=()=>{};})()"""
PLAN = [("veranda","Coloris","#bois",7.0),("piscine",None,"#teintes",6.0),("pergola","Bois","#bois",6.0)]
CLICK = """([s,i])=>{const l=[...document.querySelectorAll(s+' button, '+s+' [role=radio]')]; if(l.length) l[i%l.length].click();}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", headless=True, args=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width":432,"height":768}, device_scale_factor=2.5, is_mobile=True, has_touch=True)
        await ctx.add_init_script(INIT)
        await ctx.route("**/api.web3forms.com/**", lambda r: r.abort())
        async def fast(route):
            r = await route.fetch(); body = (await r.text()).replace("autoRotateSpeed = 0.7", "autoRotateSpeed = 4")
            await route.fulfill(response=r, body=body)
        await ctx.route("**/app.js*", fast)
        pg = await ctx.new_page()
        for prod, onglet, sel, dur in PLAN:
            d = f"{OUT}/{prod}"; os.makedirs(d, exist_ok=True)
            await pg.goto(f"http://localhost:8765/?produit={prod}")
            for _ in range(600):
                await pg.evaluate("__step(33.33)")
                if await pg.evaluate("document.getElementById('chargement').hidden"): break
                await pg.wait_for_timeout(20)
            await pg.add_style_tag(content=CSS)
            if onglet:
                await pg.evaluate("""t=>{const b=[...document.querySelectorAll('#onglets > *')].find(x=>x.textContent.includes(t)); b&&b.click();}""", onglet)
            else:
                await pg.evaluate("""s=>{const e=document.querySelector(s).closest('.etape'); const i=[...document.querySelectorAll('.etape')].indexOf(e); document.querySelectorAll('#onglets > *')[i]?.click();}""", sel)
            await pg.evaluate("document.getElementById('btn-tourner').click()")
            for _ in range(20): await pg.evaluate("__step(33.33)")
            n = int(dur*FPS); i = 1; t0=time.time()
            for k in range(n):
                if k % 33 == 20:
                    await pg.evaluate(CLICK, [sel, i]); i += 1
                await pg.evaluate("__step(33.33)")
                await pg.screenshot(path=f"{d}/{k:05d}.jpg", type="jpeg", quality=92)
            print(prod, n, "frames in", round(time.time()-t0), "s")
        await b.close()
asyncio.run(main())
