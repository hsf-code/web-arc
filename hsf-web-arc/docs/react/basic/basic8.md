---
title: 基础（八）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# http

## 1.本课学习目标

- 学习如何获取专业权威的一手知识
- 学习如何阅读RFC标准文档
- 学习扩展的巴科斯范式(ABNF)定义的通信协议语言
- 学习HTTP协议的实现和解析细节

### 1.1 TCP/IP参考模型 [#](http://www.zhufengpeixun.com/grow/html/108.http.html#t11.1 TCP/IP参考模型)

- TCP/IP协议被称为传输控制协议/互联网协议，又称网络通讯协议

![protocal](http://img.zhufengpeixun.cn/protocal.png)

## 2.GET

### 2.1 使用

#### 2.1.1 http-server.js

```js
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(function(req,res){
  if(['/get.html'].includes(req.url)){
    res.writeHead(200,{'Context-type':"text-html"});
    res.end(fs.readFileSync(path.join(__dirname,'static',req.url.slice(1))));
  }else if(req.url === '/get'){
    res.writeHead(200,{'Context-type':"text-plain"});
    res.end('get');
  }
});
server.listen(8080);
```

#### 2.1.2 static\get.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>get</title>
</head>
<body>
    <script>
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{
            console.log('onreadystatechange',xhr.readyState);
        }
        xhr.open("GET", "http://127.0.0.1:8080/get");
        xhr.responseType="text";
        xhr.setRequestHeader('name', 'zhufeng');
        xhr.setRequestHeader('age', '10');
        xhr.onload = () => {
            console.log('readyState',xhr.readyState);
            console.log('status',xhr.status);
            console.log('statusText',xhr.statusText);
            console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());
            console.log('response',xhr.response);
        };
        xhr.send();
     </script>
</body>
</html>
```

#### 2.1.3 请求响应格式

- 一个请求消息是从客户端到服务器端的,在消息首行里包含方法,资源指标符,协议版本

```js
Request=Request-Line;
*((general-header|request-header|entity-header)CRLF)
CRLF
[message-body]
```

##### 2.1.3.1 请求

```js
GET /get HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
name: zhufeng
age: 10
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36
Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
```

![http_get_request](http://img.zhufengpeixun.cn/http_get_request.png)

##### 2.1.3.2 响应

```js
Response=Status-Line;
*((general-header|response-header|entity-header)CRLF)
CRLF
[message-body]
HTTP/1.1 200 OK
Context-type: text-plain
Date: Fri, 14 Aug 2020 03:58:41 GMT
Connection: keep-alive
Transfer-Encoding: chunked

3
get
0
```

![http_get_response](http://img.zhufengpeixun.cn/http_get_response.png)

### 2.2 实现

#### 2.2.1 tcp-get-client.js

- [readyState](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState)

tcp-get-client.js

```js
let net = require('net');
const ReadyState = {
    UNSENT:0,//（代理被创建，但尚未调用 open() 方法。
    OPENED:1,//open() 方法已经被调用
    HEADERS_RECEIVED:2,//send() 方法已经被调用，并且头部和状态已经可获得。
    LOADING:3,//（交互）正在解析响应内容
    DONE:4 //（完成）响应内容解析完成，可以在客户端调用了
}
class XMLHttpRequest {
    constructor(){
        this.readyState = ReadyState.UNSENT;
        this.headers = {};
    }
    open(method, url) {
        this.method = method||'GET';
        this.url = url;
        let {hostname,port,path} = require('url').parse(url);
        this.hostname = hostname;
        this.port = port;
        this.path = path;
        this.headers.Host=`${hostname}:${port}`;
        const socket = this.socket =  net.createConnection({port: this.port,hostname:this.hostname},()=>{
            socket.on('data', (data) => {
                data = data.toString();
                let [response,bodyRows] = data.split('\r\n\r\n');
                let [statusLine,...headerRows] = response.split('\r\n');
                let [,status,statusText] = statusLine.split(' ');
                this.status = status;
                this.statusText = statusText;
                this.responseHeaders = headerRows.reduce((memo,row)=>{
                    let [key,value] = row.split(': ');
                    memo[key]= value;
                    return memo;
                },{});
                this.readyState = ReadyState.HEADERS_RECEIVED;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.readyState = ReadyState.LOADING;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                let [,body,] = bodyRows.split('\r\n');
                this.response = this.responseText = body;
                this.readyState = ReadyState.DONE;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.onload&&this.onload();
            });
            socket.on('error', (err) => {
                this.onerror&&this.onerror(err);
            });
         });
         this.readyState = ReadyState.OPENED;
         xhr.onreadystatechange&&xhr.onreadystatechange();
    }
    getAllResponseHeaders(){
        let allResponseHeaders='';
        for(let key in this.responseHeaders){
            allResponseHeaders+=`${key}: ${this.responseHeaders[key]}\r\n`;
        }
        return allResponseHeaders;
    }
    setRequestHeader(header,value){
        this.headers[header]= value;
    }
    send() {
        let rows = [];
        rows.push(`${this.method} ${this.path} HTTP/1.1`);
        rows.push(...Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`));
        this.socket.write(rows.join('\r\n')+'\r\n\r\n');
    }
}

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = ()=>{
    console.log('onreadystatechange',xhr.readyState);
}
xhr.open("GET", "http://127.0.0.1:8080/get");
xhr.responseType="text";
xhr.setRequestHeader('name', 'zhufeng');
xhr.setRequestHeader('age', '10');
xhr.onload = () => {
    console.log('readyState',xhr.readyState);
    console.log('status',xhr.status);
    console.log('statusText',xhr.statusText);
    console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());
    console.log('response',xhr.response);
};
xhr.send();
```

#### 2.2.2 tcp-get-sever

tcp-get-sever.js

```js
const net = require('net');
const server = net.createServer((socket) => {
  socket.on('data',(data)=>{
    let request = data.toString();
    let [requestLine,...headerRows] = request.split('\r\n');
    let [method,path] = requestLine.split(' ');
    let headers = headerRows.slice(0,-2).reduce((memo,row)=>{
      let [key,value] = row.split(': ');
      memo[key] = value;
      return memo;
    },{});
    console.log('method',method);
    console.log('path',path);
    console.log('headers',headers);

    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Context-type: text-plain`);
    rows.push(`Date: ${new Date().toGMTString()}`);
    rows.push(`Connection: keep-alive`);
    rows.push(`Transfer-Encoding: chunked`);
    let responseBody = 'get';
    rows.push(`\r\n${Buffer.byteLength(responseBody).toString(16)}\r\n${responseBody}\r\n0`);
    let response = rows.join('\r\n');
    socket.end(response);
  });
})
server.on('error', (err) => {
  console.error(err);
});

server.listen(8080,() => {
  console.log('服务器已经启动', server.address());
});
```

## 5.POST方法

### 5.1 实战

#### 5.1.1 请求和响应

##### 5.1.1.1 请求

![http_post_request](http://img.zhufengpeixun.cn/http_post_request.png)

##### 5.1.1.2 响应

![http_post_response](http://img.zhufengpeixun.cn/http_post_response.png)

#### 5.1.2 http-server.js

http-server.js

```diff
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(function(req,res){
+  if(['/get.html','/post.html'].includes(req.url)){
    res.writeHead(200,{'Context-type':"text-html"});
    res.end(fs.readFileSync(path.join(__dirname,'static',req.url.slice(1))));
  }else if(req.url === '/get'){
    res.writeHead(200,{'Context-type':"text-plain"});
    res.end('get');
+  }else if(req.url === '/post'){
+    let buffers = [];
+    req.on('data',(data)=>{
+      buffers.push(data);
+    });
+    req.on('end',()=>{
+      console.log('method',req.method);
+      console.log('url',req.url);
+      console.log('headers',req.headers);
+      let body = Buffer.concat(buffers);
+      console.log('body',body.toString());
+      res.statusCode = 200;
+      res.setHeader('Context-type',"text-plain");
+      res.write(body);
+      res.end();
+    });
  }
});
server.listen(8080);
```

#### 5.1.3 static\post.html

static\post.html

```diff
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>get</title>
</head>
<body>
    <script>
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{
            console.log('onreadystatechange',xhr.readyState);
        }
+        xhr.open("POST", "http://127.0.0.1:8080/post");
        xhr.responseType="text";
+        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onload = () => {
            console.log('readyState',xhr.readyState);
            console.log('status',xhr.status);
            console.log('statusText',xhr.statusText);
            console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());
            console.log('response',xhr.response);
        };
+        xhr.send(JSON.stringify({name:'zhufeng',age:10}));
     </script>
</body>
</html>
```

### 5.2 实现

#### 5.2.1 tcp-post-client.js

tcp-post-client.js

```diff
let net = require('net');
const ReadyState = {
    UNSENT:0,//（代理被创建，但尚未调用 open() 方法。
    OPENED:1,//open() 方法已经被调用
    HEADERS_RECEIVED:2,//send() 方法已经被调用，并且头部和状态已经可获得。
    LOADING:3,//（交互）正在解析响应内容
    DONE:4 //（完成）响应内容解析完成，可以在客户端调用了
}
class XMLHttpRequest {
    constructor(){
        this.readyState = ReadyState.UNSENT;
        this.headers = {};
    }
    open(method, url) {
        this.method = method||'GET';
        this.url = url;
        let {hostname,port,path} = require('url').parse(url);
        this.hostname = hostname;
        this.port = port;
        this.path = path;
        this.headers.Host=`${hostname}:${port}`;
+       this.headers.Connection=`keep-alive`;
        const socket = this.socket =  net.createConnection({port: this.port,hostname:this.hostname},()=>{
            socket.on('data', (data) => {
                data = data.toString();
                console.log(data);
                let [response,bodyRows] = data.split('\r\n\r\n');
                let [statusLine,...headerRows] = response.split('\r\n');
                let [,status,statusText] = statusLine.split(' ');
                this.status = status;
                this.statusText = statusText;
                this.responseHeaders = headerRows.reduce((memo,row)=>{
                    let [key,value] = row.split(': ');
                    memo[key]= value;
                    return memo;
                },{});
                this.readyState = ReadyState.HEADERS_RECEIVED;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.readyState = ReadyState.LOADING;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                let [,body,] = bodyRows.split('\r\n');
                this.response = this.responseText = body;
                this.readyState = ReadyState.DONE;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.onload&&this.onload();
            });
            socket.on('error', (err) => {
                this.onerror&&this.onerror(err);
            });
         });
         this.readyState = ReadyState.OPENED;
         xhr.onreadystatechange&&xhr.onreadystatechange();
    }
    getAllResponseHeaders(){
        let allResponseHeaders='';
        for(let key in this.responseHeaders){
            allResponseHeaders+=`${key}: ${this.responseHeaders[key]}\r\n`;
        }
        return allResponseHeaders;
    }
    setRequestHeader(header,value){
        this.headers[header]= value;
    }
    send(body) {
        let rows = [];
        rows.push(`${this.method} ${this.path} HTTP/1.1`);
+       this.headers["Content-Length"]=Buffer.byteLength(body);
        rows.push(...Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`));
+       let request = rows.join('\r\n')+'\r\n\r\n'+body;
        console.log(request);
        this.socket.write(request);
    }
}

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = ()=>{
    console.log('onreadystatechange',xhr.readyState);
}
xhr.open("POST", "http://127.0.0.1:8080/post");
xhr.responseType="text";
xhr.setRequestHeader('Content-Type','application/json');
xhr.onload = () => {
    console.log('readyState',xhr.readyState);
    console.log('status',xhr.status);
    console.log('statusText',xhr.statusText);
    console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());
    console.log('response',xhr.response);
};
xhr.send(`{"name":"zf"}`);
```

#### 5.2.2 tcp-post-server.js

```diff
const net = require('net');
const Parer = require('./Parser');
const server = net.createServer((socket) => {
  socket.on('data',(data)=>{
+   let parser = new Parer();
+   let {method,url,headers,body} = parser.parse(data);
+   console.log('method',method);
+   console.log('url',url);
+   console.log('headers',headers);
+   console.log('body',body);
    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Context-type: text-plain`);
    rows.push(`Date: ${new Date().toGMTString()}`);
    rows.push(`Connection: keep-alive`);
    rows.push(`Transfer-Encoding: chunked`);
    rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`);
    let response = rows.join('\r\n');
    socket.end(response);
  });
})
server.on('error', (err) => {
  console.error(err);
});

server.listen(8080,() => {
  console.log('服务器已经启动', server.address());
});
```

#### 5.2.3 Parser.js

```js
let LF = 10,//换行  line feed
    CR = 13,//回车 carriage return
    SPACE = 32,//空格
    COLON = 58;//冒号
let PARSER_UNINITIALIZED=0,//未解析
    START=1,//开始解析
    REQUEST_LINE=2,
    HEADER_FIELD_START=3,
    HEADER_FIELD=4,
    HEADER_VALUE_START=5,
    HEADER_VALUE=6,
    READING_BODY=7;
class Parser {
    constructor(){
        this.state = PARSER_UNINITIALIZED;
    }
    parse(buffer) {
        let self =this,
            requestLine='',
            headers = {},
            body='',
            i=0,
            char,
            state = START,//开始解析
            headerField='',
            headerValue='';
            console.log(buffer.toString());
        for (i = 0; i < buffer.length; i++) {
            char = buffer[i];
            switch (state) {
                case START:
                    state = REQUEST_LINE;
                    self['requestLineMark']=i;
                case REQUEST_LINE:
                    if (char == CR) {//换行
                        requestLine=buffer.toString('utf8', self['requestLineMark'], i);
                        break;
                    }else if(char == LF){//回车
                        state = HEADER_FIELD_START;
                    }
                    break;
                case HEADER_FIELD_START:
                    if(char === CR){
                        state = READING_BODY;
                        self['bodyMark'] = i+2;
                        break;
                    }else{
                        state = HEADER_FIELD;
                        self['headerFieldMark'] = i;
                    }
                case HEADER_FIELD:   
                   if (char == COLON) {
                    headerField=buffer.toString('utf8', self['headerFieldMark'], i);
                    state = HEADER_VALUE_START;
                   }
                   break;
                case HEADER_VALUE_START:
                    if (char == SPACE) {
                        break;
                    }
                    self['headerValueMark'] = i;
                    state = HEADER_VALUE;
                case HEADER_VALUE:
                    if (char === CR) {
                        headerValue=buffer.toString('utf8', self['headerValueMark'], i);
                        headers[headerField] = headerValue;
                        headerField = '';
                        headerValue = '';
                    }else if(char === LF){
                        state = HEADER_FIELD_START;
                    }
                    break;
                default:
                    break;    
            }
        }
        let [method,url] =requestLine.split(' ');
        body=buffer.toString('utf8', self['bodyMark'], i);
        return {method,url,headers,body};
    }
}
module.exports = Parser;
```

## 6.文件上传

### 6.1 实战

#### 6.1.1 请求和响应

##### 6.1.1.1 请求

![http_upload_request](http://img.zhufengpeixun.cn/http_upload_request.png)

##### 6.1.1.2 响应

![http_upload_response](http://img.zhufengpeixun.cn/http_upload_response.png)

#### 6.1.2 http-server.js

```diff
const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const url = require('url');
const server = http.createServer(function(req,res){
  const {pathname} = url.parse(req.url);
  if(['/get.html','/post.html','/upload.html'].includes(pathname)){
    res.writeHead(200,{'Context-type':"text-html"});
    res.end(fs.readFileSync(path.join(__dirname,'static',pathname.slice(1))));
  }else if(pathname === '/get'){
    res.writeHead(200,{'Context-type':"text-plain"});
    res.end('get');
  }else if(pathname === '/post'){
    let buffers = [];
    req.on('data',(data)=>{
      buffers.push(data);
    });
    req.on('end',()=>{
      console.log('method',req.method);
      console.log('url',req.url);
      console.log('headers',req.headers);
      let body = Buffer.concat(buffers);
      console.log('body',body.toString());
      res.statusCode = 200;
      res.setHeader('Context-type',"text-plain");
      res.write(body);
      res.end();
    });
  }else if(req.url === '/upload'){
+    const form = formidable();
+    form.parse(req, (err, fields, files) => {
+      console.log('fields',fields);
+      console.log('files',files);
+      let avatar = files.avatar;
+      let filePath = path.join(__dirname,'static',avatar.name);
+      fs.writeFileSync(filePath,fs.readFileSync(avatar.path));
+      res.statusCode = 200;
+      res.setHeader('Context-type',"text-plain");
+      res.write(JSON.stringify({...fields,avatar:filePath}));
+      res.end();
+    });
  }else{
    res.statusCode = 404;
    res.end();
  }
});
server.listen(8080);
```

#### 6.1.3 static\upload.html

static\upload.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>get</title>
</head>
<body>
    <form onsubmit="upload(event)">
        <input type="text" id="username"/>
        <input type="file" id="file"/>
        <input type="submit"/>
    </form>
    <script>
       function upload(event){
        event.preventDefault();
        let username= document.getElementById('username').value;
        let file= document.getElementById('file').files[0];
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/upload");
        var formData=new FormData();
        formData.append("username",username);
        formData.append("file",file);
        xhr.responseType="text";
        xhr.onload = () => {
            console.log(xhr.response);
        };
        xhr.send(formData);
       }
     </script>
</body>
</html>
```

#### 6.1.4 tcp-upload-client.js

tcp-upload-client.js

```diff
let net = require('net');
let fs = require('fs');
let path = require('path');
const ReadyState = {
    UNSENT:0,//（代理被创建，但尚未调用 open() 方法。
    OPENED:1,//open() 方法已经被调用
    HEADERS_RECEIVED:2,//send() 方法已经被调用，并且头部和状态已经可获得。
    LOADING:3,//（交互）正在解析响应内容
    DONE:4 //（完成）响应内容解析完成，可以在客户端调用了
}
class XMLHttpRequest {
    constructor(){
        this.readyState = ReadyState.UNSENT;
        this.headers = {};
    }
    open(method, url) {
        this.method = method||'GET';
        this.url = url;
        let {hostname,port,path} = require('url').parse(url);
        this.hostname = hostname;
        this.port = port;
        this.path = path;
        this.headers.Host=`${hostname}:${port}`;
        this.headers.Connection=`keep-alive`;
        const socket = this.socket =  net.createConnection({port: this.port,hostname:this.hostname},()=>{
            socket.on('data', (data) => {
                data = data.toString();
                console.log(data);
                let [response,bodyRows] = data.split('\r\n\r\n');
                let [statusLine,...headerRows] = response.split('\r\n');
                let [,status,statusText] = statusLine.split(' ');
                this.status = status;
                this.statusText = statusText;
                this.responseHeaders = headerRows.reduce((memo,row)=>{
                    let [key,value] = row.split(': ');
                    memo[key]= value;
                    return memo;
                },{});
                this.readyState = ReadyState.HEADERS_RECEIVED;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.readyState = ReadyState.LOADING;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                let [,body,] = bodyRows.split('\r\n');
                this.response = this.responseText = body;
                this.readyState = ReadyState.DONE;
                xhr.onreadystatechange&&xhr.onreadystatechange();
                this.onload&&this.onload();
            });
            socket.on('error', (err) => {
                this.onerror&&this.onerror(err);
            });
         });
         this.readyState = ReadyState.OPENED;
         xhr.onreadystatechange&&xhr.onreadystatechange();
    }
    getAllResponseHeaders(){
        let allResponseHeaders='';
        for(let key in this.responseHeaders){
            allResponseHeaders+=`${key}: ${this.responseHeaders[key]}\r\n`;
        }
        return allResponseHeaders;
    }
    setRequestHeader(header,value){
        this.headers[header]= value;
    }
+    send(formData) {
+        let rows = [];
+        let boundary = '----WebKitFormBoundaryF5odcsAPqFAB2mkm';
+        this.headers['Content-Type']= `multipart/form-data; boundary=${boundary}`;
+        let parts = [];
+        for(let key in formData){
+            let value = formData[key];
+            if(typeof value === 'string'){
+                let rows = [];
+                rows.push(`Content-Disposition: form-data; name="${key}"\r\n`);
+                rows.push(value);
+                parts.push(rows.join('\r\n'));
+            }else{
+                let rows = [];
+                rows.push(`Content-Disposition: form-data; name="${value.name}"; filename="${value.filename}"`);
+                rows.push(`Content-Type: ${value.contentType}\r\n`);
+                rows.push(value.content);
+                parts.push(rows.join('\r\n'));
+            }
+        }
+        let body = parts.join('\r\n'+'--'+boundary+'\r\n');
+        body = '--'+boundary+'\r\n'+body+'\r\n--'+boundary+'--';
+        this.headers["Content-Length"]=Buffer.byteLength(body);
+        rows.push(`${this.method} ${this.path} HTTP/1.1`);
+        rows.push(...Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`));
+        let request = rows.join('\r\n');
+        request += '\r\n\r\n';
+        let buffers = [Buffer.from(request)];
+        buffers.push(Buffer.from(body));
+        this.socket.write(Buffer.concat(buffers));
    }
}
+class FormData{
+    append(key,value){
+        this[key]=value;
+    }
+}
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = ()=>{
    console.log('onreadystatechange',xhr.readyState);
}
+xhr.open("POST", "http://127.0.0.1:8080/upload");
xhr.responseType="text";
+let formData=new FormData();
+formData.append("username",'zhufeng');
+let file = fs.readFileSync(path.join(__dirname,'file.txt'));
+formData.append("avatar",{name:'file',filename:'file.txt',contentType:'text/plain',content:file});
xhr.onload = () => {
    console.log('readyState',xhr.readyState);
    console.log('status',xhr.status);
    console.log('statusText',xhr.statusText);
    console.log('getAllResponseHeaders',xhr.getAllResponseHeaders());
    console.log('response',xhr.response);
};
+xhr.send(formData);
```

#### 6.1.5 tcp-upload-server.js

tcp-upload-server.js

```diff
const net = require('net');
const path = require('path');
const fs = require('fs');
const Parer = require('./Parser');
const server = net.createServer((socket) => {
  socket.on('data',(data)=>{
    let parser = new Parer();
    let {method,url,headers,body} = parser.parse(data);
    console.log('method',method);
    console.log('url',url);
    console.log('headers',headers);
    console.log('body',body);
+    let [,boundary] = headers['Content-Type'].match(/boundary=([^;]+)/i);
+    let parts = body.split('--'+boundary).slice(1,-1);
+    parts= parts.map(item=>item.slice(2,-2));
+    let fields = {};
+    let files = {};
+    for(let i=0;i<parts.length;i++){
+      let part = parts[i];
+      let rows = part.split('\r\n');
+      if(rows.length==3){
+        let [key,,value] = rows;
+        let [,name] = key.toString().match(/name="([^"]+?)"/);
+        fields[name]= value.toString();
+      }else if(rows.length==4){
+        let [key,type,,value] = rows;
+        let [,name,filename] = key.toString().match(/name="([^"]+?)"; filename="([^"]+?)"/);
+        let filePath = path.join(__dirname,'static',filename);
+        fs.writeFileSync(filePath,value);
+        files[name]={name,filename,path:filePath};
+      }
+    }
+    console.log(fields);
+    console.log(files);
    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Context-type: text-plain`);
    rows.push(`Date: ${new Date().toGMTString()}`);
    rows.push(`Connection: keep-alive`);
    rows.push(`Transfer-Encoding: chunked`);
+    let responseBody = JSON.stringify({...fields,...files});
+    rows.push(`\r\n${Buffer.byteLength(responseBody).toString(16)}\r\n${responseBody}\r\n0`);
    let response = rows.join('\r\n');
    socket.end(response);
  });
})
server.on('error', (err) => {
  console.error(err);
});

server.listen(8080,() => {
  console.log('服务器已经启动', server.address());
});
```

