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

export default getInventoryTotal;
