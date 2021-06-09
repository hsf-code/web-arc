---
title: webpack分析（八）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# 15.webpack-compiler1

## 1.需求分析

- 我们将会用它将 `lisp` 风格的函数调用转换为 `C` 风格

```js
//假设我们有两个函数,`add` 和 `subtract`，那么它们的写法将会是下面这样
                  LISP                      C
   2 + 2          (add 2 2)                 add(2, 2)
   4 - 2          (subtract 4 2)            subtract(4, 2)
   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
```

## 2.编译器分为三个阶段

- 解析(Parsing) **解析**是将最初原始的代码转换为一种更加抽象的表示(即AST)
- 转换(Transformation) **转换**将对这个抽象的表示做一些处理,让它能做到编译器期望它做到的事情
- 代码生成(Code Generation) 接收处理之后的代码表示,然后把它转换成新的代码

### 2.1 解析(Parsing)

- 解析一般来说会分成两个阶段：词法分析(Lexical Analysis)和语法分析(Syntactic Analysis)
  - *词法分析**接收原始代码,然后把它分割成一些被称为 `token` 的东西，这个过程是在词法分析器(Tokenizer或者Lexer)中完成的
  - Token 是一个数组，由一些代码语句的碎片组成。它们可以是数字、标签、标点符号、运算符或者其它任何东西
  - **语法分析** 接收之前生成的 `token`，把它们转换成一种抽象的表示，这种抽象的表示描述了代码语句中的每一个片段以及它们之间的关系。这被称为中间表示(intermediate representation)或抽象语法树(Abstract Syntax Tree, 缩写为AST)
  - 抽象语法树是一个嵌套程度很深的对象，用一种更容易处理的方式代表了代码本身，也能给我们更多信息

原始`lisp`代码

```js
(add 2 (subtract 4 2))
```

tokens

```js
[
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        }
]
```

抽象语法树(AST)

```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
}
```

### 2.2 转换(Transformation)

- 编译器的下一步就是转换,它只是把 AST 拿过来然后对它做一些修改.它可以在同种语言下操作 AST，也可以把 AST 翻译成全新的语言
- 你或许注意到了我们的 `AST` 中有很多相似的元素，这些元素都有`type` 属性，它们被称为 `AST`结点。这些结点含有若干属性，可以用于描述 AST 的部分信息
- 比如下面是一个`NumberLiteral`结点

```js
{
      type: 'NumberLiteral',
      value: '2'
}
```

- 又比如下面是一个`CallExpression`结点

```js
 {
    type: 'CallExpression',
    name: 'subtract',
    params: [...nested nodes go here...]
 }
```

- 当转换 AST 的时候我们可以添加、移动、替代这些结点，也可以根据现有的 AST 生成一个全新的 AST
- 既然我们编译器的目标是把输入的代码转换为一种新的语言，所以我们将会着重于产生一个针对新语言的全新的 AST

### 2.3 遍历(Traversal)

- 为了能处理所有的结点，我们需要遍历它们，使用的是深度优先遍历

```js
 {
   type: 'Program',
   body: [{
     type: 'CallExpression',
     name: 'add',
     params: [{
       type: 'NumberLiteral',
       value: '2'
     }, {
       type: 'CallExpression',
       name: 'subtract',
       params: [{
         type: 'NumberLiteral',
         value: '4'
       }, {
         type: 'NumberLiteral',
         value: '2'
       }]
     }]
   }]
 }
```

- 对于上面的 AST 的遍历流程是这样的

```js
Program - 从 AST 的顶部结点开始
  CallExpression (add) - Program 的第一个子元素
    NumberLiteral (2) - CallExpression (add) 的第一个子元素
    CallExpression (subtract) - CallExpression (add) 的第二个子元素
      NumberLiteral (4) - CallExpression (subtract) 的第一个子元素
      NumberLiteral (2) - CallExpression (subtract) 的第二个子元素
```

### 2.4 访问者(Visitors)

- 我们最基础的想法是创建一个访问者(visitor)对象,这个对象中包含一些方法，可以接收不同的结点

```js
var visitor = {
   NumberLiteral() {},
   CallExpression() {}
};
```

- 当我们遍历 `AST` 的时候，如果遇到了匹配 `type` 的结点，我们可以调用 `visitor` 中的方法
- 一般情况下为了让这些方法可用性更好，我们会把父结点也作为参数传入

### 2.5 代码生成(Code Generation)

- 编译器的最后一个阶段是代码生成，这个阶段做的事情有时候会和转换(transformation)重叠,但是代码生成最主要的部分还是根据 AST 来输出代码
- 代码生成有几种不同的工作方式，有些编译器将会重用之前生成的 token，有些会创建独立的代码表示，以便于线性地输出代码。但是接下来我们还是着重于使用之前生成好的 `AST`
- 我们的代码生成器需要知道如何`打印`AST 中所有类型的结点，然后它会递归地调用自身，直到所有代码都被打印到一个很长的字符串中

## 3.实现编译器

### 3.1 词法分析器(Tokenizer)

- 我们只是接收代码组成的字符串，然后把它们分割成 `token` 组成的数组

```js
 (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
```

main.js

```js
let tokenizer = require('./tokenizer');
let tokens = tokenizer("(add 11 22)");
console.log(tokens);
```

tokenizer.js

```js
let LETTERS = /[a-z]/i;
let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;
function tokenizer(input){
  //current类似指标,用于记录我们在代码字符串中的位置
  let current=0;
  //tokens是一个数组,用来放置我们的token
  let tokens = [];
  //可能会在单个循环中多次增加current  
  while(current < input.length){
    //char 指向当前字符串
    let char = input[current];
    //先检查是不是一个左圆括号
    if(char === '('){
        //如果是的话,我们往tokens里push一个type为paren,value为左圆括号的对象
        tokens.push({
            type:'paren',
            value:'('
        });
        //自增current
        current++;
        //结束本次循环,进入下一个循环
        continue;
    //如果token是函数名,函数名是由一系列字母组成 比如  (add 11 22)
    }else if(LETTERS.test(char)){
        let value = '';
        //用内层循环遍历所有的字母,把它们存入value中
        while(LETTERS.test(char)){
            value+=char;
            char = input[++current];
        }
        //然后添加一个类型为name的token,进入下一个循环
        tokens.push({
            type:'name',
            value
        });
        continue;
    }else if(WHITESPACE.test(char)){
        //token并不是有效的token,所以直接进入下一个循环
        current++;
        continue;
    }else if(NUMBERS.test(char)){
        let value = '';
        //用内层循环遍历所有的数字,把它们存入value中
        while(NUMBERS.test(char)){
            value+=char;
            char = input[++current];
        }
        //然后添加一个类型为number的token,进入下一个循环
        tokens.push({
            type:'number',
            value
        });
        continue;
    }else if(char === ')'){
        tokens.push({
            type: 'paren',
            value: ')'
          });
        current++;
        continue;
    }
    //如果没有匹配上任何类型的token,则抛出一个错误
    throw new TypeError('I dont know what this character is '+ char);
  }
  return tokens;
}
module.exports = tokenizer;
```

### 3.2 语法分析器(Parser)

- 语法分析器接受 `token` 数组，然后把它转化为 `AST`

#### 3.2.1 main.js

```diff
let tokenizer = require('./tokenizer');
+let parser = require('./parser');
+let tokens = tokenizer("(add 11 (sub 3 1))");
console.log(tokens);
+let ast  = parser(tokens);
+console.log(JSON.stringify(ast,null,2));
```

#### 3.2.2 parser.js

```js
/**
 *  语法分析器接受 token 数组，然后把它转化为 AST
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
//现在我们定义parser函数,接受tokens数组
function parser(tokens) { // (add 11 22) (add 2 (subtract 4 2))
    //我们再次声明一个current变量指针
    let current = 0;
    //但是这次我们使用递归而不是 `while` 循环，所以我们定义一个 `walk` 函数
    function walk() {
        // walk函数里，我们从当前token开始
        let token = tokens[current];
        //我们检查是不是 CallExpressions 类型，我们从左圆括号开始
        if (token.type === 'paren' && token.value == '(') {
            // 我们会自增 `current` 来跳过这个括号，因为括号在 AST 中是不重要的
            token = tokens[++current];
            //我们创建一个类型为 `CallExpression` 的根节点，然后把它的 name 属性设置为当前token 的值
            //因为紧跟在左圆括号后面的 token 一定是调用的函数的名字
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: []
            }
            // 我们再次自增 `current` 变量，跳过当前的 token 
            token = tokens[++current];
            //现在我们循环遍历接下来的每一个 token，直到我们遇到右圆括号，这些 token 将会是 `CallExpression` 的 `params`(参数)
            //这也是递归开始的地方，我们采用递归的方式来解决问题，而不是去尝试解析一个可能有无限层嵌套的结点 
            //(add 2 (subtract 4 2))
            //所以我们创建一个 `while` 循环，直到遇到类型为 `'paren'`，值为右圆括号的 token
            while (token.type != 'paren' || token.type == 'paren' && token.value != ')') {
                //我们调用 `walk` 函数，它将会返回一个结点，然后我们把这个节点放入 `node.params` 中
                node.params.push(walk());
                token = tokens[current];
            }
            // 我们最后一次增加 `current`，跳过右圆括号
            current++;
            // 返回结点
            return node;
        //检查是不是 `number` 类型
        }else if(token.type === 'number'){
            // 如果是，`current` 自增。
            current++;
            // 然后我们会返回一个新的 AST 结点 `NumberLiteral`，并且把它的值设为 token 的值。
            return {
              type: 'NumberLiteral',
              value: token.value
            };
        }
        //同样，如果我们遇到了一个类型未知的结点，就抛出一个错误。
        throw new TypeError(token.type);
    }
    //现在，我们创建 AST，根结点是一个类型为 `Program` 的结点
    var ast = {
        type: 'Program',
        body: []
    };
    //现在我们开始 `walk` 函数，把结点放入 `ast.body` 中
    //之所以在一个循环中处理，是因为我们的程序可能在 `CallExpressions` 后面包含连续的两个参数，而不是嵌套的
    //(add 2 2)  (subtract 4 2)
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // 最后我们的语法分析器返回 AST 
    return ast;
}
module.exports  = parser;
```

### 3.3 遍历器

- 现在我们有了 AST，我们需要一个 `visitor` 去遍历所有的结点。当遇到某个类型的结点时，我们需要调用 `visitor` 中对应类型的处理函数

```js
 traverse(ast, {
  Program(node, parent) {
      console.log(node);
  },
  CallExpression(node, parent) {
    console.log(node);
  },
  NumberLiteral(node, parent) {
    console.log(node);
  },
});
```

#### 3.3.1 main.js

```diff
let tokenizer = require("./tokenizer");
let parser = require("./parser");
+let traverser = require("./traverser");
let tokens = tokenizer("(add 11 (sub 3 1))");
console.log(tokens);
let ast = parser(tokens);
console.log(JSON.stringify(ast, null, 2));
+let vistor = {
+  Program(node, parent) {
+      console.log(node);
+  },
+  CallExpression(node, parent) {
+    console.log(node);
+  },
+  NumberLiteral(node, parent) {
+    console.log(node);
+  },
+};
+traverser(ast,vistor);
```

#### 3.3.2 traverser.js

```js
// 所以我们定义一个遍历器，它有两个参数，AST 和 vistor。在它的里面我们又定义了两个函数...
function traverser(ast, visitor) {
     // `traverseArray` 函数允许我们对数组中的每一个元素调用 `traverseNode` 函数。
    function traverseArray(array, parent) {
        array.forEach(function(child) {
           traverseNode(child, parent);
        });
    }

    // `traverseNode` 函数接受一个 `node` 和它的父结点 `parent` 作为参数，这个结点会被
    // 传入到 visitor 中相应的处理函数那里。
    function traverseNode(node,parent){
        // 首先我们看看 visitor 中有没有对应 `type` 的处理函数。
       var method = visitor[node.type];
        // 如果有，那么我们把 `node` 和 `parent` 都传入其中。
        if (method) {
            method(node, parent);
        }
        // 下面我们对每一个不同类型的结点分开处理。
        switch (node.type) {
            //我们从顶层的 `Program` 开始，Program 结点中有一个 body 属性，它是一个由若干个结点组成的数组，所以我们对这个数组调用 `traverseArray`
            //记住 `traverseArray` 会调用 `traverseNode`，所以我们会递归地遍历这棵树。
            case 'Program':
              traverseArray(node.body, node);
            break;
            //下面我们对 `CallExpressions` 做同样的事情，遍历它的 `params`。
            case 'CallExpression':
              traverseArray(node.params, node);
              break;
              // 如果是 `NumberLiterals`，那么就没有任何子结点了，所以我们直接 break
            case 'NumberLiteral':
                break;
            // 同样，如果我们不能识别当前的结点，那么就抛出一个错误。
            default:
                throw new TypeError(node.type);
            }
    }
    // 最后我们对 AST 调用 `traverseNode`，开始遍历。注意 AST 并没有父结点。
    traverseNode(ast, null);
}
module.exports = traverser;
```

### 3.4 转换AST

- 下面是转换器。转换器接收我们在之前构建好的 AST，然后把它和 visitor 传递进入我们的遍历器中 ，最后得到一个新的 AST

![transformerAST](http://img.zhufengpeixun.cn/transformerAST.png)

#### 3.4.1 main.js

```diff
let tokenizer = require("./tokenizer");
let parser = require("./parser");
let traverser = require("./traverser");
+let transformer = require("./transformer");
let tokens = tokenizer("(add 2 (subtract 4 2))");
console.log(tokens);
let ast = parser(tokens);
console.log(JSON.stringify(ast, null, 2));
let vistor = {
  Program(node, parent) {
      console.log(node);
  },
  CallExpression(node, parent) {
    console.log(node);
  },
  NumberLiteral(node, parent) {
    console.log(node);
  },
};
//traverser(ast,vistor);
+var newAst = transformer(ast);
+console.log(JSON.stringify(newAst, null, 2));
```

#### 3.4.2 transformer.js

```js
let traverser = require('./traverser');
function transformer(ast) {
  // 创建 `newAST`，它与我们之前的 AST 类似，有一个类型为 Program 的根节点。
  var newAst = {
    type: 'Program',
    body: []
  };//老的ast有一个属性_context指向新的ast的body
  ast._context = newAst.body;
  // 我们把 AST 和 visitor 函数传入遍历器
  traverser(ast,{
    NumberLiteral(node,parent){
        // 我们创建一个新结点，名字叫 `NumberLiteral`，并把它放入父结点的 context 中。
        parent._context.push({
            type:'NumberLiteral',
            value:node.value
        });
    },
    CallExpression(node,parent){
      //我们创建一个 `CallExpression` 结点，里面有一个嵌套的 `Identifier`
      var expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name
        },
        arguments: []
      };
      // 下面我们在原来的 `CallExpression` 结点上定义一个新的 context，它是 expression
      // 中 arguments 这个数组的引用，我们可以向其中放入参数。
      node._context = expression.arguments;
      // 最后我们把 `CallExpression`放入父结点的 context 中。
      parent._context.push(expression);
    }
  });
  // 最后返回创建好的新 AST
  return newAst;
}
module.exports = transformer;
```

### 3.5 代码生成

- 我们的代码生成器会递归地调用它自己，把 AST 中的每个结点打印到一个很大的字符串中

#### 3.5.1 main.js

```js
let tokenizer = require("./tokenizer");
let parser = require("./parser");
let traverser = require("./traverser");
let transformer = require("./transformer");
let codeGenerator = require("./codeGenerator");
let tokens = tokenizer("(add 2 (subtract 4 2))");
console.log(tokens);
let ast = parser(tokens);
console.log(JSON.stringify(ast, null, 2));
let vistor = {
  Program(node, parent) {
      console.log(node);
  },
  CallExpression(node, parent) {
    console.log(node);
  },
  NumberLiteral(node, parent) {
    console.log(node);
  },
};
//traverser(ast,vistor);
var newAst = transformer(ast);
console.log(JSON.stringify(newAst, null, 2));

let newCode = codeGenerator(newAst);
console.log(newCode);
```

#### 3.5.2 codeGenerator.js

```js
function codeGenerator(node) {
    // 对于不同 `type` 的结点分开处理。
    switch (node.type) {
      // 如果是 `Program` 结点，那么我们会遍历它的 `body` 属性中的每一个结点，并且递归地
      // 对这些结点再次调用 codeGenerator，再把结果打印进入新的一行中。
      case 'Program':
        return node.body.map(codeGenerator)
          .join('\n');
      // 对于 `CallExpressions`，我们会打印出 `callee`，接着是一个左圆括号，然后对
      // arguments 递归调用 codeGenerator，并且在它们之间加一个逗号，最后加上右圆括号。
      case 'CallExpression':
        return (
          codeGenerator(node.callee) +
          '(' +
          node.arguments.map(codeGenerator)
            .join(', ') +
          ')'
        );

      // 对于 `Identifiers` 我们只是返回 `node` 的 name。
      case 'Identifier':
        return node.name;

      // 对于 `NumberLiterals` 我们只是返回 `node` 的 value
      case 'NumberLiteral':
        return node.value;

      // 如果我们不能识别这个结点，那么抛出一个错误。
      default:
        throw new TypeError(node.type);
    }
  }
  module.exports = codeGenerator;
```

### 3.6 打包

#### 3.6.1 main.js

```js
const compier = require("./compiler");

let compiler = require('./compiler');
let output = compiler("(add 2 (subtract 4 2))");
console.log(output);
```

#### 3.6.2 compiler\index.js

compiler\index.js

```js
const tokenizer = require("./tokenizer");
const parser = require("./parser");
const transformer = require("./transformer");
const codeGenerator = require("./codeGenerator");

function compier(input){
    let tokens = tokenizer(input);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    let output = codeGenerator(newAst);
    return output;
}
module.exports = compier;
```

#### 3.6.3 tokenizer.js

compiler\tokenizer.js

```js
let LETTERS = /[a-z]/i;
let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;
function tokenizer(input){
  //current类似指标,用于记录我们在代码字符串中的位置
  let current=0;
  //tokens是一个数组,用来放置我们的token
  let tokens = [];
  //可能会在单个循环中多次增加current  
  while(current < input.length){
    //char 指向当前字符串
    let char = input[current];
    //先检查是不是一个左圆括号
    if(char === '('){
        //如果是的话,我们往tokens里push一个type为paren,value为左圆括号的对象
        tokens.push({
            type:'paren',
            value:'('
        });
        //自增current
        current++;
        //结束本次循环,进入下一个循环
        continue;
    //如果token是函数名,函数名是由一系列字母组成 比如  (add 11 22)
    }else if(LETTERS.test(char)){
        let value = '';
        //用内层循环遍历所有的字母,把它们存入value中
        while(LETTERS.test(char)){
            value+=char;
            char = input[++current];
        }
        //然后添加一个类型为name的token,进入下一个循环
        tokens.push({
            type:'name',
            value
        });
        continue;
    }else if(WHITESPACE.test(char)){
        //token并不是有效的token,所以直接进入下一个循环
        current++;
        continue;
    }else if(NUMBERS.test(char)){
        let value = '';
        //用内层循环遍历所有的数字,把它们存入value中
        while(NUMBERS.test(char)){
            value+=char;
            char = input[++current];
        }
        //然后添加一个类型为number的token,进入下一个循环
        tokens.push({
            type:'number',
            value
        });
        continue;
    }else if(char === ')'){
        tokens.push({
            type: 'paren',
            value: ')'
          });
        current++;
        continue;
    }
    //如果没有匹配上任何类型的token,则抛出一个错误
    throw new TypeError('I dont know what this character is '+ char);
  }
  return tokens;
}
module.exports = tokenizer;
```

#### 3.6.4 parser.js

compiler\parser.js

```js
/**
 *  语法分析器接受 token 数组，然后把它转化为 AST
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
//现在我们定义parser函数,接受tokens数组
function parser(tokens) { // (add 11 22) (add 2 (subtract 4 2))
    //我们再次声明一个current变量指针
    let current = 0;
    //但是这次我们使用递归而不是 `while` 循环，所以我们定义一个 `walk` 函数
    function walk() {
        // walk函数里，我们从当前token开始
        let token = tokens[current];
        //我们检查是不是 CallExpressions 类型，我们从左圆括号开始
        if (token.type === 'paren' && token.value == '(') {
            // 我们会自增 `current` 来跳过这个括号，因为括号在 AST 中是不重要的
            token = tokens[++current];
            //我们创建一个类型为 `CallExpression` 的根节点，然后把它的 name 属性设置为当前token 的值
            //因为紧跟在左圆括号后面的 token 一定是调用的函数的名字
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: []
            }
            // 我们再次自增 `current` 变量，跳过当前的 token 
            token = tokens[++current];
            //现在我们循环遍历接下来的每一个 token，直到我们遇到右圆括号，这些 token 将会是 `CallExpression` 的 `params`(参数)
            //这也是递归开始的地方，我们采用递归的方式来解决问题，而不是去尝试解析一个可能有无限层嵌套的结点 
            //(add 2 (subtract 4 2))
            //所以我们创建一个 `while` 循环，直到遇到类型为 `'paren'`，值为右圆括号的 token
            while (token.type != 'paren' || token.type == 'paren' && token.value != ')') {
                //我们调用 `walk` 函数，它将会返回一个结点，然后我们把这个节点放入 `node.params` 中
                node.params.push(walk());
                token = tokens[current];
            }
            // 我们最后一次增加 `current`，跳过右圆括号
            current++;
            // 返回结点
            return node;
        //检查是不是 `number` 类型
        }else if(token.type === 'number'){
            // 如果是，`current` 自增。
            current++;
            // 然后我们会返回一个新的 AST 结点 `NumberLiteral`，并且把它的值设为 token 的值。
            return {
              type: 'NumberLiteral',
              value: token.value
            };
        }
        //同样，如果我们遇到了一个类型未知的结点，就抛出一个错误。
        throw new TypeError(token.type);
    }
    //现在，我们创建 AST，根结点是一个类型为 `Program` 的结点
    var ast = {
        type: 'Program',
        body: []
    };
    //现在我们开始 `walk` 函数，把结点放入 `ast.body` 中
    //之所以在一个循环中处理，是因为我们的程序可能在 `CallExpressions` 后面包含连续的两个参数，而不是嵌套的
    //(add 2 2)  (subtract 4 2)
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // 最后我们的语法分析器返回 AST 
    return ast;
}
module.exports  = parser;
```

#### 3.6.5 transformer.js

```js
let traverser = require('./traverser');
function transformer(ast) {
  // 创建 `newAST`，它与我们之前的 AST 类似，有一个类型为 Program 的根节点。
  var newAst = {
    type: 'Program',
    body: []
  };//老的ast有一个属性_context指向新的ast的body
  ast._context = newAst.body;
  // 我们把 AST 和 visitor 函数传入遍历器
  traverser(ast,{
    NumberLiteral(node,parent){
        // 我们创建一个新结点，名字叫 `NumberLiteral`，并把它放入父结点的 context 中。
        parent._context.push({
            type:'NumberLiteral',
            value:node.value
        });
    },
    CallExpression(node,parent){
      //我们创建一个 `CallExpression` 结点，里面有一个嵌套的 `Identifier`
      var expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name
        },
        arguments: []
      };
      // 下面我们在原来的 `CallExpression` 结点上定义一个新的 context，它是 expression
      // 中 arguments 这个数组的引用，我们可以向其中放入参数。
      node._context = expression.arguments;
      // 最后我们把 `CallExpression`放入父结点的 context 中。
      parent._context.push(expression);
    }
  });
  // 最后返回创建好的新 AST
  return newAst;
}
module.exports = transformer;
```

#### 3.6.6 codeGenerator.js

```js
function codeGenerator(node) {
    // 对于不同 `type` 的结点分开处理。
    switch (node.type) {
      // 如果是 `Program` 结点，那么我们会遍历它的 `body` 属性中的每一个结点，并且递归地
      // 对这些结点再次调用 codeGenerator，再把结果打印进入新的一行中。
      case 'Program':
        return node.body.map(codeGenerator)
          .join('\n');
      // 对于 `CallExpressions`，我们会打印出 `callee`，接着是一个左圆括号，然后对
      // arguments 递归调用 codeGenerator，并且在它们之间加一个逗号，最后加上右圆括号。
      case 'CallExpression':
        return (
          codeGenerator(node.callee) +
          '(' +
          node.arguments.map(codeGenerator)
            .join(', ') +
          ')'
        );

      // 对于 `Identifiers` 我们只是返回 `node` 的 name。
      case 'Identifier':
        return node.name;

      // 对于 `NumberLiterals` 我们只是返回 `node` 的 value
      case 'NumberLiteral':
        return node.value;

      // 如果我们不能识别这个结点，那么抛出一个错误。
      default:
        throw new TypeError(node.type);
    }
  }
  module.exports = codeGenerator;
```

#### 3.6.7 compiler\traverser.js

```js
// 所以我们定义一个遍历器，它有两个参数，AST 和 vistor。在它的里面我们又定义了两个函数...
function traverser(ast, visitor) {
     // `traverseArray` 函数允许我们对数组中的每一个元素调用 `traverseNode` 函数。
    function traverseArray(array, parent) {
        array.forEach(function(child) {
           traverseNode(child, parent);
        });
    }

    // `traverseNode` 函数接受一个 `node` 和它的父结点 `parent` 作为参数，这个结点会被
    // 传入到 visitor 中相应的处理函数那里。
    function traverseNode(node,parent){
        // 首先我们看看 visitor 中有没有对应 `type` 的处理函数。
       var method = visitor[node.type];
        // 如果有，那么我们把 `node` 和 `parent` 都传入其中。
        if (method) {
            method(node, parent);
        }
        // 下面我们对每一个不同类型的结点分开处理。
        switch (node.type) {
            //我们从顶层的 `Program` 开始，Program 结点中有一个 body 属性，它是一个由若干个结点组成的数组，所以我们对这个数组调用 `traverseArray`
            //记住 `traverseArray` 会调用 `traverseNode`，所以我们会递归地遍历这棵树。
            case 'Program':
              traverseArray(node.body, node);
            break;
            //下面我们对 `CallExpressions` 做同样的事情，遍历它的 `params`。
            case 'CallExpression':
              traverseArray(node.params, node);
              break;
              // 如果是 `NumberLiterals`，那么就没有任何子结点了，所以我们直接 break
            case 'NumberLiteral':
                break;
            // 同样，如果我们不能识别当前的结点，那么就抛出一个错误。
            default:
                throw new TypeError(node.type);
            }
    }
    // 最后我们对 AST 调用 `traverseNode`，开始遍历。注意 AST 并没有父结点。
    traverseNode(ast, null);
}
module.exports = traverser;
```

## 4.有限状态机

- 每一个状态都是一个机器,每个机器都可以接收输入和计算输出
- 机器本身没有状态,每一个机器会根据输入决定下一个状态

![statemachine.jpg](http://img.zhufengpeixun.cn/statemachine.jpg)

```js
let LETTERS = /[a-z]/i;
let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;
let currentToken;

function start(char){
    if(char === '('){
        emit({ type: 'paren',  value: '('});
        return foundParen;
    }else{
        return start;
    }
}
function foundParen(char){
    if(LETTERS.test(char)){
        currentToken = {
            type:'name',
            value:''
        }
        return name(char);
    }
    throw new TypeError('函数名必须是字符 '+ char); 
}
function name(char){
    if(char.match(/^[a-zA-Z]$/)){
        currentToken.value += char;
        return name;
    }else if(char == " "){
        emit(currentToken);
        currentToken = {
            type:'number',
            value:''
        }
        return number;
    }
    throw new TypeError('函数名必须以空格结束 '+ char); 
}
function number(char){
    if(NUMBERS.test(char)){
        currentToken.value += char;
        return number;
    }else if(char == " "){
        emit(currentToken);
        currentToken = {
            type:'number',
            value:''
        }
        return number;
    }else if(char == ")"){
        emit(currentToken);
        emit({ type: 'paren',  value: ')'});
        return start;
    }
    throw new TypeError('参数必须是数字 '+ char); 
}

function tokenizer(input){
    let state = start;
    for(let char of input){
        state = state(char);
    }
}

function emit(token){
    console.log(token);
}
tokenizer('(add 45 23)');
```

## 5.正则分词

```js
let RegExpObject = /([0-9]+)|([ ])|(\+)|(\-)|(\*)|(\/)|([\(])|([\)])/g;
let names = ["Number","Space","+","-","*","/","(",")"];

function* tokenize(source){
  let result = null;
  while(true){
      result = RegExpObject.exec(source);
      if(!result) break;
      let token = {type:null,value:null};
      let index = result.find((item,index)=>index>0&&!!item);
      token.type = names[index];
      token.value = (result[0]);
      yield token;
  }
}
let tokens = [];
for(let token of tokenize("33+44-55*66*(77+55)")){
    tokens.push(token);
}
console.log(tokens);
```



# 15.webpack-compiler2

## 1.需求分析

- 实现JSX语法转成JS语法的编译器
- 需求：将一段`JSX`语法的代码生成一个`AST`，并支持遍历和修改这个`AST`，将`AST`重新生成JS语法的代码

JSX代码

```js
<h1 id="title"><span>hello</span>world</h1>
```

JS代码

```js
React.createElement("h1", {
  id: "title"
},React.createElement("span", null, "hello"), "world");
```

## 2.编译器工作流

- 解析(Parsing) **解析**是将最初原始的代码转换为一种更加抽象的表示(即AST)
- 转换(Transformation) **转换**将对这个抽象的表示做一些处理,让它能做到编译器期望它做到的事情
- 代码生成(Code Generation) 接收处理之后的代码表示,然后把它转换成新的代码

### 2.1 解析(Parsing)

- 解析一般来说会分成两个阶段：词法分析(Lexical Analysis)和语法分析(Syntactic Analysis)
  - `词法分析` 接收原始代码,然后把它分割成一些被称为 `token` 的东西，这个过程是在词法分析器(Tokenizer或者Lexer)中完成的
  - Token 是一个数组，由一些代码语句的碎片组成。它们可以是数字、标签、标点符号、运算符或者其它任何东西
  - `语法分析` 接收之前生成的 `token`，把它们转换成一种抽象的表示，这种抽象的表示描述了代码语句中的每一个片段以及它们之间的关系。这被称为中间表示(intermediate representation)或抽象语法树(Abstract Syntax Tree, 缩写为AST)
  - 抽象语法树是一个嵌套程度很深的对象，用一种更容易处理的方式代表了代码本身，也能给我们更多信息

原始`jsx`代码

```js
<h1 id="title"><span>hello</span>world</h1>
```

tokens

```js
[
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Punctuator', value: '=' },
    { type: 'String', value: '"title"' },
    { type: 'Punctuator', value: '>' },
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'Punctuator', value: '>' }
  ]
```

抽象语法树(AST)

[astexplorer](https://astexplorer.net/)

```js
{
    "type": "Program",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "JSXElement",
                "openingElement": {
                    "type": "JSXOpeningElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    },
                    "attributes": [
                        {
                            "type": "JSXAttribute",
                            "name": {
                                "type": "JSXIdentifier",
                                "name": "id"
                            },
                            "value": {
                                "type": "Literal",
                                "value": "title"
                            }
                        }
                    ]
                },
                "children": [
                    {
                        "type": "JSXElement",
                        "openingElement": {
                            "type": "JSXOpeningElement",
                            "name": {
                                "type": "JSXIdentifier",
                                "name": "span"
                            }
                            "attributes": []
                        },
                        "children": [
                            {
                                "type": "JSXText",
                                "value": "hello"
                            }
                        ],
                        "closingElement": {
                            "type": "JSXClosingElement",
                            "name": {
                                "type": "JSXIdentifier",
                                "name": "span"
                            }
                        }
                    },
                    {
                        "type": "JSXText",
                        "value": "world"
                    }
                ],
                "closingElement": {
                    "type": "JSXClosingElement",
                    "name": {
                        "type": "JSXIdentifier",
                        "name": "h1"
                    }
                }
            }
        }
    ]
}
```

### 2.2 遍历(Traversal)

- 为了能处理所有的结点，我们需要遍历它们，使用的是深度优先遍历
- 对于上面的 `AST` 的遍历流程是这样的

```js
let esprima = require('esprima');//把JS源代码转成AST语法树
let code = `<h1 id="title"><span>hello</span>world</h1>`;
let estraverse = require('estraverse-fb');///遍历语法树,修改树上的节点
let ast = esprima.parseScript(code, {  tokens: true,jsx: true });
let indent = 0;
function padding(){
    return " ".repeat(indent);
}
estraverse.traverse(ast,{
    enter(node){
        console.log(padding()+node.type+'进入');
        indent+=2;
    },
    leave(node){
        indent-=2;
        console.log(padding()+node.type+'离开');
    }
});
Program进入
  ExpressionStatement进入
    JSXElement进入
      JSXOpeningElement进入
        JSXIdentifier进入
        JSXIdentifier离开
        JSXAttribute进入
          JSXIdentifier进入
          JSXIdentifier离开
          Literal进入
          Literal离开
        JSXAttribute离开
      JSXOpeningElement离开
      JSXClosingElement进入
        JSXIdentifier进入
        JSXIdentifier离开
      JSXClosingElement离开
      JSXElement进入
        JSXOpeningElement进入
          JSXIdentifier进入
          JSXIdentifier离开
        JSXOpeningElement离开
        JSXClosingElement进入
          JSXIdentifier进入
          JSXIdentifier离开
        JSXClosingElement离开
        JSXText进入
        JSXText离开
      JSXElement离开
      JSXText进入
      JSXText离开
    JSXElement离开
  ExpressionStatement离开
Program离开
```

### 2.3 转换(Transformation)

- 编译器的下一步就是转换,它只是把 AST 拿过来然后对它做一些修改.它可以在同种语言下操作 AST，也可以把 AST 翻译成全新的语言
- 你或许注意到了我们的 `AST` 中有很多相似的元素，这些元素都有`type` 属性，它们被称为 `AST`结点。这些结点含有若干属性，可以用于描述 AST 的部分信息
- 当转换 AST 的时候我们可以添加、移动、替代这些结点，也可以根据现有的 AST 生成一个全新的 AST
- 既然我们编译器的目标是把输入的代码转换为一种新的语言，所以我们将会着重于产生一个针对新语言的全新的 AST

### 2.4 代码生成(Code Generation)

- 编译器的最后一个阶段是代码生成，这个阶段做的事情有时候会和转换(transformation)重叠,但是代码生成最主要的部分还是根据 AST 来输出代码
- 代码生成有几种不同的工作方式，有些编译器将会重用之前生成的 token，有些会创建独立的代码表示，以便于线性地输出代码。但是接下来我们还是着重于使用之前生成好的 `AST`
- 我们的代码生成器需要知道如何`打印`AST 中所有类型的结点，然后它会递归地调用自身，直到所有代码都被打印到一个很长的字符串中

## 3. 有限状态机

- 每一个状态都是一个机器,每个机器都可以接收输入和计算输出
- 机器本身没有状态,每一个机器会根据输入决定下一个状态

```js
let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;

const Number = 'Number';
const Plus = 'Plus';

let currentToken;
let tokens = [];
function emit(token){
    currentToken = { type: "", value: "" };
    tokens.push(token);
}

function start(char){
    if(NUMBERS.test(char)){
        currentToken = {
            type:Number,
            value:''
        }
        return number(char);
    }
    throw new TypeError('函数名必须是字符 '+ char); 
}
function number(char){
    if(NUMBERS.test(char)){
        currentToken.value += char;
        return number;
    }else if(char == "+"){
        emit(currentToken);
        emit({ type: Plus,  value: '+'});
        currentToken = {
            type:Number,
            value:''
        }
        return number;
    }
}
function tokenizer(input){
    let state = start;
    for(let char of input){
        state = state(char);
    }
    emit(currentToken);
}

tokenizer('10+20')
console.log(tokens);
[
  { type: 'Number', value: '10' },
  { type: 'Plus', value: '+' },
  { type: 'Number', value: '20' }
]
```

### 4 词法分析器

- 我们只是接收代码组成的字符串，然后把它们分割成 `token` 组成的数组

### 4.1 tokenTypes.js

src\tokenTypes.js

```js
exports.LeftParentheses = 'LeftParentheses';// < 
exports.RightParentheses = 'RightParentheses';// < 
exports.JSXIdentifier = 'JSXIdentifier';//标识符
exports.AttributeKey = 'AttributeKey';//属性的key
exports.AttributeStringValue = 'AttributeStringValue';//字符串格式的属性值
exports.JSXText = 'JSXText';//文本
exports.BackSlash = 'BackSlash';//反斜杠
```

### 4.2 tokenizer.js

src\tokenizer.js

```js
const LETTERS = /[a-z0-9]/;
const tokenTypes = require('./tokenTypes');
let currentToken = {type:'',value:''};
let tokens = [];
function emit(token){//一旦发射了一个token之后,就可以清空currentToken,然后放入数组
    currentToken = {type:'',value:''};
    tokens.push(token);
}
function start(char){
    if(char === '<'){
        emit({type:tokenTypes.LeftParentheses,value:'<'});
        return foundLeftParentheses;//找到了<
    }
    throw new Error('第一个字符必须是<');
}
/* function eof(){
    if(currentToken.value.length>0)
        emit(currentToken);
} */
function foundLeftParentheses(char){//char=h1
    if(LETTERS.test(char)){//如果char是一个小写字母的话
        currentToken.type = tokenTypes.JSXIdentifier;
        currentToken.value += char;//h
        return jsxIdentifier;//继续收集标识符
    }else if(char === '/'){
        emit({type:tokenTypes.BackSlash,value:'/'});
        return foundLeftParentheses;
    }
    throw new Error('第一个字符必须是<');
}
function jsxIdentifier(char){
    if(LETTERS.test(char)){//如果是小写字母或者是数字的话
        currentToken.value+=char;
        return jsxIdentifier;
    }else if(char === ' '){//如果收集标识符的过程中遇到了空格了,说明标识符结束 
        emit(currentToken);
        return attribute;
    }else if(char == '>'){//说明此标签没有属性,直接结束了
        emit(currentToken);
        emit({type:tokenTypes.RightParentheses,value:'>'});
        return foundRightParentheses;
    }   
    throw new Error('第一个字符必须是<');
}
function attribute(char){//char=i
    if(LETTERS.test(char)){
        currentToken.type = tokenTypes.AttributeKey;//属性的key
        currentToken.value += char;//属性key的名字
        return attributeKey;
    }
    throw new TypeError('Error');
}
function attributeKey(char){
    if(LETTERS.test(char)){//d
        currentToken.value += char;
        return attributeKey;
    }else if(char === '='){//说明属性的key的名字已经结束了
        emit(currentToken);// { type: 'JSXIdentifier', value: 'h1' },
        return attributeValue;
    }
    throw new TypeError('Error');
}
function attributeValue(char){//char="
    if(char === '"'){
        currentToken.type = tokenTypes.AttributeStringValue;
        currentToken.value = '';
        return attributeStringValue;//开始读字符串属性值
    }
    throw new TypeError('Error');
}

function attributeStringValue(char){//title
    if(LETTERS.test(char)){
        currentToken.value+=char;
        return attributeStringValue;
    }else if(char === '"'){//说明字符串的值结束了
        emit(currentToken);//{ type: 'AttributeStringValue', value: '"title"' },
        return tryLeaveAttribute;
    }
    throw new TypeError('Error');
}
//因为后面可以是一个新属性,也可以是开始标签的结束
function tryLeaveAttribute(char){
    if(char === ' '){
        return attribute;//如果后面是空格的话,说明后面是一个新的属性
    }else if(char === '>'){//说明开始标签结束了
        emit({type:tokenTypes.RightParentheses,value:'>'});
        return foundRightParentheses;
    }
    throw new TypeError('Error');
}
function foundRightParentheses(char){
    if(char === '<'){
        emit({type:tokenTypes.LeftParentheses,value:'<'});
        return foundLeftParentheses;//找到了<
    }else{
        currentToken.type = tokenTypes.JSXText;
        currentToken.value += char;
        return jsxText;
    }
}
function jsxText(char){
  if(char === '<'){
    emit(currentToken);//{ type: 'JSXText', value: 'hello' },
    emit({type:tokenTypes.LeftParentheses,value:'<'});
    return foundLeftParentheses;
  }else{
    currentToken.value += char;
    return jsxText;
  }
}
function tokenizer(input){
    let state = start;//刚开始处于开始状态
    debugger
    for(let char of input){//遍历或者说循环所有的字符
        if(state) state = state(char);
    }
    return tokens;
}

/* let sourceCode = '<h1 id="title" name={name}><span>hello</span>world</h1>';
console.log(tokenizer(sourceCode));
 */
module.exports = {
    tokenizer
}
/**
[    <h1 id="title"><span>hello</span>world</h1>
    { type: 'LeftParentheses', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'AttributeKey', value: 'id' },
    { type: 'AttributeStringValue', value: '"title"' },
    { type: 'RightParentheses', value: '>' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentheses', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentheses', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'RightParentheses', value: '>' }
  ]
 */
```

分词结果

```js
[
  { type: 'LeftParentheses', value: '<' },
  { type: 'JSXIdentifier', value: 'h1' },
  { type: 'AttributeKey', value: 'id' },
  { type: 'AttributeStringValue', value: 'title' },
  { type: 'RightParentheses', value: '>' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'JSXIdentifier', value: 'span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'hello' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'BackSlash', value: '/' },
  { type: 'JSXIdentifier', value: 'span' },
  { type: 'RightParentheses', value: '>' },
  { type: 'JSXText', value: 'world' },
  { type: 'LeftParentheses', value: '<' },
  { type: 'BackSlash', value: '/' },
  { type: 'JSXIdentifier', value: 'h1' },
  { type: 'RightParentheses', value: '>' }
]
```

## 5.语法分析

- 语法分析的原理和递归下降算法（Recursive Descent Parsing）
- 并初步了解上下文无关文法（Context-free Grammar，CFG）

### 5.1 递归下降算法

- 它的左边是一个非终结符（Non-terminal）
- 右边是它的产生式（Production Rule）
- 在语法解析的过程中，左边会被右边替代。如果替代之后还有非终结符，那么继续这个替代过程，直到最后全部都是终结符（Terminal），也就是 `Token`
- 只有终结符才可以成为 `AST` 的叶子节点。这个过程，也叫做推导（Derivation）过程
- 上级文法嵌套下级文法，上级的算法调用下级的算法。表现在生成 AST 中，上级算法生成上级节点，下级算法生成下级节点。这就是`下降`的含义

### 5.2 上下文无关文法

- 上下文无关的意思是，无论在任何情况下，文法的推导规则都是一样的
- 规则分成两级：第一级是加法规则，第二级是乘法规则。把乘法规则作为加法规则的子规则
- 解析形成 AST 时，乘法节点就一定是加法节点的子节点，从而被优先计算
- 加法规则中还`递归`地又引用了加法规则

### 5.3 算术表达式

算术表达式

```js
2+3*4
```

语法规则

```js
add ->  multiple|multiple + add
multiple -> NUMBER | NUMBER *  multiple
```

tokens

```js
 [
    { type: 'NUMBER', value: '2' },
    { type: 'PLUS', value: '+' },
    { type: 'NUMBER', value: '3' },
    { type: 'MULTIPLY', value: '*' },
    { type: 'NUMBER', value: '4' }
  ]
```

![formularast.png](https://img.zhufengpeixun.com/formularast.png)

![binaryast.jpg](https://img.zhufengpeixun.com/binaryast.jpg)

ast

```json
{
  "type": "Program",
  "children": [
    {
      "type": "Additive",
      "children": [
        {
          "type": "Numeric",
          "value": "2"
        },
        {
          "type": "Multiplicative",
          "children": [
            {
              "type": "Numeric",
              "value": "3"
            },
            {
              "type": "Numeric",
              "value": "4"
            }
          ]
        }
      ]
    }
  ]
}
```

### 5.4 实现

#### 5.4.1 index.js

index.js

```js
let parse = require('./parse');
let evaluate = require('./evaluate');
let sourceCode = "2+3*4";
let ast = parse(sourceCode);
console.log(JSON.stringify(ast, null, 2));
let result = evaluate(ast);
console.log(result);
```

#### 5.4.2 parse.js

parse.js

```js
let tokenize = require('./tokenize');
let toAst = require('./toAst');
function parse(script) {
    let tokens = tokenize(script);
    console.log(tokens);
    let ast = toAst(tokens);
    return ast;
}

module.exports = parse;
```

#### 5.4.3 tokenTypes.js

tokenTypes.js

```js
exports.Program = 'Program';
exports.Numeric = 'Numeric';
exports.Additive = 'Additive';
exports.Multiplicative = 'Multiplicative';
```

#### 5.4.4 tokenize.js

tokenize.js

```js
let RegExpObject = /([0-9]+)|(\+)|(\*)/g;
let tokenTypes = require('./tokenTypes');
let tokenArray = [tokenTypes.NUMBER,tokenTypes.PLUS,tokenTypes.MULTIPLY];
function* tokenizer(source){
  let result = null;
  while(true){
      result = RegExpObject.exec(source);
      if(!result) break;
      let token = {type:null,value:null};
      let index = result.findIndex((item,index)=>index>0&&!!item);//获取匹配的分组的索引
      token.type = tokenArray[index-1];
      token.value = result[0];
      yield token;
  }
}
function tokenize(script){
    let tokens = [];
    for(let token of tokenizer(script)){
        tokens.push(token);
    }
    return new TokenReader(tokens);
}
class TokenReader{
    constructor(tokens){
        this.tokens = tokens;
        this.pos = 0;
    }
    read() {
        if (this.pos < this.tokens.length) {
            return this.tokens[this.pos++];
        }
        return null;
    }
    peek() {
        if (this.pos < this.tokens.length) {
            return this.tokens[this.pos];
        }
        return null;
    }
    unread() {
        if (this.pos > 0) {
            this.pos--;
        }
    }
    getPosition() {
        return this.pos;
    }
    setPosition(position) {
        if (position >=0 && position < tokens.length){
            this.pos = position;
        }
    }
}
module.exports = tokenize;
/* let tokens = tokenize('2+3*4');
console.log(tokens); */
```

#### 5.4.5 nodeTypes.js

nodeTypes.js

```js
exports.Program = 'Program';
exports.Numeric = 'Numeric';
exports.Additive = 'Additive';
exports.Multiplicative = 'Multiplicative';
```

#### 5.4.6 ASTNode.js

ASTNode.js

```js
class ASTNode{
  constructor(type,value){
      this.type = type;
      if(value)this.value = value;
  }
  addChild(child) {
    if(!this.children) this.children=[];
    this.children.push(child);
  }
}

module.exports = ASTNode;
```

#### 5.4.7 toAst.js

toAst.js

```js
let ASTNode = require('./ASTNode');
let tokenTypes = require('./tokenTypes');
let nodeTypes = require('./nodeTypes');
function toAst(tokenReader){
    let node = new ASTNode('Program');
    let child = additive(tokenReader);
    if (child != null) {
        node.addChild(child);
    }
    return node;
}

function additive(tokenReader){
    let child1 = multiplicative(tokenReader);
    let node = child1;
    let token = tokenReader.peek();
    if (child1 != null && token != null) {
        if (token.type == tokenTypes.PLUS) {
            token = tokenReader.read();
            let child2 = additive(tokenReader);
            if (child2 != null) {
                node = new ASTNode(nodeTypes.Additive);
                node.addChild(child1);
                node.addChild(child2);
            } else {
                throw new Exception("非法的加法表达式,需要右半部分");
            }
        }
    }
    return node;
}
function multiplicative(tokenReader){
    let child1 = primary(tokenReader);
    let node = child1;

    let token = tokenReader.peek();
    if (child1 != null && token != null) {
        if (token.type == tokenTypes.MULTIPLY) {
            token = tokenReader.read();
            let child2 = primary(tokenReader);
            if (child2 != null) {
                node = new ASTNode(nodeTypes.Multiplicative);
                node.addChild(child1);
                node.addChild(child2);
            } else {
                throw new Exception("非法的乘法表达式,需要右半部分");
            }
        }
    }
    return node;
}

function primary(tokenReader){
    let node = null;
    let token = tokenReader.peek();
    if (token != null) {
        if (token.type == tokenTypes.NUMBER) {
            token = tokenReader.read();
            node = new ASTNode(nodeTypes.Numeric, token.value);
        }
    }
    return node;
}

module.exports = toAst;
```

#### 5.4.8 evaluate.js

evaluate.js

```js
let nodeTypes = require('./nodeTypes');

function evaluate(node) {
    let result = 0;
    switch (node.type) {
        case nodeTypes.Program:
            for (let child of node.children) {
                result = evaluate(child);
            }
            break;
        case nodeTypes.Additive:
            result = evaluate(node.children[0]) + evaluate(node.children[1]);    
            break;
        case nodeTypes.Multiplicative:
            result = evaluate(node.children[0]) * evaluate(node.children[1]);   
            break; 
        case nodeTypes.Numeric:
            result = parseFloat(node.value);   
            break;
    }
    return result;
}
module.exports = evaluate;
```

### 5.5 支持减法和除法

#### 5.5.1 index.js

```diff
-let sourceCode = '2+2*2+4';
+let sourceCode = '6+1-3*4/2';
```

#### 5.5.2 tokenTypes.js

```diff
+exports.MINUS = 'MINUS';
+exports.MULTIPLY = 'MULTIPLY';//乘号
+exports.DIVIDE = 'DIVIDE';
```

#### 5.5.3 tokenize.js

```diff
+let RegExpObject  = /([0-9]+)|(\+)|(\-)|(\*)|(\/)/g;
+let tokenNames = [tokenTypes.NUMBER,tokenTypes.PLUS,tokenTypes.MINUS,tokenTypes.MULTIPLY,tokenTypes.DIVIDE];
```

#### 5.5.4 nodeTypes.js

```diff
+exports.Minus = 'Minus';//加法运算
+exports.Multiplicative = 'Multiplicative';//乘法运算
+exports.Divide = 'Divide';//加法运算
```

#### 5.5.5 toAST.js

```diff
function additive(tokenReader){
     let child1 = multiple(tokenReader);   
     let node = child1;
     let token = tokenReader.peek();//看看一下符号是不是加号
     if(child1 != null && token != null){
+        if(token.type === tokenTypes.PLUS||token.type === tokenTypes.MINUS){//如果后面是加号的话
            token = tokenReader.read();//把+读出来并且消耗掉
            let child2 = additive(tokenReader);
            if(child2 != null){
+                node = new ASTNode(token.type === tokenTypes.PLUS?nodeTypes.Additive:nodeTypes.Minus);
                node.appendChild(child1);
                node.appendChild(child2);
            }
        }
     }
     return node;
}
//multiple -> NUMBER | NUMBER *  multiple
function multiple(tokenReader){
    let child1 = number(tokenReader);//先配置出来NUMBER,但是这个乘法规则并没有匹配结束
    let node = child1; //node=3
    let token = tokenReader.peek();//*
    if(child1 != null && token != null){
+       if(token.type === tokenTypes.MULTIPLY||token.type === tokenTypes.DIVIDE){
         token = tokenReader.read();//读取下一个token  *
         let child2 = multiple(tokenReader);//4
         if(child2 != null){
+            node = new ASTNode(token.type === tokenTypes.MULTIPLY?nodeTypes.Multiplicative:nodeTypes.Divide);
            node.appendChild(child1);
            node.appendChild(child2);
         }
       }
    }
    return node;
}
```

#### 5.5.6 evaluate.js

```diff
 switch(node.type){
    case nodeTypes.Program:
        for(let child of node.children){
            result = evaluate(child);//child  Additive
        }
        break;
    case nodeTypes.Additive://如果是一个加法节点的话,如何计算结果
        result = evaluate(node.children[0])+evaluate(node.children[1]);
        break;   
+    case nodeTypes.Minus://如果是一个加法节点的话,如何计算结果
+        result = evaluate(node.children[0]) - evaluate(node.children[1]);
+        break;     
    case nodeTypes.Multiplicative://如果是一个加法节点的话,如何计算结果
        result = evaluate(node.children[0]) * evaluate(node.children[1]);
        break;   
+    case nodeTypes.Divide://如果是一个加法节点的话,如何计算结果
+        result = evaluate(node.children[0]) / evaluate(node.children[1]);
+        break;        
    case nodeTypes.Numeric:
        result = parseFloat(node.value);
    default:
        break;        
  }  
```

### 5.6 支持括号

#### 5.6.1 index.js

```diff
+ let sourceCode = '(1+2)*3*(2+2)';
```

#### 5.6.2 tokenTypes.js

```diff
+ exports.LEFT_PARA = 'LEFT_PARA';
+ exports.RIGHT_PARA = 'RIGHT_PARA';
```

#### 5.6.3 tokenize.js

```diff
+let RegExpObject  = /([0-9]+)|(\+)|(\-)|(\*)|(\/)|(\()|(\))/g;
let tokenTypes = require('./tokenTypes');
+let tokenNames = [tokenTypes.NUMBER,tokenTypes.PLUS,tokenTypes.MINUS,tokenTypes.MULTIPLY,tokenTypes.DIVIDE,tokenTypes.LEFT_PARA,tokenTypes.RIGHT_PARA];
```

#### 5.6.4 toAST.js

```diff
additive -> multiple|multiple + additive
multiple -> primary | primary *  multiple
primary -> NUMBER | (add)

function multiple(tokenReader){
+    let child1 = primary(tokenReader);//先配置出来NUMBER,但是这个乘法规则并没有匹配结束
    let node = child1; //node=3
    let token = tokenReader.peek();//*
    if(child1 != null && token != null){
       if(token.type === tokenTypes.MULTIPLY||token.type === tokenTypes.DIVIDE){
         token = tokenReader.read();//读取下一个token  *
         let child2 = multiple(tokenReader);//4
         if(child2 != null){
            node = new ASTNode(token.type === tokenTypes.MULTIPLY?nodeTypes.Multiplicative:nodeTypes.Divide);
            node.appendChild(child1);
            node.appendChild(child2);
         }
       }
    }
    return node;
}
+function primary(tokenReader){ //(1+2)*3
+  let node = number(tokenReader);
+  if(!node){
+    let token = tokenReader.peek();
+    if(token != null && token.type === tokenTypes.LEFT_PARA){
+      tokenReader.read();
+      node  = additive(tokenReader);
+      tokenReader.read();
+    }
+  }
+  return node;
+}
```

### 5.7 二元表达式

#### 5.7.1 优先级（Priority）

- 不同的运算符之间是有优先级的
- 加减的优先级一样,乘除的优先级一样

```js
2+3*4
```

#### 5.7.2 结合性（Associativity）

- 同样优先级的运算符是从左到右计算还是从右到左计算叫做结合性
- 加减乘除等算术运算是左结合的，`.`符号也是左结合的。
- 结合性是跟左递归还是右递归有关的，左递归导致左结合，右递归导致右结合

```js
4+3-2-2
8/2/2
```

#### 5.7.3 文法规则

- 优先级是通过在语法推导中的层次来决定的，优先级越低的，越先尝试推导
- 通过文法的嵌套，实现对运算优先级的支持

```js
additive : multiple|additive+multiple
multiple : NUMBER|multiple*NUMBER
```

![twoplustheemultiplyfour.jpg](https://img.zhufengpeixun.com/twoplustheemultiplyfour.jpg)

![twoplustheeplusfour](https://img.zhufengpeixun.com/twoplustheeplusfour)

#### 5.7.3 左递归（Left Recursive）

- 在二元表达式的语法规则中，如果产生式的第一个元素是它自身，那么程序就会无限地递归下去，这种情况就叫做左递归
- 巴科斯范式 以美国人巴科斯和丹麦人诺尔的名字命名的一种形式化的语法表示方法，用来描述语法的一种形式体系

```js
function add(){
    add();
    multiply();
}
```

#### 5.7.4 消除左递归

- 这样可以消除左递归,但是会带来结合性的问题

```js
additive : multiple|multiple+additive
multiple : NUMBER|NUMBER*multiple
```

![twoplustheeplusfour2.jpg](https://img.zhufengpeixun.com/twoplustheeplusfour2.jpg)

#### 5.7.5 循环消除左递归

- 扩展巴科斯范式 (EBNF)会用到类似`正则表达式`的一些写法
- 可以把递归改成`循环`

```js
additive -> multiple (+ multiple)*
multiple -> NUMBER (* NUMBER)*
```

#### 5.7.6 实现

toAST.js

```diff
const ASTNode = require('./ASTNode');
let nodeTypes = require('./nodeTypes');
let tokenTypes = require('./tokenTypes');
/**
4+3-2-2
+additive -> multiple|multiple [+-] additive   包括+-
+multiple -> primary|primary [星/] multiple    包括星/
+primary -> NUMBER | (additive) 基础规则
*/
function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program);
  //开始推导了 加法 乘法 先推导加法
  //实现的时候,每一个规则都是一个函数additive对应加法规则
  let child = additive(tokenReader);
  if (child)
    rootNode.appendChild(child);
  return rootNode;
}
//additive -> multiple|multiple [+-] additive
function additive(tokenReader) {
+  let child1 = multiple(tokenReader);
+  let node = child1;
+  if (child1 != null) {
+    while (true) {
+      let token = tokenReader.peek();//看看一下符号是不是加号
+      if (token != null && (token.type === tokenTypes.PLUS || token.type === tokenTypes.MINUS)) {
+        token = tokenReader.read();//把+-读出来并且消耗掉
+        let child2 = multiple(tokenReader);
+        node = new ASTNode(token.type === tokenTypes.PLUS ? nodeTypes.Additive : nodeTypes.Minus);
+        node.appendChild(child1);
+        node.appendChild(child2);
+        child1 = node;
+      } else {
+        break;
+      }
+    }
+  }
  return node;
}
//multiple -> primary|primary [星/] multiple
function multiple(tokenReader) {
+  let child1 = primary(tokenReader);//先配置出来NUMBER,但是这个乘法规则并没有匹配结束
+  let node = child1; //node=3
+  if (child1 != null) {
+    while (true) {
+      let token = tokenReader.peek();//*/
+      if (token != null && (token.type === tokenTypes.MULTIPLY || token.type === tokenTypes.DIVIDE)) {
+        token = tokenReader.read();//把*/读出来并且消耗掉
+        let child2 = primary(tokenReader);
+        node = new ASTNode(token.type === tokenTypes.MULTIPLY ? nodeTypes.Multiplicative : nodeTypes.Divide);
+        node.appendChild(child1);
+        node.appendChild(child2);
+        child1 = node;
+      } else {
+        break;
+      }
+    }
+  }
  return node;
}
//primary -> NUMBER | (additive) 基础规则
function primary(tokenReader) {
  let node = number(tokenReader);
  if (!node) {
    let token = tokenReader.peek();
    if (token != null && token.type === tokenTypes.LEFT_PARA) {
      tokenReader.read();
      node = additive(tokenReader);
      tokenReader.read();
    }
  }
  return node;
}
function number(tokenReader) {
  let node = null;
  let token = tokenReader.peek();//看看当前的这个token
  //如果能取出 token,并且token的类型是数字的话 匹配上了
  if (token != null && token.type === tokenTypes.NUMBER) {
    token = tokenReader.read();//读取并消耗掉这个Token
    //创建一个新的语法树节点,类型是Numeric,值是2
    node = new ASTNode(nodeTypes.Numeric, token.value);
  }
  return node;
}

module.exports = toAST;
```

## 6. 语法分析器

- 语法分析器接受 token 数组，然后把它转化为 `AST`

### 6.1 nodeTypes.js

src\nodeTypes.js

```js
exports.Program = 'Program';
exports.ExpressionStatement = 'ExpressionStatement';
//JSX元素
exports.JSXElement = 'JSXElement';
//开始标签
exports.JSXOpeningElement = 'JSXOpeningElement';
//属性
exports.JSXAttribute = 'JSXAttribute';
//标签名
exports.JSXIdentifier = 'JSXIdentifier';
//元素属性
exports.AttributeKey='AttributeKey';
//结束标签
exports.JSXClosingElement='JSXClosingElement';
//字符串字面量
exports.StringLiteral = 'StringLiteral';
//JSX文本
exports.JSXText = 'JSXText';

exports.MemberExpression = 'MemberExpression';
exports.ObjectExpression = 'ObjectExpression';
exports.ObjectProperty = 'ObjectProperty';
exports.CallExpression = 'CallExpression';
exports.Identifier = 'Identifier';
exports.NumberLiteral = 'NumberLiteral';
exports.StringLiteral = 'StringLiteral';
exports.NullLiteral = 'NullLiteral';
```

### 6.2 parser.js

src\parser.js

```js
const { tokenizer } = require('./tokenizer');
const tokenTypes = require('./tokenTypes');
const nodeTypes = require('./nodeTypes');
function parser(code) {
    let tokens = tokenizer(code);
    let current = 0;
    function walk(parent) {
        let token = tokens[current]; //当前token
        let next = tokens[current + 1]; 
        // 下一个单词，因为这里需要预判一下当前<是属于开始的括号还是闭合的括号
        // 这个是处理开始标签
        if (token.type === tokenTypes.LeftParentheses && next.type === tokenTypes.JSXIdentifier) {
            let node = {
                type: nodeTypes.JSXElement,
                openingElement: null,
                closingElement: null,
                children: []
            }
            token = tokens[++current]; // 标签
            node.openingElement = {
                type: nodeTypes.JSXOpeningElement,
                name: {
                    type: nodeTypes.JSXIdentifier,
                    name: token.value
                },
                attributes: []
            }

            token = tokens[++current]; // 取下一个标签
            //获取所有的属性
            while (token.type === tokenTypes.AttributeKey) {
                node.openingElement.attributes.push(walk());
                token = tokens[current];
            }
            token = tokens[++current]; // 跳过>,token=<
            next = tokens[current+1]; // 下一个token span
            // 根据结束标签的标签名一致，中间的内容都是孩子节点
            while (
                token.type !== tokenTypes.LeftParentheses //字面量子节点
                ||( token.type === tokenTypes.LeftParentheses 
                    && next.type !== tokenTypes.BackSlash)) { // walk所有孩子
                node.children.push(walk());
                token = tokens[current];
                next = tokens[current+1]; // 下一个token
            }
            node.closingElement = walk(node); // walk闭合标签
            return node;
        } 
        //处理结束标签
        else if(parent && token.type === tokenTypes.LeftParentheses && next.type === tokenTypes.BackSlash){
            current++; // 跳过<单词
            token = tokens[++current]; // 闭合标签，跳过反斜杠
            current++; // 跳过标签
            current++; // 跳过>单词
            return parent.closingElement = {
                type: nodeTypes.JSXClosingElement,
                name: {
                    type: nodeTypes.JSXIdentifier,
                    name: token.value
                }
            }
        }//处理属性
        else if(token.type === tokenTypes.AttributeKey){
            let next = tokens[++current]; // attributeValue
            let node = {
                type: nodeTypes.JSXAttribute,
                name: {
                    type: nodeTypes.JSXIdentifier,
                    name: token.value
                },
                value: {
                    type: nodeTypes.StringLiteral,
                    value: next.value
                }
            }
            current++; // 跳过attributeValue
            return node;
        }//处理文本
        else if(token.type === tokenTypes.JSXText){
            current++; // 跳过>
            return {
                type: nodeTypes.JSXText,
                value: token.value
            }
        }
        throw new TypeError(token.type);
    }
    var ast = {
        type: nodeTypes.Program,
        body: [
            {
                type: nodeTypes.ExpressionStatement,
                expression: walk()
            }
        ]
    };
    return ast;
}

module.exports = {
    parser
}

/*
let code = '<h1 id="title"><span>hello</span>world</h1>';
console.log(JSON.stringify(parser(code), null, 2));
*/
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "JSXElement",
        "openingElement": {
          "type": "JSXOpeningElement",
          "name": {
            "type": "JSXIdentifier",
            "name": "h1"
          },
          "attributes": [
            {
              "name": {
                "type": "JSXIdentifier",
                "name": "id"
              },
              "value": {
                "type": "StringLiteral",
                "value": "title"
              }
            }
          ]
        },
        "closingElement": {
          "type": "JSXClosingElement",
          "name": {
            "type": "JSXIdentifier",
            "name": "h1"
          }
        },
        "children": [
          {
            "type": "JSXElement",
            "openingElement": {
              "type": "JSXOpeningElement",
              "name": {
                "type": "JSXIdentifier",
                "name": "span"
              },
              "attributes": []
            },
            "closingElement": {
              "type": "JSXClosingElement",
              "name": {
                "type": "JSXIdentifier",
                "name": "span"
              }
            },
            "children": [
              {
                "type": "JSXText",
                "value": "hello"
              }
            ]
          },
          {
            "type": "JSXText",
            "value": "world"
          }
        ]
      }
    }
  ]
}
```

## 7. 遍历语法树

src\traverse.js

```js
const { parser } = require('./parser');
const replace = (parent,oldNode,newNode)=>{
    if(parent){
        for (const key in parent) {
            if (parent.hasOwnProperty(key)) {
                if(parent[key] === oldNode){
                    parent[key] = newNode;
                }
            }
        }
    }
}
function traverse(ast, visitor) {
    function traverseArray(array, parent) {
        array.forEach(function (child) {
            traverseNode(child, parent);
        });
    }

    function traverseNode(node, parent) {
        let replaceWith  = replace.bind(node,parent,node);
        var method = visitor[node.type];
        if (method) {
            if (typeof method === 'function') {
                method({node,replaceWith}, parent)
            } else if (method.enter) {
                method.enter({node,replaceWith}, parent);
            }
        }
        switch (node.type) {
            case 'Program':
                traverseArray(node.body, node);
                break;
            case 'ExpressionStatement': // 表达式
                traverseNode(node.expression, node);
                break;
            // JSX标签的遍历
            case 'JSXElement': // JSX标签
                traverseNode(node.openingElement, node);
                traverseNode(node.closingElement, node);
                traverseArray(node.children, node);
                break;
            case 'JSXOpeningElement': // 开标签
                traverseNode(node.name, node); // 标签名
                traverseArray(node.attributes, node);
                break;
            case 'JSXAttribute': // 属性
                traverseNode(node.name, node); // 属性名
                traverseNode(node.value, node); // 属性值
                break;
            case 'JSXClosingElement': // 闭合标签
                traverseNode(node.name, node); // 标签名
                break;
            case 'JSXIdentifier': // 属性名
                break;
            case 'StringLiteral': // 字符串属性值，字符串参数
                break;
            case 'JSXText': // 文本
                break;
            // ============React.createElement的遍历================
            case 'CallExpression':
                traverseNode(node.callee, node); // 成员表达式
                traverseArray(node.arguments, node); // 参数列表
                break;
            case 'MemberExpression':
                traverseNode(node.object, node); // （成员）对象
                traverseNode(node.property, node); // （成员）对象属性
                break;
            case 'Identifier': // "变量"名
                break;
            case 'ObjectExpression': // 对象数组
                traverseArray(node.properties, node); // 对象
                break;
            case 'ObjectProperty': // 对象属性
                traverseNode(node.key, node); // 对象属性名
                traverseNode(node.value, node); // 对象属性值
                break;
            case 'NullLiteral':
                break;
            default:
                throw new TypeError(node.type);
        }
        if (method && method.exit) {
            method.exit({node,replaceWith}, parent);
        }
    }

    // 开始遍历ast
    traverseNode(ast, null);
}

module.exports = {
    traverse
};


/* let code = '<h1 id="title"><span>hello</span>world</h1>';
let ast = parser(code);
traverse(ast, {
    JSXOpeningElement: {
        enter: function (node, parent) {
            console.log('进入开标签', node);
        },
        exit: function (node, parent) {
            console.log('退出开标签', node);
        }
    }
}) */
```

## 8. 转换器

src\transformer.js

```js
const { traverse } = require('./traverse');
const { parser } = require('./parser');
const nodeTypes = require('./nodeTypes');
class t {
    static nullLiteral() {
        return {
            type: nodeTypes.NullLiteral
        }
    }

    static memberExpression(object, property) {
        return {
            type: nodeTypes.MemberExpression,
            object,
            property
        }
    }

    static identifier(name) {
        return {
            type: nodeTypes.Identifier,
            name
        }
    }

    static stringLiteral(value) {
        return {
            type: nodeTypes.StringLiteral,
            value
        }
    }

    static objectExpression(properties) {
        return {
            type: nodeTypes.ObjectExpression,
            properties
        }
    }

    static objectProperty(key, value) {
        return {
            type: nodeTypes.ObjectProperty,
            key,
            value
        }
    }

    static callExpression(callee, _arguments) {
        return {
            type: nodeTypes.CallExpression,
            callee,
            arguments: _arguments
        }
    }

    static isJSXText(node) {
        return node.type ===nodeTypes.JSXText
    }

    static isJSXElement(node) {
        return node.type === nodeTypes.JSXElement;
    }
}

function transformer(ast) {
    traverse(ast, {
        JSXElement(nodePath) {
            const transform = (node) => {debugger
                if (!node) return t.nullLiteral();
                // JSX 标签节点
                if (t.isJSXElement(node)) {
                    // React.createElement函数
                    let memberExpression = t.memberExpression(
                        t.identifier("React"),
                        t.identifier("createElement")
                    );
                    // 函数参数列表
                    let _arguments = [];
                    // 标签
                    let stringLiteral = t.stringLiteral(node.openingElement.name.name);
                    // 属性
                    let objectExpression = node.openingElement.attributes.length
                        ? t.objectExpression(
                            node.openingElement.attributes.map((attr) =>
                                t.objectProperty(t.identifier(attr.name.name), attr.value)
                            )
                        )
                        : t.nullLiteral();
                    _arguments = [stringLiteral, objectExpression];
                    // 递归处理子节点
                    _arguments.push(...node.children.map((item) => transform(item)));
                    return t.callExpression(memberExpression, _arguments);
                } else if (t.isJSXText(node)) {
                    // JSX 文本节点
                    return t.stringLiteral(node.value);
                }
            };
            let targetNode = transform(nodePath.node);
            nodePath.replaceWith(targetNode);
        },
    });
}

module.exports = {
    transformer
}


/* let code = '<h1 id="title"><span>hello</span>world</h1>';
let ast = parser(code);
transformer(ast);
console.log(JSON.stringify(ast, null, 2)); */
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": "React"
          },
          "property": {
            "type": "Identifier",
            "name": "createElement"
          }
        },
        "arguments": [
          {
            "type": "StringLiteral",
            "value": "h1"
          },
          {
            "type": "ObjectExpression",
            "properties": [
              {
                "type": "ObjectProperty",
                "key": {
                  "type": "Identifier",
                  "name": "id"
                },
                "value": {
                  "type": "StringLiteral",
                  "value": "title"
                }
              }
            ]
          },
          {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "object": {
                "type": "Identifier",
                "name": "React"
              },
              "property": {
                "type": "Identifier",
                "name": "createElement"
              }
            },
            "arguments": [
              {
                "type": "StringLiteral",
                "value": "span"
              },
              {
                "type": "NullLiteral"
              },
              {
                "type": "StringLiteral",
                "value": "hello"
              }
            ]
          },
          {
            "type": "StringLiteral",
            "value": "world"
          }
        ]
      }
    }
  ]
}
```

## 9. 生成器

- 先序遍历抽象语法树，将特定的节点类型转换成对应的js代码即可

src\codeGenerator.js

```js
const nodeTypes = require('./nodeTypes');
function codeGenerator(node) {
    switch (node.type) {
        case nodeTypes.Program:
            return node.body.map(codeGenerator).join('\n');
        case nodeTypes.ExpressionStatement:
            return (
                codeGenerator(node.expression) + ';'
            );

        case nodeTypes.MemberExpression:
            return (
                codeGenerator(node.object) +
                '.' +
                codeGenerator(node.property)
            )

        case nodeTypes.ObjectExpression:
            return (
                '{' +
                node.properties.map(codeGenerator).join(', ') +
                '}'
            )

        case nodeTypes.ObjectProperty:
            return (
                codeGenerator(node.key) +
                ':' +
                codeGenerator(node.value)
            )

        case nodeTypes.CallExpression:
            return (
                codeGenerator(node.callee) +
                '(' +
                node.arguments.map(codeGenerator).join(', ') +
                ')'
            );

        case nodeTypes.Identifier:
            return node.name;

        case nodeTypes.NumberLiteral:
            return node.value;

        case nodeTypes.StringLiteral:
            return '"' + node.value + '"';

        case nodeTypes.NullLiteral:
            return 'null'

        default:
            throw new TypeError(node.type);
    }
}

module.exports = {
    codeGenerator
}
```

src\index.js

```js
const { parser } = require('./parser');
const { transformer } = require('./transformer');
const { codeGenerator } = require('./codeGenerator');
let code = '<h1 id="title"><span>hello</span>world</h1>';
let ast = parser(code);
transformer(ast);
console.log(JSON.stringify(ast, null, 2)); 
let result = codeGenerator(ast);
console.log(result);
```



