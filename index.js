import puppeteer from "puppeteer";
import path from "path";

async function runAutomation() {
  const pathToExtension = path.join(process.cwd(), "SellerFlash");

  function wait(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "Library/Application Support/mumku",
    protocolTimeout: 1000000000,
    defaultViewport: null,
    args: [
      "--user-data-dir",
      `--load-extension=${pathToExtension}`,
      `--disable-extensions-except=${pathToExtension}`,
    ],
  });

  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  await Promise.all([
    page1.goto("https://www.amazon.com"),
    await page2.goto("https://panel.sellerflash.com/inventory", {
      waitUntil: "networkidle0",
    }),
  ]);

  const timeout = 10000000;
  page1.setDefaultTimeout(timeout);
  page2.setDefaultTimeout(timeout);

  // Amazon linklerini içeren dizi
  const amazonLinks = [
    "https://www.amazon.com/s?i=garden&bbn=289668&rh=n%3A1055398%2Cn%3A284507%2Cn%3A289668%2Cn%3A289826%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3Ak2eWXMKs%2FZiUo8%2BAUMW4uvvFqMloRXCSoh8WF8KUPOU&qid=1687626807&rnid=289668&ref=sr_nr_n_19",
    "https://www.amazon.com/s?i=garden&bbn=289672&rh=n%3A1055398%2Cn%3A284507%2Cn%3A289668%2Cn%3A289672%2Cn%3A678652011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AIj2w%2B7HjVK1Dt4plhhnE579ixTMK9vcUP135FT%2FsNrg&qid=1687626829&rnid=289672&ref=sr_nr_n_2",
    "https://www.amazon.com/s?i=garden&bbn=289672&rh=n%3A1055398%2Cn%3A284507%2Cn%3A289668%2Cn%3A289672%2Cn%3A678651011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AulcCt5%2BRoPxiAq%2BX72vM%2Brv%2BOXMpXV7ESMqffS3VErM&qid=1687626829&rnid=289672&ref=sr_nr_n_1",
  ];

  let totalInventory = 0;
  let pagesCanBeScanForFreeSpace = 0;

  while (totalInventory < 49000) {
    await page2.reload();
    await wait(5000);

    await getInventoryTotal(page2);

    let remainingProducts = 49000 - totalInventory;
    let pagesToScan = Math.ceil(remainingProducts / 27);

    if (pagesToScan > 400) {
      pagesCanBeScanForFreeSpace = 400;
    } else {
      pagesCanBeScanForFreeSpace = pagesToScan;
    }

    for (let i = 0; i < amazonLinks.length; i++) {
      //
      //
      // SAYFA SAYISINI ALDIĞIMIZ KISIM
      const amazonLink = amazonLinks[i];

      let totalPages = 1;

      await page1.goto(amazonLink, { waitUntil: "networkidle0" });

      await wait(2000);

      await page1.waitForSelector("#sfButton > img");
      await page1.click("#sfButton > img");
      await wait(1000);

      await page1.waitForSelector("#sfClearFilters");
      await page1.click("#sfClearFilters");
      await wait(1000);

      const selectorExists = await page1.evaluate(() => {
        const selector = ".s-pagination-item.s-pagination-ellipsis";
        return !!document.querySelector(selector);
      });

      if (selectorExists) {
        const elements = await page1.$$eval(
          ".s-pagination-item.s-pagination-disabled",
          (items) => items.map((item) => Number(item.textContent))
        );
        if (elements.length >= 2) {
          totalPages = elements[1];
        }
      } else {
        const paginationItems = await page1.$$eval(
          ".s-pagination-item",
          (items) => items.length
        );
        if (paginationItems > 0) {
          totalPages = paginationItems - 2;
        }
      }

      //
      //
      // EXTENSİON ÜZERİNDEN SEARCH İŞLEMLERİNİ YAPTIĞIMIZ KISIM
      await wait(2000);

      let pageCountMin = 0;
      let pageCountMax = pagesCanBeScanForFreeSpace;

      await page1.waitForSelector("#sfStartSearch");
      const startButton = await page1.$("#sfStartSearch");

      if (pagesCanBeScanForFreeSpace >= totalPages) {
        await page1.waitForSelector("#sfPageCountMin");
        await page1.waitForSelector("#sfPageCountMax");
        const sfPageCountMin = await page1.$("#sfPageCountMin");
        const sfPageCountMax = await page1.$("#sfPageCountMax");

        await sfPageCountMin.evaluate((input) => {
          input.value = 0;
        });
        await sfPageCountMax.evaluate((input, totalPages) => {
          input.value = totalPages;
        }, totalPages);
        await wait(1000);

        // Start the search
        await startButton.evaluate((button) => button.click());
        await wait(1000);

        await page1.waitForFunction(() => {
          const button = document.querySelector("#sfSaveASINsButton");
          return (
            button && button.textContent === "ASIN'leri SellerFlash'a Aktar"
          );
        });

        // Click the button once it changes
        await wait(1500);
        await page1.click("#sfSaveASINsButton");

        await wait(2000);

        const sfSavingInfo = await page1.$("#sfSavingInfo");
        const sfSavingInfoText = await page1.evaluate(
          (element) => element.textContent,
          sfSavingInfo
        );

        if (sfSavingInfoText.includes("ASIN listesi kaydedilemedi.")) {
          console.error(`ASIN listesi kaydedilemedi. ${amazonLinks[i]}`);
        }

        await wait(2000);
        //
        //
      } else {
        if (totalInventory >= 49000) {
          console.log(
            "Total inventory is equal to or greater than 49000. waiting 15mins automation."
          );
          await wait(900000);
          await page2.reload({ waitUntil: "networkidle0" });
          await wait(2000);
        }

        let donguSayisi = Math.ceil(totalPages / pagesCanBeScanForFreeSpace);

        for (let index = 0; index <= donguSayisi; index++) {
          if (totalInventory >= 49000) {
            console.log(
              "Total inventory is equal to or greater than 49000. Stopping automation."
            );
            await wait(900000);
            await page2.reload({ waitUntil: "networkidle0" });
            await wait(2000);
          }

          await page1.waitForSelector("#sfPageCountMin");
          await page1.waitForSelector("#sfPageCountMax");
          const sfPageCountMin = await page1.$("#sfPageCountMin");
          const sfPageCountMax = await page1.$("#sfPageCountMax");

          await sfPageCountMin.evaluate((input, pageCountMin) => {
            input.value = pageCountMin;
          }, pageCountMin);
          await sfPageCountMax.evaluate((input, pageCountMax) => {
            input.value = pageCountMax;
          }, pageCountMax);
          await wait(2000);

          //
          //

          // Start the search
          await startButton.evaluate((button) => button.click());
          await wait(1000);

          await page1.waitForFunction(() => {
            const button = document.querySelector("#sfSaveASINsButton");
            return (
              button && button.textContent === "ASIN'leri SellerFlash'a Aktar"
            );
          });
          // Click the button once it changes
          await wait(1500);

          await page1.click("#sfSaveASINsButton");
          await wait(2000);

          const sfSavingInfo = await page1.$("#sfSavingInfo");
          const sfSavingInfoText = await page1.evaluate(
            (element) => element.textContent,
            sfSavingInfo
          );

          if (sfSavingInfoText.includes("ASIN listesi kaydedilemedi.")) {
            console.error(`ASIN listesi kaydedilemedi. ${amazonLinks[i]}`);
          }

          await wait(900000); // orjinal version da 900000 e çıkarılacak
          await page2.reload({ waitUntil: "networkidle0" });
          await wait(2000);

          await getInventoryTotal(page2);

          remainingProducts = 49000 - totalInventory;
          pagesToScan = Math.ceil(remainingProducts / 27);
          if (pagesToScan <= 3) {
            await page2.reload({ waitUntil: "networkidle0" });
            await wait(3000);
            continue;
          }

          if (pagesToScan > 400) {
            pagesCanBeScanForFreeSpace = 400;
          } else {
            pagesCanBeScanForFreeSpace = pagesToScan;
          }

          pageCountMin = pageCountMax + 1;
          pageCountMax = pageCountMax + pagesCanBeScanForFreeSpace;

          if (pageCountMax >= totalPages) {
            pageCountMax = totalPages;
          }
        }
      }
    }
  }
}

runAutomation();

//
//
// Sellerflash'daki ürün sayısını bulduğumuz fonksiyon.
async function getInventoryTotal(page2) {
  try {
    await page2.waitForSelector(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(1) > a > span:nth-child(1)"
    );
    let magazayaAktarilan = await page2.$eval(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(1) > a > span:nth-child(1)",
      (element) => {
        const text = element.textContent;
        const numericValue = text.match(/\d+/);
        return numericValue ? parseInt(numericValue[0]) : null;
      }
    );

    await page2.waitForSelector(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(2) > a > span:nth-child(1)"
    );
    let kuyrukta = await page2.$eval(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(2) > a > span:nth-child(1)",
      (element) => {
        const text = element.textContent;
        const numericValue = text.match(/\d+/);
        return numericValue ? parseInt(numericValue[0]) : null;
      }
    );

    await page2.waitForSelector(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(3) > a > span:nth-child(1)"
    );
    let onayBekleyen = await page2.$eval(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(3) > a > span:nth-child(1)",
      (element) => {
        const text = element.textContent;
        const numericValue = text.match(/\d+/);
        return numericValue ? parseInt(numericValue[0]) : null;
      }
    );

    await page2.waitForSelector(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(4) > a > span:nth-child(1)"
    );
    let kriterDisi = await page2.$eval(
      "#app > div > div > div > div.layout-content > div > div.layout-content-container > div > div > ul > li:nth-child(4) > a > span:nth-child(1)",
      (element) => {
        const text = element.textContent;
        const numericValue = text.match(/\d+/);
        return numericValue ? parseInt(numericValue[0]) : null;
      }
    );

    let totalInventory =
      magazayaAktarilan + kuyrukta + onayBekleyen + kriterDisi;

    return totalInventory;
  } catch (error) {
    console.log("Seçici bulunamadı: ", error);
    return null;
  }
}
