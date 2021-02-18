export default class Queue {
  items = {};
  head = 0;
  tail = 0;

  enQueue(item) {
    // add an item at the key tail and increment the tail
    this.items[this.tail] = item;
    this.tail++;
  }

  contains(item) {
    // check if an item is in the Queue
    return Object.values(this.items).indexOf(item) > -1 ? true : false;
  }

  deQueue() {
    // if the Queue doesn't have any items return nothing
    if (this.size() <= 0) return undefined;

    // get the item at the start of the queue
    var item = this.items[this.head];

    // delte the item at head from items object
    delete this.items[this.head];

    // there are no items at the head key so we must increment it to point to the next head
    this.head++;

    // if the head is the tail then reset both to 0
    if (this.head === this.tail) {
      this.head = 0;
      this.tail = 0;
    }

    // return the head item
    return item;
  }

  size() {
    // return the size of Queue
    return this.tail - this.head;
  }

  peek() {
    // peek at the first item
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
