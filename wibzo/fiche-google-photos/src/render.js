const puppeteer = require('C:/Users/ryan/websites/wibzo/pubs-v2/node_modules/puppeteer-core');
const path = require('path');
const S = {logo:[720,720],cover:[1920,1080],steps:[1200,900]};
(async () => {
  const b = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--allow-file-access-from-files']});
  const p = await b.newPage();
  const keys = ['logo','cover','faucon','chene','saule','tiercelin','steps'];
  for (const [i,k] of keys.entries()) {
    const [w,h] = S[k] || [1200,900];
    await p.setViewport({width:w, height:h, deviceScaleFactor:1});
    await p.goto(require('url').pathToFileURL(path.resolve(__dirname,'photo.html')).href + '?k=' + k, {waitUntil:'networkidle0'});
    await p.evaluate(() => document.fonts.ready);
    const out = path.resolve(__dirname,'..', `${i+1}-${k}.jpg`);
    await p.screenshot({path:out, type:'jpeg', quality:90});
    console.log(out);
  }
  await b.close();
})();
