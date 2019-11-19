export const Arrays = {
  index<T = unknown>(items: T[], item: T) {
    return items.findIndex((currentItem) => currentItem === item);
  },
  swap<T = unknown>(items: T[], from: number, to: number) {
    [ items[from], items[to] ] = [ items[to], items[from] ];

    return items[to];
  },
  remove<T = unknown>(items: T[], item: T) {
    const index = this.index<T>(items, item);

    if (index > -1) {
      return items.splice(index, 1).pop();
    }

    return undefined;
  }
};
