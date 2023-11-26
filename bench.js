
const range1 = (start, end) => {
  const list = [];
  for (let i = start; i <= end; i++ ) {
    list.push(i);
  }
  return list;
}
const range2 = (start, end) => [...Array(end + 1).keys()].slice(start);
const range3 = (start, end) => {
  const list = Array(end - start);
  for (let i = start; i <= end; i++ ) {
    list[i - start] = i;
  }
  return list;
}
const range4 = (start, end) => {
  const list = Array(end - start);
  for (let i = 0; i <= end - start; i++ ) {
    list[i] = start + i;
  }
  return list;
}
const range5 = (start, end) => {
  return [...Array(end - start)].map((_, i) => start + i) //=> [ 0, 1, 2, 3, 4 ]
}
const arr = range5(3, 10);
console.log(arr);

Deno.bench("URL parsing", () => {
  range1(100, 1000000);
});
Deno.bench("URL parsing", () => {
  range2(100, 1000000);
});
Deno.bench("URL parsing", () => {
  range3(100, 1000000);
});
Deno.bench("URL parsing", () => {
  range4(100, 1000000);
});
Deno.bench("URL parsing", () => {
  range5(100, 1000000);
});
