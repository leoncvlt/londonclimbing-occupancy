const puppeteer = require("puppeteer");
const fs = require("fs");

(async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "https://portal.rockgympro.com/portal/public/a67951f8b19504c3fd14ef92ef27454d/occupancy?&iframeid=occupancyCounter&fId=2183",
    { waitUntil: "load", timeout: 0 }
  );
  const data = await page.evaluate(() => window.data);
  for (const [centre, { capacity, count }] of Object.entries(data)) {
    const filename = `data/${centre}.csv`;
    const pipe = fs.existsSync(filename) ? fs.appendFileSync : fs.writeFileSync;
    pipe(
      filename,
      `${count},${capacity},${new Date().getDay()},${new Date().getHours()}:${new Date().getMinutes()}\n`
    );
  }
})().then(() => process.exit());
