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
    protocolTimeout: 100000000,
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

  await wait(1000);

  const timeout = 10000000;
  page1.setDefaultTimeout(timeout);
  page2.setDefaultTimeout(timeout);

  // Amazon linklerini içeren dizi
  // Şablon ="'"&A1:A106&"',"
  const amazonLinks = [
    "https://www.amazon.com/s?i=garden&bbn=5315091011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5315091011%2Cn%3A18098892011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A3i022PaoEC32993YmxZ5H2%2FlLxSh89%2BRxzujWkOpNz8&qid=1688253459&rnid=5315091011&ref=sr_nr_n_1",
    "https://www.amazon.com/s?i=garden&bbn=18098916011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5315091011%2Cn%3A18098916011%2Cn%3A18098919011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AP2igpmSQtcXSq5LpO6fLoh%2BWv47n4g70aVDLuXDdjnw&qid=1688253461&rnid=18098916011&ref=sr_nr_n_2",
    "https://www.amazon.com/s?i=garden&bbn=18098901011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098901011%2Cn%3A18098903011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3Az4JTcKdUwAOJpPJOX2upNK931icPNbKZkuGOvlJgKIM&qid=1688253549&rnid=18098901011&ref=sr_nr_n_1",
    "https://www.amazon.com/s?i=garden&bbn=18098901011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098901011%2Cn%3A18098902011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A111f005XAt%2F%2FD2%2B6Au4MfL5bvz8zVAIdCxjvVcb%2Bmcw&qid=1688253549&rnid=18098901011&ref=sr_nr_n_2",
    "https://www.amazon.com/s?i=garden&bbn=18098901011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098901011%2Cn%3A18098904011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AF5jy8Kii%2BGqsrO33V3CIJZHUcuoWVZ%2FFR9PKRI0J%2B%2BU&qid=1688253549&rnid=18098901011&ref=sr_nr_n_4",
    "https://www.amazon.com/s?i=garden&bbn=5298059011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5298059011%2Cn%3A5298060011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A4veen7QXhzoWiGgUowVFGLN8J1uLw8iNytQn1ObHAEw&qid=1688253625&rnid=5298059011&ref=sr_nr_n_1",
    "https://www.amazon.com/s?i=garden&bbn=5298068011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5298059011%2Cn%3A5298068011%2Cn%3A5298069011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3ATjVfluJ4EOP6G5Ehz3AtH0L9aWh%2BL1IGI9uFe5YUGMU&qid=1688253633&rnid=5298068011&ref=sr_nr_n_1",
    "https://www.amazon.com/s?i=garden&bbn=5298068011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5298059011%2Cn%3A5298068011%2Cn%3A5298072011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A4T6y0WpAExP7j4v6RJVPFuRIormWMedo1DcH35j6IW0&qid=1688253633&rnid=5298068011&ref=sr_nr_n_2",
    "https://www.amazon.com/s?i=garden&bbn=5298068011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5298059011%2Cn%3A5298068011%2Cn%3A5298073011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3ABRyx0ftqJWBG%2BXPLyjH78P2ZF5htiDbT6yeB7yleTJI&qid=1688253633&rnid=5298068011&ref=sr_nr_n_3",
    "https://www.amazon.com/s?i=garden&bbn=5298068011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A5298059011%2Cn%3A5298068011%2Cn%3A5298075011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AQNHY5KEtTPubAMCPogOd76RkezOS9go%2ByWjecvQUISs&qid=1688253633&rnid=5298068011&ref=sr_nr_n_4",
  ];

  let totalInventory = 0;
  let pagesCanBeScanForFreeSpace = 0;

  for (let i = 0; i < amazonLinks.length; i++) {
    console.log("totalInventory :>> ", totalInventory);
    console.log("pagesCanBeScanForFreeSpace :>> ", pagesCanBeScanForFreeSpace);
    const index = i + 1; // Indeks bilgisi
    //
    //
    // SAYFA SAYISINI ALDIĞIMIZ KISIM
    const amazonLink = amazonLinks[i];

    await page2.reload();
    console.log("reload çalıştı.");
    await wait(5000);

    await getInventoryTotal(page2);

    let remainingProducts = 49000 - totalInventory;
    let pagesToScan = Math.ceil(remainingProducts / 27);

    if (pagesToScan > 400) {
      pagesCanBeScanForFreeSpace = 400;
    } else {
      pagesCanBeScanForFreeSpace = pagesToScan;
    }

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
        return button && button.textContent === "ASIN'leri SellerFlash'a Aktar";
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
    // Uygulamanın durumunu izleme.
    console.log(`${index}. amazonLink:`, amazonLink);
    if (index === amazonLinks.length) {
      console.log("Son eleman tamamlandı.");
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
    console.log("totalInventory ayrı fonksiyondaki :>> ", totalInventory);
    return totalInventory;
  } catch (error) {
    console.log("Seçici bulunamadı: ", error);
    return null;
  }
}
