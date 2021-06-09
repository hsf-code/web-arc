---
title: stream
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 1. 流的概念

- 流是一组有序的，有起点和终点的字节数据传输手段
- 它不关心文件的整体内容，只关注是否从文件中读到了数据，以及读到数据之后的处理
- 流是一个抽象接口，被 Node 中的很多对象所实现。比如HTTP 服务器request和response对象都是流。

## 2.可读流createReadStream

实现了`stream.Readable`接口的对象,将对象数据读取为流数据,当监听data事件后,开始发射数据

```javascript
fs.createReadStream = function(path, options) {
  return new ReadStream(path, options);
};
util.inherits(ReadStream, Readable);
```

### 2.1 创建可读流

```javascript
var rs = fs.createReadStream(path,[options]);
```

1. path读取文件的路径
2. options
   - flags打开文件要做的操作,默认为'r'
   - encoding默认为null
   - start开始读取的索引位置
   - end结束读取的索引位置(包括结束位置)
   - highWaterMark读取缓存区默认的大小64kb

> 如果指定utf8编码highWaterMark要大于3个字节

### 2.2 监听data事件

流切换到流动模式,数据会被尽可能快的读出

```javascript
rs.on('data', function (data) {
    console.log(data);
});
```

### 2.3 监听end事件

该事件会在读完数据后被触发

```javascript
rs.on('end', function () {
    console.log('读取完成');
});
```

### 2.4 监听error事件

```javascript
rs.on('error', function (err) {
    console.log(err);
});
```

### 2.5 监听open事件

```javascript
rs.on('open', function () {
    console.log(err);
});
```

### 2.6 监听close事件

```javascript
rs.on('close', function () {
    console.log(err);
});
```

### 2.7 设置编码

与指定{encoding:'utf8'}效果相同，设置编码

```javascript
rs.setEncoding('utf8');
```

### 2.8 暂停和恢复触发data

通过pause()方法和resume()方法

```javascript
rs.on('data', function (data) {
    rs.pause();
    console.log(data);
});
setTimeout(function () {
    rs.resume();
},2000);
```

## 3.可写流createWriteStream

实现了stream.Writable接口的对象来将流数据写入到对象中

```javascript
fs.createWriteStream = function(path, options) {
  return new WriteStream(path, options);
};

util.inherits(WriteStream, Writable);
```

### 3.1 创建可写流

```javascript
var ws = fs.createWriteStream(path,[options]);
```

1. path写入的文件路径
2. options
   - flags打开文件要做的操作,默认为'w'
   - encoding默认为utf8
   - highWaterMark写入缓存区的默认大小16kb

### 3.2 write方法

```javascript
ws.write(chunk,[encoding],[callback]);
```

1. chunk写入的数据buffer/string
2. encoding编码格式chunk为字符串时有用，可选
3. callback 写入成功后的回调

> 返回值为布尔值，系统缓存区满时为false,未满时为true

### 3.3 end方法

```javascript
ws.end(chunk,[encoding],[callback]);
```

> 表明接下来没有数据要被写入 Writable 通过传入可选的 chunk 和 encoding 参数，可以在关闭流之前再写入一段数据 如果传入了可选的 callback 函数，它将作为 'finish' 事件的回调函数

### 3.4 drain方法

- 当一个流不处在 drain 的状态， 对 write() 的调用会缓存数据块， 并且返回 false。 一旦所有当前所有缓存的数据块都排空了（被操作系统接受来进行输出）， 那么 'drain' 事件就会被触发

- 建议， 一旦 write() 返回 false， 在 'drain' 事件触发前， 不能写入任何数据块

  ```javascript
  let fs = require('fs');
  let ws = fs.createWriteStream('./2.txt',{
    flags:'w',
    encoding:'utf8',
    highWaterMark:3
  });
  let i = 10;
  function write(){
   let  flag = true;
   while(i&&flag){
        flag = ws.write("1");
        i--;
       console.log(flag);
   }
  }
  write();
  ws.on('drain',()=>{
    console.log("drain");
    write();
  });
  ```

### 3.5 finish方法

在调用了 stream.end() 方法，且缓冲区数据都已经传给底层系统之后， 'finish' 事件将被触发。

```
var writer = fs.createWriteStream('./2.txt');
for (let i = 0; i < 100; i++) {
  writer.write(`hello, ${i}!\n`);
}
writer.end('结束\n');
writer.on('finish', () => {
  console.error('所有的写入已经完成!');
});
```

## 4.pipe方法

### 4.1 pipe方法的原理

```javascript
var fs = require('fs');
var ws = fs.createWriteStream('./2.txt');
var rs = fs.createReadStream('./1.txt');
rs.on('data', function (data) {
    var flag = ws.write(data);
    if(!flag)
    rs.pause();
});
ws.on('drain', function () {
    rs.resume();
});
rs.on('end', function () {
    ws.end();
});
```

### 4.2 pipe用法

```javascript
readStream.pipe(writeStream);
var from = fs.createReadStream('./1.txt');
var to = fs.createWriteStream('./2.txt');
from.pipe(to);
```

> 将数据的滞留量限制到一个可接受的水平，以使得不同速度的来源和目标不会淹没可用内存。

### 4.3 unpipe用法

- readable.unpipe()方法将之前通过stream.pipe()方法绑定的流分离

- 如果 destination 没有传入, 则所有绑定的流都会被分离.

  ```javascript
  let fs = require('fs');
  var from = fs.createReadStream('./1.txt');
  var to = fs.createWriteStream('./2.txt');
  from.pipe(to);
  setTimeout(() => {
  console.log('关闭向2.txt的写入');
  from.unpipe(writable);
  console.log('手工关闭文件流');
  to.end();
  }, 1000);
  ```

### 4.4 cork

调用 writable.cork() 方法将强制所有写入数据都存放到内存中的缓冲区里。 直到调用 stream.uncork() 或 stream.end() 方法时，缓冲区里的数据才会被输出。

### 4.5 uncork

writable.uncork()将输出在`stream.cork()`方法被调用之后缓冲在内存中的所有数据。

```
stream.cork();
stream.write('1');
stream.write('2');
process.nextTick(() => stream.uncork());
```

## 5. 简单实现

### 5.1 可读流的简单实现

```
let fs = require('fs');
let ReadStream = require('./ReadStream');
let rs = ReadStream('./1.txt', {
    flags: 'r',
    encoding: 'utf8',
    start: 3,
    end: 7,
    highWaterMark: 3
});
rs.on('open', function () {
    console.log("open");
});
rs.on('data', function (data) {
    console.log(data);
});
rs.on('end', function () {
    console.log("end");
});
rs.on('close', function () {
    console.log("close");
});
/**
 open
 456
 789
 end
 close
 **/
let fs = require('fs');
let EventEmitter = require('events');

class WriteStream extends EventEmitter {
    constructor(path, options) {
        super(path, options);
        this.path = path;
        this.fd = options.fd;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding;
        this.start = options.start || 0;
        this.pos = this.start;
        this.end = options.end;
        this.flowing = false;
        this.autoClose = true;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.buffer = Buffer.alloc(this.highWaterMark);
        this.length = 0;
        this.on('newListener', (type, listener) => {
            if (type == 'data') {
                this.flowing = true;
                this.read();
            }
        });
        this.on('end', () => {
            if (this.autoClose) {
                this.destroy();
            }
        });
        this.open();
    }

    read() {
        if (typeof this.fd != 'number') {
            return this.once('open', () => this.read());
        }
        let n = this.end ? Math.min(this.end - this.pos, this.highWaterMark) : this.highWaterMark;
        fs.read(this.fd,this.buffer,0,n,this.pos,(err,bytesRead)=>{
            if(err){
             return;
            }
            if(bytesRead){
                let data = this.buffer.slice(0,bytesRead);
                data = this.encoding?data.toString(this.encoding):data;
                this.emit('data',data);
                this.pos += bytesRead;
                if(this.end && this.pos > this.end){
                  return this.emit('end');
                }
                if(this.flowing)
                    this.read();
            }else{
                this.emit('end');
            }
        })
    }

    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) return this.emit('error', err);
            this.fd = fd;
            this.emit('open', fd);
        })
    }


    end() {
        if (this.autoClose) {
            this.destroy();
        }
    }

    destroy() {
        fs.close(this.fd, () => {
            this.emit('close');
        })
    }

}

module.exports = WriteStream;
```

### 5.2 可写流的简单实现

```
let fs = require('fs');
 let FileWriteStream = require('./FileWriteStream');
 let ws = FileWriteStream('./2.txt',{
     flags:'w',
     encoding:'utf8',
     highWaterMark:3
 });
 let i = 10;
 function write(){
     let  flag = true;
     while(i&&flag){
         flag = ws.write("1",'utf8',(function(i){
             return function(){
                 console.log(i);
             }
         })(i));
         i--;
         console.log(flag);
     }
 }
 write();
 ws.on('drain',()=>{
     console.log("drain");
     write();
 });
 /**
  10
  9
  8
  drain
  7
  6
  5
  drain
  4
  3
  2
  drain
  1
  **/
let fs = require('fs');
let EventEmitter = require('events');
class WriteStream extends  EventEmitter{
    constructor(path, options) {
        super(path, options);
        this.path = path;
        this.fd = options.fd;
        this.flags = options.flags || 'w';
        this.mode = options.mode || 0o666;
        this.encoding = options.encoding;
        this.start = options.start || 0;
        this.pos = this.start;
        this.writing = false;
        this.autoClose = true;
        this.highWaterMark = options.highWaterMark || 16 * 1024;
        this.buffers = [];
        this.length = 0;
        this.open();
    }

    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) return this.emit('error', err);
            this.fd = fd;
            this.emit('open', fd);
        })
    }

    write(chunk, encoding, cb) {
        if (typeof encoding == 'function') {
            cb = encoding;
            encoding = null;
        }

        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, this.encoding || 'utf8');
        let len = chunk.length;
        this.length += len;
        let ret = this.length < this.highWaterMark;
        if (this.writing) {
            this.buffers.push({
                chunk,
                encoding,
                cb,
            });
        } else {
            this.writing = true;
            this._write(chunk, encoding,this.clearBuffer.bind(this));
        }
        return ret;
    }

    _write(chunk, encoding, cb) {
        if (typeof this.fd != 'number') {
            return this.once('open', () => this._write(chunk, encoding, cb));
        }
        fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
            if (err) {
                if (this.autoClose) {
                    this.destroy();
                }
                return this.emit('error', err);
            }
            this.length -= written;
            this.pos += written;
            cb && cb();
        });
    }

    clearBuffer() {
        let data = this.buffers.shift();
        if (data) {
            this._write(data.chunk, data.encoding, this.clearBuffer.bind(this))
        } else {
            this.writing = false;
            this.emit('drain');
        }
    }

    end() {
        if (this.autoClose) {
            this.emit('end');
            this.destroy();
        }
    }

    destroy() {
        fs.close(this.fd, () => {
            this.emit('close');
        })
    }

}

module.exports = WriteStream;
```

### 5.3 pipe

```
let fs = require('fs');
let ReadStream = require('./ReadStream');
let rs = ReadStream('./1.txt', {
    flags: 'r',
    encoding: 'utf8',
    highWaterMark: 3
});
let FileWriteStream = require('./WriteStream');
let ws = FileWriteStream('./2.txt',{
    flags:'w',
    encoding:'utf8',
    highWaterMark:3
});
rs.pipe(ws);
ReadStream.prototype.pipe = function (dest) {
    this.on('data', (data)=>{
        let flag = dest.write(data);
        if(!flag){
            this.pause();
        }
    });
    dest.on('drain', ()=>{
        this.resume();
    });
    this.on('end', ()=>{
        dest.end();
    });
}
ReadStream.prototype.pause = function(){
    this.flowing = false;

}
ReadStream.prototype.resume = function(){
    this.flowing = true;
    this.read();
}
```

## 5.4 暂停模式

```
let fs =require('fs');
let ReadStream2 = require('./ReadStream2');
let rs = new ReadStream2('./1.txt',{
    start:3,
    end:8,
    encoding:'utf8',
    highWaterMark:3
});
rs.on('readable',function () {
    console.log('readable');
    console.log('rs.buffer.length',rs.length);
    let d = rs.read(1);
    console.log(d);
    console.log('rs.buffer.length',rs.length);

    setTimeout(()=>{
        console.log('rs.buffer.length',rs.length);
    },500)
});
```

\``` let fs = require('fs'); let EventEmitter = require('events'); class ReadStream extends EventEmitter { constructor(path, options) { super(path, options); this.path = path; this.highWaterMark = options.highWaterMark || 64 * 1024; this.buffer = Buffer.alloc(this.highWaterMark); this.flags = options.flags || 'r'; this.encoding = options.encoding; this.mode = options.mode || 0o666; this.start = options.start || 0; this.end = options.end; this.pos = this.start; this.autoClose = options.autoClose || true; this.bytesRead = 0; this.closed = false; this.flowing; this.needReadable = false; this.length = 0; this.buffers = []; this.on('end', function () { if (this.autoClose) { this.destroy(); } }); this.on('newListener', (type) => { if (type == 'data') { this.flowing = true; this.read(); } if (type == 'readable') { this.read(0); } }); this.open(); }

```
open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
        if (err) {
            if (this.autoClose) {
                this.destroy();
                return this.emit('error', err);
            }
        }
        this.fd = fd;
        this.emit('open');
    });
}

read(n) {
    if (typeof this.fd != 'number') {
        return this.once('open', () => this.read());
    }
    n = parseInt(n,10);
    if(n != n){
        n = this.length;
    }
    if(this.length ==0)
        this.needReadable = true;
    let ret;
    if (0<n < this.length) {
        ret = Buffer.alloc(n);
        let b ;
        let index = 0;
        while(null != (b = this.buffers.shift())){
            for(let i=0;i<b.length;i++){
                ret[index++] = b[i];
                if(index == ret.length){
                    this.length -= n;
                    b = b.slice(i+1);
                    this.buffers.unshift(b);
                    break;
                }
            }
        }
        if (this.encoding) ret = ret.toString(this.encoding);
    }

    let _read = () => {
        let m = this.end ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark;
        fs.read(this.fd, this.buffer, 0, m, this.pos, (err, bytesRead) => {
            if (err) {
                return
            }
            let data;
            if (bytesRead > 0) {
                data = this.buffer.slice(0, bytesRead);
                this.pos += bytesRead;
                this.length += bytesRead;
                if (this.end && this.pos > this.end) {
                    if(this.needReadable){
                        this.emit('readable');
                    }

                    this.emit('end');
                } else {
                    this.buffers.push(data);
                    if(this.needReadable){
                        this.emit('readable');
                        this.needReadable = false;
                    }

                }
            } else {
                if(this.needReadable) {
                    this.emit('readable');
                }
                return this.emit('end');
            }
        })
    }
    if (this.length == 0 || (this.length < this.highWaterMark)) {
        _read(0);
    }
    return ret;
}

destroy() {
    fs.close(this.fd, (err) => {
        this.emit('close');
    });
}

pause() {
    this.flowing = false;
}

resume() {
    this.flowing = true;
    this.read();
}

pipe(dest) {
    this.on('data', (data) => {
        let flag = dest.write(data);
        if (!flag) this.pause();
    });
    dest.on('drain', () => {
        this.resume();
    });
    this.on('end', () => {
        dest.end();
    });
}
```

}

module.exports = ReadStream; /**

- if (n !== 0) state.emittedReadable = false; 只要要读的字节数不是0就需要触发readable事件 如果传入的NaN,则将n赋为缓区的长度，第一次就是0

  缓存区为0就开始读吧 如果n等于0就返回null,state.needReadable = true; 如果缓存区为0，是 state.needReadable = true; 需要触发readable

  **/ ``

- [streaming_in_node](http://www.moye.me/2015/03/29/streaming_in_node/)
- [stream-handbook](https://github.com/jabez128/stream-handbook)



## 1. Node.js 中有四种基本的流类型：

- Readable - 可读的流 (例如 fs.createReadStream()).
- Writable - 可写的流 (例如 fs.createWriteStream()).
- Duplex - 可读写的流 (例如 net.Socket).
- Transform - 在读写过程中可以修改和变换数据的 Duplex 流 (例如 zlib.createDeflate()).

## 2. 流中的数据有两种模式,二进制模式和对象模式.

- 二进制模式, 每个分块都是buffer或者string对象.

- 对象模式, 流内部处理的是一系列普通对象.

  > 所有使用 Node.js API 创建的流对象都只能操作 strings 和 Buffer对象。但是，通过一些第三方流的实现，你依然能够处理其它类型的 JavaScript 值 (除了 null，它在流处理中有特殊意义)。 这些流被认为是工作在 “对象模式”（object mode）。 在创建流的实例时，可以通过 objectMode 选项使流的实例切换到对象模式。试图将已经存在的流切换到对象模式是不安全的。

## 3. 可读流的两种模式

- 可读流事实上工作在下面两种模式之一：`flowing` 和 `paused`
- 在 flowing 模式下， 可读流自动从系统底层读取数据，并通过 EventEmitter 接口的事件尽快将数据提供给应用。
- 在 paused 模式下，必须显式调用 stream.read() 方法来从流中读取数据片段。
- 所有初始工作模式为 paused 的 Readable 流，可以通过下面三种途径切换到 flowing 模式：
  - 监听 'data' 事件
  - 调用 stream.resume() 方法
  - 调用 stream.pipe() 方法将数据发送到 Writable
- 可读流可以通过下面途径切换到 paused 模式：
  - 如果不存在管道目标（pipe destination），可以通过调用 stream.pause() 方法实现。
  - 如果存在管道目标，可以通过取消 'data' 事件监听，并调用 stream.unpipe() 方法移除所有管道目标来实现。

> 如果 Readable 切换到 flowing 模式，且没有消费者处理流中的数据，这些数据将会丢失。 比如， 调用了 readable.resume() 方法却没有监听 'data' 事件，或是取消了 'data' 事件监听，就有可能出现这种情况。

## 4.缓存区

- Writable 和 Readable 流都会将数据存储到内部的缓冲器（buffer）中。这些缓冲器可以 通过相应的 writable._writableState.getBuffer() 或 readable._readableState.buffer 来获取。
- 缓冲器的大小取决于传递给流构造函数的 highWaterMark 选项。 对于普通的流， highWaterMark 选项指定了总共的字节数。对于工作在对象模式的流， highWaterMark 指定了对象的总数。
- 当可读流的实现调用`stream.push(chunk)`方法时，数据被放到缓冲器中。如果流的消费者没有调用`stream.read()`方法， 这些数据会始终存在于内部队列中，直到被消费。
- 当内部可读缓冲器的大小达到 highWaterMark 指定的阈值时，流会暂停从底层资源读取数据，直到当前 缓冲器的数据被消费 (也就是说， 流会在内部停止调用 readable._read() 来填充可读缓冲器)。
- 可写流通过反复调用 writable.write(chunk) 方法将数据放到缓冲器。 当内部可写缓冲器的总大小小于 highWaterMark 指定的阈值时， 调用 writable.write() 将返回true。 一旦内部缓冲器的大小达到或超过 highWaterMark ，调用 writable.write() 将返回 false 。
- stream API 的关键目标， 尤其对于 stream.pipe() 方法， 就是限制缓冲器数据大小，以达到可接受的程度。这样，对于读写速度不匹配的源头和目标，就不会超出可用的内存大小。
- Duplex 和 Transform 都是可读写的。 在内部，它们都维护了 两个 相互独立的缓冲器用于读和写。 在维持了合理高效的数据流的同时，也使得对于读和写可以独立进行而互不影响。

## 5. 可读流的三种状态

在任意时刻，任意可读流应确切处于下面三种状态之一：

- readable._readableState.flowing = null
- readable._readableState.flowing = false
- readable._readableState.flowing = true
- 若 readable._readableState.flowing 为 null，由于不存在数据消费者，可读流将不会产生数据。 在这个状态下，监听 'data' 事件，调用 readable.pipe() 方法，或者调用 readable.resume() 方法， readable._readableState.flowing 的值将会变为 true 。这时，随着数据生成，可读流开始频繁触发事件。
- 调用 readable.pause() 方法， readable.unpipe() 方法， 或者接收 “背压”（back pressure）， 将导致 readable._readableState.flowing 值变为 false。 这将暂停事件流，但 不会 暂停数据生成。 在这种情况下，为 'data' 事件设置监听函数不会导致 readable._readableState.flowing 变为 true。
- 当 readable._readableState.flowing 值为 false 时， 数据可能堆积到流的内部缓存中。

## 6.readable

'readable' 事件将在流中有数据可供读取时触发。在某些情况下，为 'readable' 事件添加回调将会导致一些数据被读取到内部缓存中。

```
const readable = getReadableStreamSomehow();
readable.on('readable', () => {
  // 有一些数据可读了
});
```

- 当到达流数据尾部时， 'readable' 事件也会触发。触发顺序在 'end' 事件之前。
- 事实上， 'readable' 事件表明流有了新的动态：要么是有了新的数据，要么是到了流的尾部。 对于前者， stream.read() 将返回可用的数据。而对于后者， stream.read() 将返回 null。

```
let fs =require('fs');
let rs = fs.createReadStream('./1.txt',{
  start:3,
  end:8,
  encoding:'utf8',
  highWaterMark:3
});
rs.on('readable',function () {
  console.log('readable');
  console.log('rs._readableState.buffer.length',rs._readableState.length);
  let d = rs.read(1);
  console.log('rs._readableState.buffer.length',rs._readableState.length);
  console.log(d);
  setTimeout(()=>{
      console.log('rs._readableState.buffer.length',rs._readableState.length);
  },500)
});
```

## 7.流的经典应用

### 7.1 行读取器

#### 7.1.1 换行和回车

- 以前的打印要每秒可以打印10个字符，换行城要0.2秒，正要可以打印2个字符。
- 研制人员就是在每行后面加两个表示结束的字符。一个叫做"回车"，告诉打字机把打印头定位在左边界；另一个叫做"换行"，告诉打字机把纸向下移一行。
- Unix系统里，每行结尾只有换行"(line feed)"，即"\n",
- Windows系统里面，每行结尾是"<回车><换行>"，即"\r\n"
- Mac系统里，每行结尾是"回车"(carriage return)，即"\r"
- 在ASCII码里
  - 换行 \n 10 0A
  - 回车 \r 13 0D

[ASCII](http://ascii.911cha.com/)

#### 7.1.2 代码

```
let fs = require('fs');
let EventEmitter = require('events');
let util = require('util');
util.inherits(LineReader, EventEmitter)
fs.readFile('./1.txt',function (err,data) {
    console.log(data);
})
function LineReader(path) {
    EventEmitter.call(this);
    this._rs = fs.createReadStream(path);
    this.RETURN = 0x0D;// \r 13
    this.NEW_LINE = 0x0A;// \n 10
    this.on('newListener', function (type, listener) {
        if (type == 'newLine') {
            let buffer = [];
            this._rs.on('readable', () => {
                let bytes;
                while (null != (bytes = this._rs.read(1))) {
                    let ch = bytes[0];
                    switch (ch) {
                        case this.RETURN:
                            this.emit('newLine', Buffer.from(buffer));
                            buffer.length = 0;
                            let nByte = this._rs.read(1);
                            if (nByte && nByte[0] != this.NEW_LINE) {
                                buffer.push(nByte[0]);
                            }
                            break;
                        case this.NEW_LINE:
                            this.emit('newLine', Buffer.from(buffer));
                            buffer.length = 0;
                            break;
                        default:
                            buffer.push(bytes[0]);
                            break;
                    }
                }
            });
            this._rs.on('end', () => {
                if (buffer.length > 0) {
                    this.emit('newLine', Buffer.from(buffer));
                    buffer.length = 0;
                    this.emit('end');
                }
            })
        }
    });
}

var lineReader = new LineReader('./1.txt');
lineReader.on('newLine', function (data) {
    console.log(data.toString());
}).on('end', function () {
    console.log("end");
})
```





## 1. 自定义可读流

为了实现可读流，引用Readable接口并用它构造新对象

- 我们可以直接把供使用的数据push出去。
- 当push一个null对象就意味着我们想发出信号——这个流没有更多数据了。

```
var stream = require('stream');
var util = require('util');
util.inherits(Counter, stream.Readable);
function Counter(options) {
    stream.Readable.call(this, options);
    this._index = 0;
}
Counter.prototype._read = function() {
    if(this._index++<3){
        this.push(this._index+'');
    }else{
        this.push(null);
    }
};
var counter = new Counter();

counter.on('data', function(data){
    console.log("读到数据: " + data.toString());//no maybe
});
counter.on('end', function(data){
    console.log("读完了");
});
```

## 2. 可写流

为了实现可写流，我们需要使用流模块中的Writable构造函数。 我们只需给Writable构造函数传递一些选项并创建一个对象。唯一需要的选项是write函数，该函数揭露数据块要往哪里写。

- chunk通常是一个buffer，除非我们配置不同的流。
- encoding是在特定情况下需要的参数，通常我们可以忽略它。
- callback是在完成处理数据块后需要调用的函数。这是写数据成功与否的标志。若要发出故障信号，请用错误对象调用回调函数

```
var stream = require('stream');
var util = require('util');
util.inherits(Writer, stream.Writable);
let stock = [];
function Writer(opt) {
    stream.Writable.call(this, opt);
}
Writer.prototype._write = function(chunk, encoding, callback) {
    setTimeout(()=>{
        stock.push(chunk.toString('utf8'));
        console.log("增加: " + chunk);
        callback();
    },500)
};
var w = new Writer();
for (var i=1; i<=5; i++){
    w.write("项目:" + i, 'utf8');
}
w.end("结束写入",function(){
    console.log(stock);
});
```

## 3. 管道流

```
const stream = require('stream')

var index = 0;
const readable = stream.Readable({
    highWaterMark: 2,
    read: function () {
        process.nextTick(() => {
            console.log('push', ++index)
            this.push(index+'');
        })
    }
})

const writable = stream.Writable({
    highWaterMark: 2,
    write: function (chunk, encoding, next) {
        console.log('写入:', chunk.toString())
    }
})

readable.pipe(writable);
```

## 4. 实现双工流

有了双工流，我们可以在同一个对象上同时实现可读和可写，就好像同时继承这两个接口。 重要的是双工流的可读性和可写性操作完全独立于彼此。这仅仅是将两个特性组合成一个对象。

```
const {Duplex} = require('stream');
const inoutStream = new Duplex({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    },
    read(size) {
        this.push((++this.index)+'');
        if (this.index > 3) {
            this.push(null);
        }
    }
});

inoutStream.index = 0;
process.stdin.pipe(inoutStream).pipe(process.stdout);
```

## 5. 实现转换流

- 转换流的输出是从输入中计算出来的
- 对于转换流，我们不必实现read或write的方法，我们只需要实现一个transform方法，将两者结合起来。它有write方法的意思，我们也可以用它来push数据。

```
const {Transform} = require('stream');

const upperCase = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

## 6. 对象流

默认情况下，流处理的数据是Buffer/String类型的值。有一个objectMode标志，我们可以设置它让流可以接受任何JavaScript对象。

```
const {Transform} = require('stream');
let fs = require('fs');
let rs = fs.createReadStream('./users.json');
rs.setEncoding('utf8');
let toJson = Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        this.push(JSON.parse(chunk));
        callback();
    }
});
let jsonOut = Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        console.log(chunk);
        callback();
    }
});
rs.pipe(toJson).pipe(jsonOut)
[
  {"name":"zfpx1","age":8},
  {"name":"zfpx2","age":9}
]
```

## 7. unshift

readable.unshift() 方法会把一块数据压回到Buffer内部。 这在如下特定情形下有用： 代码正在消费一个数据流，已经"乐观地"拉取了数据。 又需要"反悔-消费"一些数据，以便这些数据可以传给其他人用。

```
const {Transform} = require('stream');
const { StringDecoder } = require('string_decoder');
let decoder = new StringDecoder('utf8');
let fs = require('fs');
let rs = fs.createReadStream('./req.txt');

function parseHeader(stream, callback) {
    let header = '';
    rs.on('readable',onReadable);
    function onReadable() {

        let chunk;
        while(null != (chunk = rs.read())){
            const str = decoder.write(chunk);
            if(str.match(/\r\n\r\n/)){
                const split = str.split(/\r\n\r\n/);
                console.log(split);
                header+=split.shift();
                const remaining = split.join('\r\n\r\n');
                const buf = Buffer.from(remaining,'utf8');
                rs.removeListener('readable', onReadable);
                if(buf.length){
                    stream.unshift(buf);
                }
                callback(null,header,rs);
            }else{
                header += str;
            }
        }
    }
}
parseHeader(rs,function(err,header,stream){
    console.log(header);
    stream.setEncoding('utf8');
    stream.on('data',function (data) {
        console.log('data',data);
    });
});
Host: www.baidu.com
User-Agent: curl/7.53.0
Accept: */*

name=zfpx&age=9
```





## 1. 通过流读取数据

- 用Readable创建对象readable后，便得到了一个可读流。
- 如果实现_read方法，就将流连接到一个底层数据源。
- 流通过调用_read向底层请求数据，底层再调用流的push方法将需要的数据传递过来。
- 当readable连接了数据源后，下游便可以调用readable.read(n)向流请求数据，同时监听readable的data事件来接收取到的数据。 ![stream-how-data-comes-out](http://img.zhufengpeixun.cn/stream-how-data-comes-out.png)

## 2. read(fs:2060,372)

read方法中的逻辑可用下图表示

![stream-read](http://img.zhufengpeixun.cn/stream-read.png)

## 3. push(fs:2108,197)

- 消耗方调用read(n)促使流输出数据，而流通过_read()使底层调用push方法将数据传给流。
- 如果流在流动模式下（state.flowing为true）输出数据，数据会自发地通过data事件输出，不需要消耗方反复调用read(n)。(fs:268)
- 如果调用push方法时缓存为空，则当前数据即为下一个需要的数据。这个数据可能先添加到缓存中，也可能直接输出。
- 执行read方法时，在调用_read后，如果从缓存中取到了数据，就以data事件输出(fs:482)。
- 所以，如果_read异步调用push时发现缓存为空，则意味着当前数据是下一个需要的数据，且不会被read方法输出，应当在push方法中立即以data事件输出(_stream_readable:268)。

## 4. end事件

- 在调用完_read()后，read(n)会试着从缓存中取数据(_stream_readable:459)。
- 如果_read()是异步调用push方法的，则此时缓存中的数据量不会增多，容易出现数据量不够的现象(_stream_readable:463)。
- 如果read(n)的返回值为null，说明这次未能从缓存中取出所需量的数据。 此时，消耗方需要等待新的数据到达后再次尝试调用read方法(_stream_readable:280)。
- 在数据到达后，流是通过readable事件来通知消耗方的(_stream_readable:280)。
- 在此种情况下，push方法如果立即输出数据，接收方直接监听data事件即可，否则数据被添加到缓存中，需要触发readable事件(_stream_readable:280)
- 消耗方必须监听这个readable事件，再调用read方法取得数据。

## 5. doRead

- 流中维护了一个缓存，当缓存中的数据足够多时，调用read()不会引起_read()的调用，即不需要向底层请求数据。
- 用doRead来表示read(n)是否需要向底层取数据(_stream_readable:431)
- state.reading标志上次从底层取数据的操作是否已完成。一旦push方法被调用，就会设置为false，表示此次_read()结束。
- state.highWaterMark是给缓存大小设置的一个上限阈值。
- 如果取走n个数据后，缓存中保有的数据不足这个量，便会从底层取一次数据(_stream_readable:431)。

## 6. howMuchToRead

- 用read(n)去取n个数据时，m = howMuchToRead(n)是将从缓存中实际获取的数据量(_stream_readable:346)。
- 可读流是获取底层数据的工具，消耗方通过调用read方法向流请求数据，流再从缓存中将数据返回，或以data事件输出。
- 如果缓存中数据不够，便会调用_read方法去底层取数据。
- 该方法在拿到底层数据后，调用push方法将数据交由流处理（立即输出或存入缓存）。
- 可以结合readable事件和read方法来将数据全部消耗，这是暂停模式的消耗方法。

- read(0) 只是填充缓存区，并不真正读取
- read() 如果处于流动模式，并且缓存区大小不为空，则返回缓存区第一个buffer的长度，否则读取整个缓存 如果读到了数据没有返回值，但是会发射data事件,数据也能取到,也就是用来清空缓存区