// SAYFA SAYISINI ALDIĞIMIZ FONKSİYON
async function totalPages(page1) {
  let totalPages = 1;

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
  return totalPages;
}

export default totalPages;
