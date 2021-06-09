---
title: setTimeout 实现机制与原理
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

`setTimeout` 方法，就是一个定时器，用来指定某个函数在多少毫秒之后执行。它会返回一个整数，表示定时器的编号，同时你还可以通过该编号来取消这个定时器：

```
function showName(){
    console.log("Hello")
}
let timerID = setTimeout(showName, 1000);
// 在 1 秒后打印 “Hello”
```

`setTimeout` 的第一个参数是一个将被延迟执行的函数， `setTimeout` 的第二个参数是延时（多少毫秒）。

如果使用 `setTimeout` 延迟的函数需要携带参数，我们可以把参数放在 `setTimeout` 里（放在已知的两个参数后）来中转参数给需要延迟执行的函数。

```
var timeoutID1 = setTimeout(function[, delay, arg1, arg2, ...]);
var timeoutID2 = setTimeout(function[, delay]);
var timeoutID3 = setTimeout(code[, delay]);
```

- 第一个参数为函数或可执行的字符串(比如 `alert('test')` ，此法不建议使用)
- 第二个参数 `为延迟毫秒数` ，可选的，默认值为 0
- 第三个及后面的参数为函数的入参
- `setTimeout` 的返回值是一个数字，这个成为 `timeoutID` ，可以用于取消该定时器

### **手写一个简单 setTimeout 函数**

感谢 @coolliyong 的提醒，这里调整一下

```
let setTimeout = (fn, timeout, ...args) => {
// 初始当前时间
  const start = +new Date()
  let timer, now
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
// 再次运行时获取当前时间
    now = +new Date()
// 当前运行时间 - 初始当前时间 >= 等待时间 ===>> 跳出
    if (now - start >= timeout) {
      fn.apply(this, args)
      window.cancelAnimationFrame(timer)
    }
  }
  window.requestAnimationFrame(loop)
}

function showName(){
    console.log("Hello")
}
let timerID = setTimeout(showName, 1000);
// 在 1 秒后打印 “Hello”
```

> 注意：JavaScript 定时器函数像 setTimeout 和 setInterval 都不是 ECMAScript 规范或者任何 JavaScript 实现的一部分。定时器功能由浏览器实现，它们的实现在不同浏览器之间会有所不同。 定时器也可以由 Node.js 运行时本身实现。在浏览器里主要的定时器函数是作为 Window 对象的接口，Window 对象同时拥有很多其他方法和对象。该接口使其所有元素在 JavaScript 全局作用域中都可用。这就是为什么你可以直接在浏览器控制台执行 setTimeout 。在 node 里，定时器是 global 对象的一部分，这点很像浏览器中的 Window 。你可以在 Node里看到定时器的源码 这里 ，在浏览器中定时器的源码在 这里 。

### **setTimeout 在浏览器中的实现**

浏览器渲染进程中所有运行在主线程上的任务都需要先添加到消息队列，然后事件循环系统再按照顺序执行消息队列中的任务。

在 Chrome 中除了正常使用的消息队列之外，还有另外一个消息队列，这个队列中维护了需要延迟执行的任务列表，包括了定时器和 Chromium 内部一些需要延迟执行的任务。所以当通过 JavaScript 创建一个定时器时，渲染进程会将该定时器的回调任务添加到延迟队列中。

源码中延迟执行队列的定义如下所示：

```
DelayedIncomingQueue delayed_incoming_queue;
```

当通过 `JavaScript` 调用 `setTimeout` 设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数 `showName` 、当前发起时间、延迟执行时间，其模拟代码如下所示：

```
struct DelayTask{
    int64 id；
    CallBackFunction cbf;
    int start_time;
    int delay_time;
};
DelayTask timerTask;
timerTask.cbf = showName;
timerTask.start_time = getCurrentTime();//获取当前时间
timerTask.delay_time = 200;//设置延迟执行时间
```

创建好回调任务之后，再将该任务添加到延迟执行队列中，代码如下所示：

```
delayed_incoming_queue.push(timerTask)；
```

现在通过定时器发起的任务就被保存到延迟队列中了，那接下来我们再来看看消息循环系统是怎么触发延迟队列的。

```
void ProcessTimerTask(){
//从delayed_incoming_queue中取出已经到期的定时器任务
//依次执行这些任务
}

TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  for(;;){
//执行消息队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);

//执行延迟队列中的任务
    ProcessDelayTask()

    if(!keep_running)//如果设置了退出标志，那么直接退出线程循环
        break;
  }
}
```

从上面代码可以看出来，我们添加了一个 `ProcessDelayTask` 函数，该函数是专门用来处理延迟执行任务的。这里我们要重点关注它的执行时机，在上段代码中，处理完消息队列中的一个任务之后，就开始执行 `ProcessDelayTask` 函数。`ProcessDelayTask` 函数会根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程。通过这样的方式，一个完整的定时器就实现了。

设置一个定时器，`JavaScript` 引擎会返回一个定时器的 `ID`。那通常情况下，当一个定时器的任务还没有被执行的时候，也是可以取消的，具体方法是调用 `clearTimeout` 函数，并传入需要取消的定时器的 `ID` 。如下面代码所示：`clearTimeout(timer_id)` 其实浏览器内部实现取消定时器的操作也是非常简单的，就是直接从 `delayed_incoming_queue` 延迟队列中，通过`ID` 查找到对应的任务，然后再将其从队列中删除掉就可以了。

来源：浏览器工程与实践（极客时间）：https://time.geekbang.org/column/article/134456

### **setTimeout 在 nodejs 中的实现**

`setTimeout` 是在系统启动的时候挂载的全局函数。代码在 `timer.js` 。

```
function setupGlobalTimeouts() {
    const timers = NativeModule.require('timers');
    global.clearImmediate = timers.clearImmediate;
    global.clearInterval = timers.clearInterval;
    global.clearTimeout = timers.clearTimeout;
    global.setImmediate = timers.setImmediate;
    global.setInterval = timers.setInterval;
    global.setTimeout = timers.setTimeout;
  }
```

我们先看一下 `setTimeout` 函数的代码。

```
function setTimeout(callback, after, arg1, arg2, arg3) {
  if (typeof callback !== 'function') {
    throw new errors.TypeError('ERR_INVALID_CALLBACK');
  }

  var i, args;
  switch (arguments.length) {
// fast cases
    case 1:
    case 2:
      break;
    case 3:
      args = [arg1];
      break;
    case 4:
      args = [arg1, arg2];
      break;
    default:
      args = [arg1, arg2, arg3];
      for (i = 5; i < arguments.length; i++) {
// extend array dynamically, makes .apply run much faster in v6.0.0
        args[i - 2] = arguments[i];
      }
      break;
  }
// 新建一个对象，保存回调，超时时间等数据，是超时哈希队列的节点
  const timeout = new Timeout(callback, after, args, false, false);
// 启动超时器
  active(timeout);
// 返回一个对象
  return timeout;
}
```

其中 `Timeout` 函数在 `lib/internal/timer.js` 里定义。

```
function Timeout(callback, after, args, isRepeat, isUnrefed) {
  after *= 1;// coalesce to number or NaN
  this._called = false;
  this._idleTimeout = after;
  this._idlePrev = this;
  this._idleNext = this;
  this._idleStart = null;
  this._onTimeout = null;
  this._onTimeout = callback;
  this._timerArgs = args;
  this._repeat = isRepeat ? after : null;
  this._destroyed = false;

  this[unrefedSymbol] = isUnrefed;

  this[async_id_symbol] = ++async_id_fields[kAsyncIdCounter];
  this[trigger_async_id_symbol] = getDefaultTriggerAsyncId();
  if (async_hook_fields[kInit] > 0) {
    emitInit(this[async_id_symbol],
             'Timeout',
             this[trigger_async_id_symbol],
             this);
  }
}
```

由代码可知，首先创建一个保存相关信息的对象，然后执行 `active` 函数。

```
const active = exports.active = function(item) {
// 插入一个超时对象到超时队列
  insert(item, false);
}
function insert(item, unrefed, start) {
// 超时时间
  const msecs = item._idleTimeout;
  if (msecs < 0 || msecs === undefined) return;
// 如果传了start则计算是否超时时以start为起点，否则取当前的时间
  if (typeof start === 'number') {
    item._idleStart = start;
  } else {
    item._idleStart = TimerWrap.now();
  }
// 哈希队列
  const lists = unrefed === true ? unrefedLists : refedLists;
  var list = lists[msecs];
// 没有则新建一个队列
  if (list === undefined) {
    debug('no %d list was found in insert, creating a new one', msecs);
    lists[msecs] = list = new TimersList(msecs, unrefed);
  }

 ...
// 把超时节点插入超时队列
  L.append(list, item);
  assert(!L.isEmpty(list));// list is not empty
}
```

从上面的代码可知，`active`一个定时器实际上是把新建的 `timeout` 对象挂载到一个哈希队列里。我们看一下这时候的内存视图。

https://mmbiz.qpic.cn/mmbiz_png/bwG40XYiaOKnc3AV5hzZP8toQGL8naA671gL5jR8MxAOvMwBzT1agxKVYUlWmMOnko2NX1vEwEyzNuQq3kf2fHg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

当我们创建一个 `timerList` 的是时候，就会关联一个底层的定时器，执行 `setTimeout` 时传进来的时间是一样的，都会在一条队列中进行管理，该队列对应一个定时器，当定时器超时的时候，就会在该队列中找出超时节点。下面我们看一下 `new TimeWraper` 的时候发生了什么。

```
TimerWrap(Environment* env, Local<Object> object) : HandleWrap(env, object,reinterpret_cast<uv_handle_t*>(&handle_),AsyncWrap::PROVIDER_TIMERWRAP) {
    int r = uv_timer_init(env->event_loop(), &handle_);
    CHECK_EQ(r, 0);
  }
```

其实就是初始化了一个 `libuv` 的 `uv_timer_t` 结构体。然后接着 `start` 函数做了什么操作。

```
static void Start(const FunctionCallbackInfo<Value>& args) {TimerWrap* wrap = Unwrap<TimerWrap>(args.Holder());

    CHECK(HandleWrap::IsAlive(wrap));

    int64_t timeout = args[0]->IntegerValue();
    int err = uv_timer_start(&wrap->handle_, OnTimeout, timeout, 0);
    args.GetReturnValue().Set(err);
  }
```

就是启动了刚才初始化的定时器。并且设置了超时回调函数是 `OnTimeout` 。这时候，就等定时器超时，然后执行 `OnTimeout` 函数。所以我们继续看该函数的代码。

```
const uint32_t kOnTimeout = 0;
  static void OnTimeout(uv_timer_t* handle) {
    TimerWrap* wrap = static_cast<TimerWrap*>(handle->data);
    Environment* env = wrap->env();
    HandleScope handle_scope(env->isolate());
    Context::Scope context_scope(env->context());
    wrap->MakeCallback(kOnTimeout, 0, nullptr);
  }
```

`OnTimeout` 函数继续调 `kOnTimeout` ，但是该变量在 `time_wrapper.c` 中是一个整形，这是怎么回事呢？这时候需要回 `lib/timer.js` 里找答案。

```
const kOnTimeout = TimerWrap.kOnTimeout | 0;
// adds listOnTimeout to the C++ object prototype, as
// V8 would not inline it otherwise.
// 在TimerWrap中是0，给TimerWrap对象挂一个超时回调，每次的超时都会执行该回调
TimerWrap.prototype[kOnTimeout] = function listOnTimeout() {
// 拿到该底层定时器关联的超时队列，看TimersList
  var list = this._list;
  var msecs = list.msecs;
//
  if (list.nextTick) {
    list.nextTick = false;
    process.nextTick(listOnTimeoutNT, list);
    return;
  }

  debug('timeout callback %d', msecs);

  var now = TimerWrap.now();
  debug('now: %d', now);

  var diff, timer;
// 取出队列的尾节点，即最先插入的节点，最可能超时的，TimeOut对象
  while (timer = L.peek(list)) {
    diff = now - timer._idleStart;

// Check if this loop iteration is too early for the next timer.
// This happens if there are more timers scheduled for later in the list.
// 最早的节点的消逝时间小于设置的时间，说明还没超时，并且全部节点都没超时，直接返回
    if (diff < msecs) {
// 算出最快超时的节点还需要多长时间超时
      var timeRemaining = msecs - (TimerWrap.now() - timer._idleStart);
      if (timeRemaining < 0) {
        timeRemaining = 1;
      }
// 重新设置超时时间
      this.start(timeRemaining);
      debug('%d list wait because diff is %d', msecs, diff);
      return;
    }

// The actual logic for when a timeout happens.
// 当前节点已经超时
    L.remove(timer);
    assert(timer !== L.peek(list));

    if (!timer._onTimeout) {
      if (async_hook_fields[kDestroy] > 0 && !timer._destroyed &&
            typeof timer[async_id_symbol] === 'number') {
        emitDestroy(timer[async_id_symbol]);
        timer._destroyed = true;
      }
      continue;
    }
// 执行超时处理
    tryOnTimeout(timer, list);
  }
```

由上可知， `TimeWrapper.c` 里的 `kOnTimeout` 字段已经被改写成一个函数，所以底层的定时器超时时会执行上面的代码，即从定时器队列中找到超时节点执行，直到遇到第一个未超时的节点，然后重新设置超时时间。再次启动定时器。

参考：nodejs之setTimeout源码解析：https://zhuanlan.zhihu.com/p/60505970

来源：https://github.com/sisterAn/JavaScript-Algorithms



