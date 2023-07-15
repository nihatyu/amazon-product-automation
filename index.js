import puppeteer from "puppeteer";
import path from "path";
import performKriterler from "./performKriterler.js";
import getInventoryTotal from "./getInventoryTotal.js";

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function runAutomation() {
  const pathToExtension = path.join(process.cwd(), "SellerFlash");

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
    "https://www.amazon.com/s?i=garden&bbn=23593202011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A23593202011%2Cn%3A367304011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3ASi%2FNDIlSMyD8EV%2FcujA268BYa9p%2BjX2Px1q%2BZjErzy4&qid=1688256313&rnid=23593202011&ref=sr_nr_n_17",
    "https://www.amazon.com/s?i=garden&bbn=23593202011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A23593202011%2Cn%3A367305011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3Af1DD1P0BSeXHdwr%2FYlj4dIb2No7xRn6OTLqtu9L3%2FSk&qid=1688256313&rnid=23593202011&ref=sr_nr_n_18",
    "https://www.amazon.com/s?i=garden&bbn=23593202011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A23593202011%2Cn%3A18581172011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A0myRcP6Whw7KV%2Blp3FguJDbb%2Fqx4SBxYsJ4x2UxSo0c&qid=1688256313&rnid=23593202011&ref=sr_nr_n_19",
    "https://www.amazon.com/s?i=garden&bbn=23593202011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A23593202011%2Cn%3A9298956011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AIisK5IIKiV6XLeqqTWpFUXU7msBwPpT7ou0NMlK9vUs&qid=1688256313&rnid=23593202011&ref=sr_nr_n_20",
    "https://www.amazon.com/s?i=garden&bbn=23593202011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A23593202011%2Cn%3A18581173011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AO7D1wEBoi%2BkuC9v3ywfRuvHG7bxEbaANZzpAMsyL8Q8&qid=1688256313&rnid=23593202011&ref=sr_nr_n_21",
    "https://www.amazon.com/s?i=garden&bbn=367165011&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A367165011%2Cn%3A367186011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AKl5IjP4PxysXtQY7ROQVMiJZAiuszuqlu2ZphS4kqr4&qid=1688253906&rnid=367165011&ref=sr_nr_n_7",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3741971%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A7MwVpgoiXYMGNuYpac3bP4bLQR6CNWkxdKd4CqYiD8Y&qid=1688253902&rnid=1063916&ref=sr_nr_n_13",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A668145011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AWt68LHSYXp%2F41ZWj7qzVPuW%2B0i5Xm%2BoK1ngvT6ASelQ&qid=1688253902&rnid=1063916&ref=sr_nr_n_1",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3735851%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AJzTVsNFz71NOA%2BFrNH9KJh2pM0qfEELszm0MhRTOqzc&qid=1688253902&rnid=1063916&ref=sr_nr_n_2",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3741981%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A346PaRw7bPNGuHq9f05S7gaHzsSEiazoPQOYhJ2bf0Y&qid=1688253902&rnid=1063916&ref=sr_nr_n_3",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3741991%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AlzQJL3M0y7omMuv0%2FJ9Ci4D4PJwjeL31iZhotlDrC0A&qid=1688253902&rnid=1063916&ref=sr_nr_n_4",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A6054384011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AdGFfcV5Zme5f0sLB2GM3oTqyUvSZAI7rSYqcq%2FuRrfU&qid=1688253902&rnid=1063916&ref=sr_nr_n_5",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3741961%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A9l7gKVQdQ811bE885ZY4GHMtrbMDwi9cGUMkIMuCVxo&qid=1688253902&rnid=1063916&ref=sr_nr_n_6",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A644050011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AyMpgKpeiz61Xi%2BbuGMmpqAVBDKmpgWJCS18xymqnB%2Bo&qid=1688253902&rnid=1063916&ref=sr_nr_n_7",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3742001%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AtY78OK%2F11APfUMvu%2BG9Gim1FxRXll5oH9DedYT7dU0g&qid=1688253902&rnid=1063916&ref=sr_nr_n_8",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3742011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AV6WMNADR21T9o0d7%2B859YiI7zVvv8xFwJgdw1dp4qfU&qid=1688253902&rnid=1063916&ref=sr_nr_n_9",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3742021%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AMLPDzBeIB7966JBZZy%2BqCCJe1rleV%2B8X9FOYf7%2FBvvM&qid=1688253902&rnid=1063916&ref=sr_nr_n_10",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3742031%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3ATlGjIraqyqr%2FQ9V%2BUYidYV10fih6p1EqpafesvKoBbU&qid=1688253902&rnid=1063916&ref=sr_nr_n_11",
    "https://www.amazon.com/s?i=garden&bbn=1063916&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A1063916%2Cn%3A3118182011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3AEEsynmF%2Fzca%2B%2F0swuwBbTnkoEVOZNTwvrzAlPUYRW3w&qid=1688253902&rnid=1063916&ref=sr_nr_n_12",
    "https://www.amazon.com/s?i=garden&bbn=13218891&rh=n%3A1055398%2Cn%3A284507%2Cn%3A6054382011%2Cn%3A18098905011%2Cn%3A13218891%2Cn%3A367232011%2Cp_72%3A1248915011%2Cp_36%3A1500-7700&dc&ds=v1%3A0TnVcZb9s1OvvxL4SbnJES8dbP9Afkb60hZpsIIX77w&qid=1688253900&rnid=13218891&ref=sr_nr_n_7",
  ];

  let pagesCanBeScanForFreeSpace;

  for (let i = 0; i < amazonLinks.length; i++) {
    console.log("pagesCanBeScanForFreeSpace :>> ", pagesCanBeScanForFreeSpace);
    const index = i + 1; // Indeks bilgisi
    //
    //
    // SAYFA SAYISINI ALDIĞIMIZ KISIM
    const amazonLink = amazonLinks[i];

    await page2.reload();
    console.log("reload çalıştı.");
    await wait(5000);

    let inventory = await getInventoryTotal(page2);
    console.log("inventory :>> ", inventory);

    let remainingProducts = 49000 - inventory;
    let pagesToScan = Math.ceil(remainingProducts / 27);
    console.log("pagesToScan :>> ", pagesToScan);

    if (pagesToScan > 400) {
      pagesCanBeScanForFreeSpace = 400;
    } else {
      pagesCanBeScanForFreeSpace = pagesToScan;
    }

    // SAYFA SAYISINI ALDIĞIMIZ KISIM !!
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
    // EXTENSİONDA SEARCH İŞLEMLERİNİ YAPTIĞIMIZ KISIM
    await wait(2000);

    let pageCountMin = 0;
    let pageCountMax = pagesCanBeScanForFreeSpace;

    await page1.waitForSelector("#sfStartSearch");
    const startButton = await page1.$("#sfStartSearch");
    //pagesCanBeScanForFreeSpace >= totalPages
    if (inventory < 40000) {
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
      if (inventory >= 40000) {
        console.log(
          "Total inventory is equal to or greater than 49000. waiting 15mins automation."
        );
        await wait(100);
        await page2.reload({ waitUntil: "networkidle0" });

        await performKriterler(page2);

        await wait(3000);
      }

      let donguSayisi = Math.ceil(totalPages / pagesCanBeScanForFreeSpace);

      for (let index = 0; index <= donguSayisi; index++) {
        if (inventory >= 40000) {
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

        await wait(2000);

        inventory = await getInventoryTotal(page2);

        remainingProducts = 49000 - inventory;
        pagesToScan = Math.ceil(remainingProducts / 27);
        if (pagesToScan <= 3) {
          await page2.reload({ waitUntil: "networkidle0" });
          await wait(900000);
          // continue;
          // BURASI ENVANTER DOLU OLDUĞUNDA ALINACAK AKSİYONUN OLDUĞU YER.
          // CONTİNUE BİR SONRAKİ ELEMANA DİREK GEÇİRTİYOR BİZ BUNU İSTEMİYORUZ.
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
