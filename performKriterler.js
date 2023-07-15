function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
// SELLERFLASHDAKİ GEREKSİZLERİ SİLDİĞİMİZ FONKSİYON
async function performKriterler(page2) {
  const kriterler = [
    "Kriter Dışı",
    "CA-US Aynı Satıcı",
    "T.M. min 70",
    "CANoSalesRank",
    "CA Satıcı Sayısı <= 1",
    "BB Satıcı Kar Marjı < 16",
    "BB Yok - LW < 14",
  ];

  try {
    for (const kriter of kriterler) {
      await page2.waitForSelector(
        "#app > div > div > div > div.layout-content > div > div > div > div > ul"
      );
      const optionsElement = await page2.$(
        "#app > div > div > div > div.layout-content > div > div > div > div > ul"
      );
      const options = await page2.evaluate(
        (element) =>
          Array.from(element.querySelectorAll("li"), (el) => el.innerText),
        optionsElement
      );

      const kriterElementXPath = `//*[contains(text(), '${kriter}')]`;
      await page2.waitForXPath(kriterElementXPath);
      const kriterElementHandle = await page2.$x(kriterElementXPath);
      await kriterElementHandle[0].click();
      console.log(`Clicked on ${kriter} element`);
      await wait(3000);

      await page2.waitForSelector(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-wrapper > table > thead > tr > th:nth-child(1) > div > div > div"
      );

      const checkboxElement = await page2.$(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-wrapper > table > thead > tr > th:nth-child(1) > div > div > div"
      );
      const checkboxElementClassList = await checkboxElement.evaluate(
        (element) => element.className
      );

      if (checkboxElementClassList.includes("p-disabled")) {
        console.log(
          "Element has 'p-disabled' class. Skipping to the next element."
        );
        continue;
      } else {
        await checkboxElement.click();
        console.log("Clicked on checkbox element");
        await wait(3000); // Bekleme süresini burada ayarlayın
      }

      //Hepsini seç Dropdown
      await page2.waitForSelector(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-header > div.p-grid.table-header-filter.p-ai-center > div.p-col-12.p-xl-9.icon-group > ul > li.custom-dropdown-button > div > div.p-dropdown-trigger > span"
      );
      const dropdownButton = await page2.$(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-header > div.p-grid.table-header-filter.p-ai-center > div.p-col-12.p-xl-9.icon-group > ul > li.custom-dropdown-button > div > div.p-dropdown-trigger > span"
      );
      await dropdownButton.click();
      console.log("Clicked on dropdown button");
      await wait(3000);

      //Arama sonuçlarının tamamı butonunu bulduğumuz kısım
      await page2.waitForSelector(
        "body > div.p-dropdown-panel.p-component > div > ul"
      );

      const dropdownMenuItemList = await page2.$$eval(
        "body > div.p-dropdown-panel.p-component > div > ul li",
        (elements) => elements.map((el) => el.textContent)
      );
      const selectedElement1 = dropdownMenuItemList.find((text) =>
        text.includes("Arama sonuçlarının tamamı")
      );

      if (selectedElement1) {
        const selectedElementIndex =
          dropdownMenuItemList.indexOf(selectedElement1);
        const dropdownMenuItem = await page2.$$(
          "body > div.p-dropdown-panel.p-component > div > ul li"
        );
        await dropdownMenuItem[selectedElementIndex].click();
        console.log("Clicked on dropdown menu item: Arama sonuçlarının tamamı");
        await wait(3000);
      } else {
        console.log("No element found with text 'Arama sonuçlarının tamamı'");
      }

      // Sil Dropdown
      await page2.waitForSelector(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-header > div.p-grid.table-header-filter.p-ai-center > div.p-col-12.p-xl-9.icon-group > ul > li.custom-split-button > button > span.p-dropdown-trigger-icon.pi.pi-chevron-down"
      );
      const splitButton = await page2.$(
        "#app > div > div > div > div.layout-content > div > div > div > div > div > div > div > div > div > div.p-datatable-header > div.p-grid.table-header-filter.p-ai-center > div.p-col-12.p-xl-9.icon-group > ul > li.custom-split-button > button > span.p-dropdown-trigger-icon.pi.pi-chevron-down"
      );
      await splitButton.click();
      console.log("Clicked on split button");
      await wait(3000);

      //Seçilenleri sil butonunu bulduğumuz kısım
      await page2.waitForSelector("#overlay_menu > ul");

      const overlayMenuItemList = await page2.$$eval(
        "#overlay_menu > ul li",
        (elements) => elements.map((el) => el.textContent)
      );
      const selectedElement = overlayMenuItemList.find((text) =>
        text.includes("Seçilenleri Sil")
      );

      if (selectedElement) {
        const selectedElementIndex =
          overlayMenuItemList.indexOf(selectedElement);
        const overlayMenuItem = await page2.$$("#overlay_menu > ul li");
        await overlayMenuItem[selectedElementIndex].click();
        console.log("Clicked on overlay menu item: Seçilenleri Sil");
        await wait(3000); // Bekleme süresini burada ayarlayın
      } else {
        console.log("No element found with text 'Seçilenleri Sil'");
      }

      // Onay verdiğimiz kısım
      await page2.waitForSelector(
        "body > div.p-dialog-mask.p-component-overlay > div > div.p-dialog-footer > button.p-button.p-component.p-button-success"
      );
      const Tamamla = await page2.$(
        "body > div.p-dialog-mask.p-component-overlay > div > div.p-dialog-footer > button.p-button.p-component.p-button-success"
      );
      await Tamamla.click();
      console.log("Clicked on Tamamla Button");
      await wait(1000);

      await page2.waitForSelector(
        "body > div.p-dialog-mask.p-component-overlay > div",
        { hidden: true }
      );
      await wait(5000);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  return null;
}

export default performKriterler;
