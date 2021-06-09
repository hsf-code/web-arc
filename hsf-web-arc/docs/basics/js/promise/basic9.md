---
title: 手写 Promise 全家桶 + Generator + async/await
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## **手写 Promise 全家桶**

**Promise/A+ 规范**[4]镇楼！

如果你没读过 Promise/A+ 规范也没关系，我帮你总结了如下三部分重点：

不过建议看完本文后还是要亲自去读一读，不多 bb，开始展示。

https://mmbiz.qpic.cn/mmbiz_jpg/WmXepF87uPkgfPuymN9XP4Y176EyyhEpHl4MMAzB4jaLB4PsrayLFt0OicHrfYiaqXsHUbSebKspzyWmUS4icrOQw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **规范重点**

### **1.Promise 状态**

Promise 的三个状态分别是 `pending`、`fulfilled` 和 `rejected`。

- `pending`: 待定，Promise 的初始状态。在此状态下可以`落定 (settled)` 为 `fulfilled` 或 `rejected`状态。
- `fulfilled`: 兑现(解决)，表示执行成功。Promise 被 resolve 后的状态，状态不可再改变，且有一个私有的值 value。
- `rejected`: 拒绝，表示执行失败。Promise 被 reject 后的状态，状态不可再改变，且有一个私有的原因 reason。

注意：value 和 reason 也是不可变的，它们包含原始值或对象的不可修改的引用，默认值为 `undefined`。

### **2.Then 方法**

要求必须提供一个 then 方法来访问当前或最终的 value 或 reason。

```
promise.then(onFulfilled, onRejected)
```

- `1.then 方法接受两个函数作为参数，且参数可选。`
- `2.如果可选参数不为函数时会被忽略。`
- `3.两个函数都是异步执行，会放入事件队列等待下一轮 tick。`
- `4.当调用 onFulfilled 函数时，会将当前 Promise 的 value 值作为参数传入。`
- `5.当调用 onRejected 函数时，会将当前 Promise 的 reason 失败原因作为参数传入。`
- `6.then 函数的返回值为 Promise。`
- `7.then 可以被同一个 Promise 多次调用。`

### **3.Promise 解决过程**

Promise 的解决过程是一个抽象操作，接收一个 Promise 和一个值 x。

针对 x 的不同值处理以下几种情况：

- `1.x 等于 Promise`

抛出 TypeError 错误，拒绝 Promise。

- `2.x 是 Promise 的实例`

如果 x 处于待定状态，那么 Promise 继续等待直到 x 兑现或拒绝，否则根据 x 的状态兑现/拒绝 Promise。

- `3.x 是对象或函数`

取出 x.then 并调用，调用时将 this 指向 x。将 then 回调函数中得到的结果 y 传入新的 Promise 解决过程中，递归调用。

如果执行报错，则将以对应的失败原因拒绝 Promise。

这种情况就是处理拥有 then() 函数的对象或函数，我们也叫它 `thenable`。

- `4.如果 x 不是对象或函数`

以 x 作为值执行 Promise。

## **手写 Promise**

### **1.首先定义 Promise 的三个状态**

```
var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
```

### **2.我们再来搞定 Promise 的构造函数**

创建 Promise 时需要传入 `execute` 回调函数，接收两个参数，这两个参数分别用来兑现和拒绝当前 Promise。

所以我们需要定义 `resolve()` 和 `reject()` 函数。

初始状态为 `PENDING`，在执行时可能会有返回值 `value`，在拒绝时会有拒绝原因 `reason`。

同时需要注意，Promise 内部的异常不能直接抛出，需要进行异常捕获。

```
function Promise(execute) {
    var that = this;
    that.state = PENDING;
    function resolve(value) {
        if (that.state === PENDING) {
            that.state = FULFILLED;
            that.value = value;
        }
    }
    function reject(reason) {
        if (that.state === PENDING) {
            that.state = REJECTED;
            that.reason = reason;
        }
    }
    try {
        execute(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
```

### **3. 实现 then() 方法**

`then` 方法用来注册当前 Promise 状态落定后的回调，每个 Promise 实例都需要有它，显然要写到 Promise 的原型 `prototype` 上，并且 then() 函数接收两个回调函数作为参数，分别是 `onFulfilled` 和 `onRejected`。

```
Promise.prototype.then = function(onFulfilled, onRejected) {}
```

根据上面第 2 条规则，如果可选参数不为函数时应该被忽略，我们要对参数进行如下判断。

```
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(x) { return x; }
onRejected = typeof onRejected === 'function' ? onRejected : function(e) { throw e; }
```

根据第 3 条规则，需要使用 `setTimeout` 延迟执行，模拟异步。

根据第 4 条、第 5 条规则，需要根据 Promise 的状态来执行对应的回调函数。

在 PENDING 状态时，需要等到状态落定才能调用。我们可以将 onFulfilled 和 onRejected 函数存到 Promise 的属性 `onFulfilledFn` 和 `onRejectedFn` 中，

当状态改变时分别调用它们。

```
var that = this;
var promise;
if (that.state === FULFILLED) {
    setTimeout(function() {
        onFulfilled(that.value);
    });
}
if (that.state === REJECTED) {
    setTimeout(function() {
        onRejected(that.reason);
    });
}
if (that.state === PENDING) {
     that.onFulfilledFn = function() {
        onFulfilled(that.value);
    }
    that.onRejectedFn = function() {
        onRejected(that.reason);
    }
}
```

根据第 6 条规则，then 函数的返回值为 Promise，我们分别给每个逻辑添加并返回一个 Promise。

同时，then 支持链式调用，我们需要将 onFulfilledFn 和 onRejectedFn 改成数组。

```
var that = this;
var promise;
if (that.state === FULFILLED) {
    promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            try {
                onFulfilled(that.value);
            } catch (reason) {
                reject(reason);
            }
        });
    });
}
if (that.state === REJECTED) {
    promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            try {
                onRejected(that.reason);
            } catch (reason) {
                reject(reason);
            }
        });
    });
}
if (that.state === PENDING) {
    promise = new Promise(function(resolve, reject) {
        that.onFulfilledFn.push(function() {
            try {
                onFulfilled(that.value);
            } catch (reason) {
                reject(reason);
            }
        })
        that.onRejectedFn.push(function() {
            try {
                onRejected(that.reason);
            } catch (reason) {
                reject(reason);
            }
        });
    });
}
```

与上面相对应的，再将 Promise 的构造函数相应的进行改造。

- `1.添加 onFulFilledFn 和 onRejectedFn 数组。`
- `2.resolve() 和 reject() 函数改变状态时，需要异步调用数组中的函数，同样使用 setTimeout 来模拟异步。`

```
function Promise(execute) {
    var that = this;
    that.state = PENDING;
    that.onFulfilledFn = [];
    that.onRejectedFn = [];

    function resolve(value) {
        setTimeout(function() {
            if (that.state === PENDING) {
                that.state = FULFILLED;
                that.value = value;
                that.onFulfilledFn.forEach(function(fn) {
                    fn(that.value);
                })
            }
        })
    }
    function reject(reason) {
        setTimeout(function() {
            if (that.state === PENDING) {
                that.state = REJECTED;
                that.reason = reason;
                that.onRejectedFn.forEach(function(fn) {
                    fn(that.reason);
                })
            }
        })
    }
    try {
        execute(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
```

### **4.Promise 解决过程 resolvePromise()**

Promise 解决过程分为以下几种情况，我们需要分别进行处理：

```
1.x 等于 Promise TypeError 错误
```

此时相当于 Promise.then 之后 return 了自己，因为 then 会等待 return 后的 Promise，导致自己等待自己，一直处于等待。。

```
function resolvePromise(promise, x) {
    if (promise === x) {
        return reject(new TypeError('x 不能等于 promise'));
    }
}
2.x 是 Promise 的实例
```

如果 x 处于待定状态，Promise 会继续等待直到 x 兑现或拒绝，否则根据 x 的状态兑现/拒绝 Promise。

我们需要调用 Promise 在构造时的函数 resolve() 和 reject() 来改变 Promise 的状态。

```
function resolvePromise(promise, x, resolve, reject) {
// ...
    if (x instanceof Promise) {
        if (x.state === FULFILLED) {
            resolve(x.value);
        } else if (x.state === REJECTED) {
            reject(x.reason);
        } else {
            x.then(function(y) {
                resolvePromise(promise, y, resolve, reject);
            }, reject);
        }
    }
}
3.x 是对象或函数
```

取出 x.then 并调用，调用时将 this 指向 x，将 then 回调函数中得到的结果 y 传入新的 Promise 解决过程中，递归调用。

如果执行报错，则将以对应的失败原因拒绝 Promise。

x 可能是一个 thenable 而非真正的 Promise。

需要设置一个变量 `executed` 避免重复调用。

```
function resolvePromise(promise, x, resolve, reject) {
// ...
    if ((x !== null) && ((typeof x === 'object' || (typeof x === 'function'))) {
        var executed;
        try {
            var then = x.then;
            if (typeof then === 'function') {
                then.call(x, function(y) {
                    if (executed) return;
                    executed = true;
                    return resolvePromise(promise, y, resolve, reject);
                }, function (e) {
                    if (executed) return;
                    executed = true;
                    reject(e);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (executed) return;
            executed = true;
            reject(e);
        }
    }
}
4.直接将 x 作为值执行
function resolvePromise(promise, x, resolve, reject) {
// ...
    resolve(x)
}
```

## **测试**

```
// 为了支持测试，将模块导出
module.exports = {
  deferred() {
    var resolve;
    var reject;
    var promise = new Promise(function (res, rej) {
      resolve = res;
      reject = rej;
    })
    return {
      promise,
      resolve,
      reject
    }
  }
}
```

我们可以选用这款测试工具对我们写的 Promise 进行测试 **Promise/A+ 测试工具: promises-aplus-tests**[5]。

目前支持 827 个测试用例，我们只需要在导出模块的时候遵循 CommonJS 规范，按照要求导出对应的函数即可。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

## **Promise.resolve**

`Promise.resolve()` 可以实例化一个解决(fulfilled) 的 Promise。

```
Promise.resolve = function(value) {
    if (value instanceof Promise) {
        return value;
    }

    return new Promise(function(resolve, reject) {
        resolve(value);
    });
}
```

## **Promise.reject**

`Promise.reject()` 可以实例化一个 rejected 的 Promise 并抛出一个异步错误（这个错误不能通过try/catch捕获，只能通过拒绝处理程序捕获）

```
Promise.reject = function(reason) {
    return new Promise(function(resolve, reject) {
        reject(reason);
    });
}
```

## **Promise.prototype.catch**

`Promise.prototype.catch()` 方法用于给 Promise 添加拒绝时的回调函数。

```
Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}
```

## **Promise.prototype.finally**

`Promise.prototype.finally()` 方法用于给 Promise 添加一个不管最终状态如何都会执行的操作。

```
Promise.prototype.finally = function(fn) {
    return this.then(function(value) {
        return Promise.resolve(value).then(function() {
            return value;
        });
    }, function(error) {
        return Promise.resolve(reason).then(function() {
            throw error;
        });
    });
}
```

## **Promise.all**

`Promise.all()` 方法会将多个 Promise 实例组合成一个新的 Promise 实例。

组合后的 Promise 实例只有当每个包含的 Promise 实例都解决(fulfilled)后才解决(fulfilled)，如果有一个包含的 Promise 实例拒绝(rejected)了，则合成的 Promise 也会拒绝(rejected)。

两个注意点：

- 传入的是可迭代对象，用 for...of 遍历 Iterable 更安全
- 传入的每个实例不一定是 Promise，需要用 Promise.resolve() 包装

```
Promise.all = function(promiseArr) {
    return new Promise(function(resolve, reject) {
        const length = promiseArr.length;
        const result = [];
        let count = 0;
        if (length === 0) {
            return resolve(result);
        }

        for (let item of promiseArr) {
            Promise.resolve(item).then(function(data) {
                result[count++] = data;
                if (count === length) {
                    resolve(result);
                }
            }, function(reason) {
                reject(reason);
            });
        }
    });
}
```

## **Promise.race**

`Promise.race()` 同样返回一个合成的 Promise 实例，其会返回这一组中最先解决(fulfilled)或拒绝(rejected)的 Promise 实例的返回值。

```
Promise.race = function(promiseArr) {
    return new Promise(function(resolve, reject) {
        const length = promiseArr.length;
        if (length === 0) {
            return resolve();
        }

        for (let item of promiseArr) {
            Promise.resolve(item).then(function(value) {
                return resolve(value);
            }, function(reason) {
                return reject(reason);
            });
        }
    });
}
```

## **Promise.any**

`Promise.any() 相当于 Promise.all() 的反向操作`，同样返回一个合成的 Promise 实例，只要其中包含的任何一个 Promise 实例解决(fulfilled)了，合成的 Promise 就解决(fulfilled)。

只有当每个包含的 Promise 都拒绝(rejected)了，合成的 Promise 才拒绝(rejected)。

https://mmbiz.qpic.cn/mmbiz_gif/WmXepF87uPkgfPuymN9XP4Y176EyyhEpovoIpcibovjR1PGL5otWDsLCp5PRjn7TfKNPoIaJzMbPAibjqJe6Gumw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1

```
Promise.any = function(promiseArr) {
    return new Promise(function(resolve, reject) {
        const length = promiseArr.length;
        const result = [];
        let count = 0;
        if (length === 0) {
            return resolve(result);
        }

        for (let item of promiseArr) {
            Promise.resolve(item).then((value) => {
                return resolve(value);
            }, (reason) => {
                result[count++] = reason;
                if (count === length) {
                    reject(result);
                }
            });
        }
    });
}
```

## **Promise.allSettled**

`Promise.allSettled()` 方法也是返回一个合成的 Promise，不过只有等到所有包含的每个 Promise 实例都返回结果落定时，不管是解决(fulfilled)还是拒绝(rejected)，合成的 Promise 才会结束。一旦结束，状态总是 fulfilled。

其返回的是一个对象数组，每个对象表示对应的 Promise 结果。

对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason 。

```
Promise.allSettled = function(promiseArr) {
  return new Promise(function(resolve) {
    const length = promiseArr.length;
    const result = [];
    let count = 0;

    if (length === 0) {
      return resolve(result);
    } else {
      for (let item of promiseArr) {
        Promise.resolve(item).then((value) => {
            result[count++] = { status: 'fulfilled', value: value };
            if (count === length) {
                return resolve(result);
            }
        }, (reason) => {
            result[count++] = { status: 'rejected', reason: reason };
            if (count === length) {
                return resolve(result);
            }
        });
      }
    }
  });
}

// 使用 Promise.finally 实现
Promise.allSettled = function(promises) {
// 也可以使用扩展运算符将 Iterator 转换成数组
// const promiseArr = [...promises]
    const promiseArr = Array.from(promises)
    return new Promise(resolve => {
        const result = []
        const len = promiseArr.length;
        let count = len;
        if (len === 0) {
          return resolve(result);
        }
        for (let i = 0; i < len; i++) {
            promiseArr[i].then((value) => {
                result[i] = { status: 'fulfilled', value: value };
            }, (reason) => {
                result[i] = { status: 'rejected', reason: reason };
            }).finally(() => {
                if (!--count) {
                    resolve(result);
                }
            });
        }
    });
}

// 使用 Promise.all 实现
Promise.allSettled = function(promises) {
// 也可以使用扩展运算符将 Iterator 转换成数组
// const promiseArr = [...promises]
    const promiseArr = Array.from(promises)
    return Promise.all(promiseArr.map(p => Promise.resolve(p).then(res => {
      return { status: 'fulfilled', value: res }
    }, error => {
      return { status: 'rejected', reason: error }
    })));
};
```

## **手写 Generator 函数**

先来简单回顾下 Generator 的使用：

```
function* webCanteenGenerator() {
    yield '店小二儿，给我切两斤牛肉来';
    yield '再来十八碗酒';
    return '好酒！这酒有力气！';
}

var canteen = webCanteenGenerator();
canteen.next();
canteen.next();
canteen.next();
canteen.next();

// {value: "店小二儿，给我切两斤牛肉来", done: false}
// {value: "再来十八碗酒", done: false}
// {value: "好酒！这酒有力气！", done: true}
// {value: undefined, done: true}
```

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
// 简易版
// 定义生成器函数，入参是任意集合
function webCanteenGenerator(list) {
    var index = 0;
    var len = list.length;
    return {
// 定义 next 方法
// 记录每次遍历位置，实现闭包，借助自由变量做迭代过程中的“游标”
        next: function() {
            var done = index >= len;// 如果索引还没有超出集合长度，done 为 false
            var value = !done ? list[index++] : undefined;// 如果 done 为 false，则可以继续取值
// 返回遍历是否完毕的状态和当前值
            return {
                done: done,
                value: value
            }
        }
    }
}

var canteen = webCanteenGenerator(['道路千万条', '安全第一条', '行车不规范']);
canteen.next();
canteen.next();
canteen.next();

// {done: false, value: "道路千万条"}
// {done: false, value: "安全第一条"}
// {done: false, value: "行车不规范"}
// {done: true, value: undefined}
```

https://mmbiz.qpic.cn/mmbiz_jpg/WmXepF87uPkgfPuymN9XP4Y176EyyhEpp1gsBKbKHX8WyfR6iciagm5bFHYpt2ADXNfF2M9uSLDS27115cfdqPRg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **手写 async/await**

Generator 缺陷：

- 1.函数外部无法捕获异常
- 2.多个 yield 会导致调试困难

async 函数对 Generator 函数改进如下：

- 1.内置执行器
- 2.更好的语义
- 3.更广的适用性
- 4.返回值是 Promise

async/await 做的事情就是将 Generator 函数转换成 Promise，说白了，async 函数就是 Generator 函数的语法糖，await 命令就是内部 then 命令的语法糖。

```
const fetchData = (data) => new Promise((resolve) => setTimeout(resolve, 1000, data + 1))

const fetchResult = async function () {
    var result1 = await fetchData(1);
    var result2 = await fetchData(result1);
    var result3 = await fetchData(result2);
    console.log(result3);
}

fetchResult();
```

可以尝试通过 **Babel**[8] 官网转换一下上述代码，可以看到其核心就是 `_asyncToGenerator` 方法。

我们下面来实现它。

```
function asyncToGenerator(generatorFn) {
// 将 Generator 函数包装成了一个新的匿名函数，调用这个匿名函数时返回一个 Promise
    return function() {
// 生成迭代器，相当于执行 Generator 函数
// 如上面三碗不过岗例子中的 var canteen = webCanteenGenerator()
        var gen = generatorFn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
// 利用 Generator 分割代码片段，每一个 yield 用 Promise 包裹起来
// 递归调用 Generator 函数对应的迭代器，当迭代器执行完成时执行当前的 Promise，失败时则拒绝 Promise
            function step(key, arg) {
                try {
                    var info = gen[key](arg "key");
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }

                if (info.done) {
// 递归终止条件，完成了就 resolve
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function(value) {
                        step('next', value);
                    }, function(err) {
                        step('throw', err);
                    });
                }
            }
            return step('next');
        });
    }
}
```

好了，本文到这里就告一段落，如果上述代码你发现有问题的地方，可以在评论区留言，一起探讨学习。



