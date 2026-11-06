import sys, asyncio, os
from playwright.async_api import async_playwright
mode = sys.argv[1]  # "keys" ou "all"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page(viewport={"width":1080,"height":1920})
        pg.on("console", lambda m: print("console:", m.text))
        pg.on("pageerror", lambda e: print("ERR:", e))
        await pg.goto("http://localhost:8766/motion.html", wait_until="networkidle")
        await pg.evaluate("window.ready")
        if mode == "keys":
            ts = [float(x) for x in sys.argv[2].split(",")]
            for t in ts:
                await pg.evaluate(f"render({t})"); await pg.screenshot(path=f"k_{t:05.2f}.jpg", type="jpeg", quality=85)
        else:
            os.makedirs("mf", exist_ok=True)
            for k in range(int(13.0*30)):
                await pg.evaluate(f"render({k/30})")
                await pg.screenshot(path=f"mf/{k:05d}.jpg", type="jpeg", quality=93)
        await b.close()
asyncio.run(main())
