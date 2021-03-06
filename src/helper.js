import faker from "faker";

export function fetchData(count = 100) {
  return new Promise((resolve) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const item = faker.helpers.contextualCard();
      item.paragraph = faker.lorem.paragraph();
      result.push(item);
    }
    resolve(result);
  });
}
