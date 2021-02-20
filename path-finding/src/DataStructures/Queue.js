/*Queue
Data structure that follows FIFO
 */

export default class Queue {
  items = {};
  head = 0;
  tail = 0;

  /*enqueues a given item with O(1) time complexity

  @param {any} item - an item to add to the queue
  */
  enQueue(item) {
    this.items[this.tail] = item;
    this.tail++;
  }
  contains(item) {
    return Object.values(this.items).indexOf(item) > -1 ? true : false;
  }

  // dequeues with O(1) time complexity
  deQueue() {
    if (this.size() <= 0) return undefined;

    // get the item at the start of the queue
    var item = this.items[this.head];

    delete this.items[this.head];

    // now there are no items at the head key so we must increment it to point to the next head
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
