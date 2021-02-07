export default class Queue {
  items = {};
  head = 0;
  tail = 0;

  enQueue(item) {
    this.items[this.tail] = item;
    this.tail++;
  }

  deQueue() {
    var size = this.tail - this.head;
    if (size <= 0) return undefined;

    var item = this.items[this.head];

    delete this.items[this.head];

    this.head++;

    if (this.head === this.tail) {
      this.head = 0;
      this.tail = 0;
    }

    return item;
  }

  size() {
    return this.tail - this.head;
  }

  peek() {
    return this.items[this.head];
  }

  print() {
    var result = [];
    for (let key in this.items) {
      result.push(this.items[key]);
    }
    return result;
  }
}
