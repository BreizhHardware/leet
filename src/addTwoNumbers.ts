class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function listToInt(l: ListNode | null): bigint {
  let num = 0n;
  let factor = 1n;
  while (l) {
    num += BigInt(l.val) * factor;
    factor *= 10n;
    l = l.next;
  }
  return num;
}

function intToList(num: bigint): ListNode | null {
  if (num === 0n) return new ListNode(0);
  let dummy = new ListNode();
  let curr = dummy;
  while (num > 0n) {
    curr.next = new ListNode(Number(num % 10n));
    curr = curr.next;
    num /= 10n;
  }
  return dummy.next;
}

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  const a = listToInt(l1);
  const b = listToInt(l2);
  return intToList(a + b);
}
