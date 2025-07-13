# JavaScript Promise 教程

## 1. Promise 基本概念

Promise 是 ES6 引入的一种异步编程解决方案，用于表示一个异步操作的最终完成（或失败）及其结果值。Promise 有三种状态：
- 待定（pending）
- 已兑现（fulfilled）
- 已拒绝（rejected）

状态一旦改变就不可逆。

## 2. 创建与用法

```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 成功 */) {
    resolve(value);
  } else {
    reject(error);
  }
});
```

## 3. then、catch、finally

- `then(onFulfilled, onRejected)`：注册成功/失败回调。
- `catch(onRejected)`：注册失败回调，等价于 then(null, onRejected)。
- `finally(onFinally)`：无论成功或失败都会执行。

```js
promise
  .then(result => { /* 成功 */ })
  .catch(error => { /* 失败 */ })
  .finally(() => { /* 总会执行 */ });
```

## 4. 链式调用

then/catch 都会返回一个新的 Promise，可以链式调用。

```js
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## 5. 错误处理

- then 的第二个参数或 catch 捕获错误。
- 链式调用中，错误会冒泡到最近的 catch。

```js
promise
  .then(() => { throw new Error('出错了'); })
  .catch(err => console.error(err));
```

## 6. 常用静态方法

### Promise.resolve / Promise.reject

```js
Promise.resolve(42).then(console.log); // 42
Promise.reject('error').catch(console.error); // error
```

### Promise.all

所有 Promise 成功才成功，有一个失败就失败。

```js
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(err => console.error(err));
```

### Promise.race

第一个完成（无论成功或失败）就返回。

```js
Promise.race([p1, p2, p3])
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

### Promise.allSettled

所有 Promise 都结束后返回每个结果（无论成功或失败）。

```js
Promise.allSettled([p1, p2, p3])
  .then(results => console.log(results));
```

### Promise.any

只要有一个成功就返回，否则抛出 AggregateError。

```js
Promise.any([p1, p2, p3])
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

## 7. 常见陷阱与注意事项

- Promise 状态不可逆。
- then/catch/finally 返回新 Promise。
- 不要在 then/catch 里忘记 return。
- Promise 不是回调的完全替代，async/await 更加简洁。

## 8. 实际案例

### 封装异步操作

```js
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

loadImage('https://example.com/image.png')
  .then(img => document.body.appendChild(img))
  .catch(err => console.error('图片加载失败', err));
```

### 与 async/await 配合

```js
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

## 9. 参考链接

- [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [阮一峰 Promise 教程](https://es6.ruanyifeng.com/#docs/promise)
