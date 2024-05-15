import puppeteer from "puppeteer";

export const getStockPrice = async (stockTicker: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://finance.yahoo.com/quote/${stockTicker}`, {
    waitUntil: "domcontentloaded",
  });

  const priceOfStock = await page.evaluate(() => {
    const priceElement = document.querySelector(".livePrice") as HTMLElement;
    return priceElement.innerText;
  });

  await browser.close();

  return priceOfStock;
};

export const getHistoricalData = async (
  stockTicker: string,
  day: string | Array<string>
) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  await page.goto(`https://finance.yahoo.com/quote/${stockTicker}/history`, {
    waitUntil: "domcontentloaded",
  });

  const historicalPrice = await page.evaluate((day) => {
    const table = document.querySelector("tbody") as HTMLElement;
    let rtn = {};
    console.log(day);
    for (let i = 0; i < table.children.length; i++) {
      if (day instanceof Array) {
        if (day.includes(table.children[i].children[0].innerHTML)) {
          const date = table.children[i].children[0].innerHTML;
          const open = table.children[i].children[1]?.innerHTML;
          const high = table.children[i].children[2]?.innerHTML;
          const low = table.children[i].children[3]?.innerHTML;
          const close = table.children[i].children[4]?.innerHTML;
          const adjClose = table.children[i].children[5]?.innerHTML;
          const volume = table.children[i].children[6]?.innerHTML;

          rtn[date] = {
            open,
            high,
            low,
            close,
            adjClose,
            volume,
          };
        }
      } else {
        if (table.children[i].children[0].innerHTML == day) {
          console.log("found data");
          const date = table.children[i].children[0].innerHTML;
          const open = table.children[i].children[1]?.innerHTML;
          const high = table.children[i].children[2]?.innerHTML;
          const low = table.children[i].children[3]?.innerHTML;
          const close = table.children[i].children[4]?.innerHTML;
          const adjClose = table.children[i].children[5]?.innerHTML;
          const volume = table.children[i].children[6]?.innerHTML;

          rtn[date] = {
            open,
            high,
            low,
            close,
            adjClose,
            volume,
          };
        }
      }
    }
    return rtn;
  }, day);

  console.log(historicalPrice);

  await browser.close();

  return historicalPrice;
};
