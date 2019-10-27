export const Arrays = {
  index<T = unknown>(items: T[], item: T) {
    return items.findIndex((currentItem) => currentItem === item);
  },
  swap<T = unknown>(items: T[], from: number, to: number) {
    [ items[from], items[to] ] = [ items[to], items[from] ];

    return items[to];
  }
};
