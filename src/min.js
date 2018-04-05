const puppeteer = require('puppeteer');
const {mn} = require('./config/default');
const srcToimg = require('./help/srcToimg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://image.baidu.com/');
  console.log('go to https://image.baidu.com/');

  await page.setViewport({
    width:1920,
    height:1080
  });
  console.log('change viewport');

  await page.focus('#kw');
  console.log('focus');
  await page.keyboard.sendCharacter('吴亦凡');
  console.log('kris');
  await page.click('.s_search');
  console.log('go to search list');

  page.on('load',async () => {
    console.log('page loading done, start fetch..');

    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      console.log(images);
      return Array.prototype.map.call(images, img => img.src);
    });
    console.log(`get ${srcs.length} images`);
    srcs.forEach(async(src) => {
       await page.waitFor(5000);
       await srcToimg(src, mn);
    });

    await browser.close();
  });



})();