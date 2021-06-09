---
title: 基本使用
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## 什么是vue?

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。
特点: 易用，灵活，高效 渐进式框架

![img](https://www.fullstackjavascript.cn/vue.png)

逐一递增 vue + components + vue-router + vuex + vue-cli

## 什么是库，什么是框架?

- 库是将代码集合成一个产品,库是我们调用库中的方法实现自己的功能。
- 框架则是为解决一类问题而开发的产品,框架是我们在指定的位置编写好代码，框架帮我们调用。

框架是库的升级版

## 初始使用

```
new Vue({
    el:'#app',
    template:'<div>我是姜文～～</div>', // 优先使用template
    data:{}
});
```

## mvc && mvvm

![img](https://www.fullstackjavascript.cn/mvc.png) ![img](https://www.fullstackjavascript.cn/mvvm.png)

在传统的mvc中除了model和view以外的逻辑都放在了controller中，导致controller逻辑复杂难以维护,在mvvm中view和model没有直接的关系，全部通过viewModel进行交互

## 声明式和命令式

- 自己写for循环就是命令式 (命令其按照自己的方式得到结果)
- 声明式就是利用数组的方法forEach (我们想要的是循环，内部帮我们去做)

## 模板语法 mustache

允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。在使用数据前需要先声明

- 编写三元表达式

- 获取返回值

- JavaScript 表达式

  ```
  <div id="app">
    {{ 1+1 }}
    {{ msg == 'hello'?'yes':'no' }}
    {{ {name:1} }}
  </div>
  <script src="./node_modules/vue/dist/vue.js"></script>
  <script>
    let vm = new Vue({
        el:'#app',
        data:{
            msg:'hello'
        }
    })
  </script>
  ```

## 观察数据变化

```
function notify(){
    console.log('视图更新')
}
let data = {
    name:'jw',
    age:18,
    arr:[]
}
// 重写数组的方法
let oldProtoMehtods = Array.prototype;
let proto = Object.create(oldProtoMehtods);
['push','pop','shift','unshift'].forEach(method=>{
    proto[method] = function(){
        notify();
        oldProtoMehtods[method].call(this,...arguments)
    }
})
function observer(obj){
    if(Array.isArray(obj)){
        obj.__proto__ = proto
        return;
    }
    if(typeof obj === 'object'){
        for(let key in obj){
            defineReactive(obj,key,obj[key]);
        }
    }
}
function defineReactive(obj,key,value){
    observer(value); // 再一次循环value
    Object.defineProperty(obj,key,{ // 不支持数组
        get(){
            return value;
        },
        set(val){
            notify();
            observer(val);
            value = val;
        }
    });
}
observer(data);
data.arr.push(1);
```

## 使用proxy实现响应式变化

```
let obj = {
    name:{name:'jw'},
    arr:['吃','喝','玩']
}
let handler = {
    get(target,key,receiver){
        if(typeof target[key] === 'object' &&  target[key] !== null){
            return new Proxy(target[key],handler);
        }
        return Reflect.get(target,key,receiver);
    },
    set(target,key,value,receiver){
        if(key === 'length') return true;
        console.log('update')
        return Reflect.set(target,key,value,receiver);
    }
}
let proxy = new Proxy(obj,handler);
proxy.name.name = 'zf';
```

## 响应式变化

- 数组的变异方法(不能通过通过长度，索引改变数组)

  ```
    <div id="app">
        {{hobbies}}
    </div>
    <script src="node_modules/vue/dist/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:{
                hobbies:['洗澡','吃饭','睡觉']
            }
        });
        vm.hobbies[0] = '喝水';// 数据变化视图不刷新
        vm.hobbies.length--;// 数据变化视图不会刷新
    </script>
  ```

  ```
    vm.hobbies = ['喝水']; // 替换的方式
    vm.hobbies.push('吃饭'); // push slice pop ...变异方法
  ```

- 不能给对象新增属性

  ```
    <div id="app">
    {{state.a}}
    </div>
    <script src="node_modules/vue/dist/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:{
                state:{count:0}
            }
        });
        //vm.state.a = 100; // 新增熟悉不会响应到视图上
    </script>
  ```

- 使用vm.$set方法强制添加响应式数据

  ```
    function $set(data,key,val){
    if(Array.isArray(data)){
        return data.splice(key,1,val);
    }
    defineReactive(data,key,val);
    }
    $set(data.arr,0,1);
  
    vm.$set(vm.state,'a','100');
  ```

## vue实例上常见属性和方法

- vm.$set();

  ```
    vm.$set(vm.state,'a','100');
  ```

- vm.$watch();

  ```
    vm.$watch('state.count',function(newValue,oldValue){
        console.log(newValue,oldValue);
    });
  ```

- vm.$mount();

  ```
    let vm = new Vue({
        data:{state:{count:0}}
    });
    vm.$mount('#app');
  ```

- vm.$nextTick();

  ```
    vm.state.count = 100; // 更高数据后会将更改的内容缓存起来
    // 在下一个事件循环tick中 刷新队列
    vm.$nextTick(function(){
        console.log(vm.$el.innerHTML);
    });
  ```

- vm.$data

- vm.$el

## vue中的指令

在vue中 指令 (Directives) 是带有 v- 前缀的特殊特性,主要的功能就是操作DOM

- v-once

  ```
    <div v-once>{{state.count}} </div>
  ```

- v-html （不要对用户输入使用v-html显示）

  ```
    <div v-html="text"></div>
  ```

  [https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML#%E5%AE%89%E5%85%A8%E9%97%AE%E9%A2%98](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML#安全问题)

- v-text

- v-if/v-else使用

## v-for使用

- v-for遍历数组

  ```
    fruits:['香蕉','苹果','桃子']
    <div v-for="(fruit,index) in fruits" :key="index">
        {{fruit}}
    </div>
  ```

- v-for遍历对象

  ```
    info:{name:'jiang',location:'回龙观',phone:18310349227}
    <div v-for="(item,key) in info" :key="key">
        {{item}} {{key}}
    </div>
  ```

- template的使用

  ```
    <template v-for="(item,key) in fruits">
        <p v-if="key%2">hello</p>
        <span v-else>world</span>
    </template>
  ```

- key属性的应用

  ```
    <div v-if="flag">
        <span>珠峰</span>
        <input key="2"/>   
    </div>
    <div v-else>
        <span>架构</span>
        <input key="1"/>  
    </div>
  ```

- key尽量不要使用索引

  ```
     <ul>
        <li key="0">🍌</li>
        <li key="1">🍎</li>
        <li key="2">🍊</l>
    </ul>
    <ul>
        <li key="0">🍊</li>
        <li key="1">🍎</li>
        <li key="2">🍌</li>
    </ul>
  ```

## 属性绑定 :（v-bind）

Class 与 Style 绑定

- 数组的绑定

  ```
        <div :class="['apple','banana']" ></div>
        <div :class="{banana:true}"></div>
  ```

- 对象类型的绑定

  ```
        <div :class="['apple','banana']" ></div>
        <div :class="{banana:true}"></div>
        <div :style="[{background:'red'},{color:'red'}]"></div>
        <div :style="{color:'red'}"></div>
  ```

## 绑定事件 @ （v-on）

- 事件的绑定 v-on绑定事件
- 事件修饰符 (.stop .prevent) .capture .self .once .passive

## vue的双向绑定 (v-model)

```
    <input type="text" :value="value" @input="input">
    <input type="text" v-model="value">
```

- input,textarea

- select

  ```
    <select v-model="select">
        <option 
            v-for="fruit in fruits"
            :value="fruit">
                {{fruit}}
        </option>
    </select>
  ```

- radio

  ```
    <input type="radio" v-model="value"  value="男">
    <input type="radio" v-model="value"  value="女">
  ```

- checkbox

  ```
    <input type="checkbox" v-model="checks" value="游泳" >
    <input type="checkbox" v-model="checks" value="健身">
  ```

- 修饰符应用 .number .lazy .trim

  ```
    <input type="text" v-model.number="value">
    <input type="text" v-model.trim="value">
  ```

## 鼠标 键盘事件

- 按键、鼠标修饰符 Vue.config.keyCodes

  ```
  Vue.config.keyCodes = {
    'f1':112
  }
  ```

## watch & computed

- 计算属性和watch的区别 （异步）

  ```
    let vm = new Vue({
        el:'#app',
        data:{
            firstName:'姜',
            lastName:'文',
            fullName:''
        },
        mounted(){
            this.getFullName();
        },
        methods:{
            getFullName(){
                this.fullName = this.firstName + this.lastName
            }
        },
        watch:{
            firstName(){
                setTimeout(()=>{
                    this.getFullName();
                },1000)
            },
            lastName(){
                    this.getFullName();
            }
        }
        // 计算属性不支持异步
        // computed:{
        //    fullName(){
        //        return this.firstName + this.lastName;
        //    }
        // }
    });
  ```

- 计算属性和 method的区别 （缓存）

## 条件渲染

- v-if和v-show区别
- v-if/v-else-if/v-else
- v-show

## 过滤器的应用 (过滤器中的this都是window)

- 全局过滤器 和 局部过滤器

- 编写一个过滤器

  ```
  <div>{{'hello' | capitalize(3)}}</div>
  Vue.filter('capitalize',(value,count=1)=>{
    return value.slice(0,count).toUpperCase() + value.slice(count);
  });
  ```

## 指令的编写

- 全局指令和 局部指令

- 编写一个自定义指令

  - 钩子函数bind，inserted，update

    ```
          <input type="text" v-focus.color="'red'">
          Vue.directive('focus',{
              inserted:(el,bindings)=>{
                  let color = bindings.modifiers.color;
                  if(color){
                      console.log('color')
                      el.style.boxShadow = `1px 1px 2px ${bindings.value}`
                  }   
                  el.focus();
              }
          });
    ```

- clickoutside指令

  ```
  <div v-click-outside="change">
    <input type="text"  @focus="flag=true" >
    <div v-show="flag">
        contenter
    </div>
  </div>
  let vm = new Vue({
    el:'#app',
    data:{
        flag:false
    },
    methods:{
        change(){
            this.flag = false
        }
    },
    directives:{
        'click-outside'(el,bindings,vnode){
            document.addEventListener('click',(e)=>{
                if(!el.contains(e.target,vnode)){
                    let eventName = bindings.expression;
                    vnode.context[eventName]()
                }
            })
        }
    }
  })
  ```

  ## vue中的生命周期

- beforeCreate 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。

- created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el

- beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。

- mounted el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。

- beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。

- updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

- beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。

- destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。

## 钩子函数中该做的事情

- created 实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。
- mounted 实例已经挂载完成，可以进行一些DOM操作
- beforeUpdate 可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
- updated 可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用。
- destroyed 可以执行一些优化操作,清空定时器，解除绑定事件

![img](https://www.fullstackjavascript.cn/lifecycle.png)

## vue中的动画

vue中的动画就是从无到有或者从有到无产生的。有以下几个状态 transition组件的应用

```
.v-enter-active,.v-leave-active {
    transition: opacity 0.25s ease-out;
}
.v-enter, .v-leave-to {
    opacity: 0;
}
```

切换isShow的显示或者隐藏就显示出效果啦~

```
<button @click="toggle">toggle</button>
<transition>
    <span v-show="isShow">珠峰架构</span>
</transition>
```

> 默认的name是以v-开头，当然你可以自己指定name属性来修改前缀

## 使用animate.css设置动画

```
.v-enter-active {
    animation:zoomIn  2s linear
}
.v-leave-avitve{
    animation:zoomOut 2s linear
}
```

直接修改激活时的样式

```
<transition 
    enter-active-class="zoomIn"
    leave-active-class="zoomOut"
>
    <span class="animated" v-show="isShow">珠峰架构</span>
</transition>
```

## vue中js动画

```
<transition 
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
>   
    <span class="animated" v-show="isShow">珠峰架构</span>
</transition>
```

对应的钩子有before-leave,leave,after-leave钩子函数,函数的参数为当前元素

```
beforeEnter(el){
    el.style.color="red"
},
enter(el,done){
    setTimeout(()=>{
        el.style.color = 'green'
    },1000);
    setTimeout(() => {
        done();
    }, 2000);
},
afterEnter(el){
    el.style.color = 'blue';
}
```

## 使用js动画库

> https://github.com/julianshapiro/velocity

```
<script src="node_modules/velocity-animate/velocity.js"></script>
beforeEnter(el){
    el.style.opacity = 0;
},
enter(el,done){
    Velocity(el, {opacity: 1}, {duration: 2000, complete: done})
},
afterEnter(el){
    el.style.color = 'blue';
},
leave(el,done){
    Velocity(el, {opacity: 0}, {duration: 2000, complete: done})
}
```

## 筛选动画

```
<div id="app">
    <input type="text" v-model="filterData">
    <transition-group  
        enter-active-class="zoomInLeft" 
        leave-active-class="zoomOutRight"
    >
        <div v-for="(l,index) in computedData" :key="l.title" class="animated">
            {{l.title}}
        </div>
    </transition-group>  
</div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el:'#app',
        data:{
            filterData:'',
            dataList:[
                {title:'标题1'},
                {title:'标题2'},
                {title:'标题4'},
                {title:'标题3'}
            ]
        },
        computed:{
            computedData(){
                return this.dataList.filter((item)=>{
                    return item.title.includes(this.filterData);
                })
            }
        },
    })
</script>
```

{{



slot v-for i in 5



## 组件的声明

- 全局组件

  ```
  <my-button></my-button>  
  Vue.component('my-button',{
    template:'<button>点我啊</button>'
  })
  let vm = new Vue({
    el:'#app'
  })
  ```

- 局部组件

  ```
  <my-button></my-button>
  let vm = new Vue({
    el:'#app',
    components:{
        'MyButton':{
            template:'<button>按钮</button>'
        }
    }
  });
  ```

  HTML不支持自闭合的自定义元素，在DOM模板里永远不要使用自闭和组件,在HTML中也不支持MyButton的写法，所以组件调用全部使用短横线连接的方式！

https://www.w3.org/TR/html/syntax.html#void-elements

## 组件的数据

在组件中的数据必须是函数的形式

```
'MyButton':{
    data(){
        return {content:'按钮'}
    },
    template:'<button>{{content}}</button>'
}
```

## 组件的属性应用及校验

### 属性应用

```
<my-button button-content="按钮"></my-button>
components:{
    'MyButton':{
        props:['buttonContent'],
        template:'<button>{{buttonContent}}</button>'
    }
}
```

属性在组件标签上需要使用短横线命名法，在组件中声明需要采用驼峰命名法

### 属性校验

```
<my-button button-content="按钮" :number="'1'"></my-button>
components:{
    'MyButton':{
        props:{
            buttonContent:String,
            arr:{
                type:Array,
                default:()=>([])
            },
            number:{
                type:Number,
                validator:(value)=>{
                    return typeof value == 'number'
                }
            },

        },
        template:'<button>{{buttonContent}} {{arr}} {{number}}</button>'
    }
}
```

### 批量传入数据

```
<my-button v-bind="info"></my-button>
let vm = new Vue({
    el:'#app',
    data:{
        info:{name:'姜文',age:18}
    },
    components:{
        'MyButton':{
            props:['name','age'],
            inheritAttrs:false,
            mounted(){
                console.log(this.$attrs)
            },
            template:'<button>{{name}} {{age}} </button>'
        }
    }
});
```

## 事件应用

```
<!-- 给组件绑定方法，在内部触发绑定的方法 -->
<my-button @click="change" msg="按钮"></my-button>
let vm = new Vue({
    el:'#app',
    methods:{
        change(){ alert('hello'); }
    },
    components:{
        'MyButton':{
            props:['msg'],
            template:`<div>
                <button @click="this.$listeners.click">{{msg}}</button>
                <button v-on="this.$listeners">{{msg}}</button>
                <button @click="$emit('click')"></button>
            </div>`
        }
    }
});
```

在组件的根元素上直接监听一个原生事件

```
<my-button @click.native="change"></my-button>
```

## \$parent & \$child

实现收缩面板功能

```
<collapse>
    <collapse-item title="react">内容1</collapse-item>
    <collapse-item title="vue">内容2</collapse-item>
    <collapse-item title="node">内容3</collapse-item>
</collapse>  
Vue.component('Collapse',{
    methods:{
        open(id){
            this.$children.forEach(child => {
                if(child._uid != id){
                    child.show = false;
                }
            });
        }
    },
    template:`<div class="wrap">
        <slot></slot>
    </div>`
});
Vue.component('CollapseItem',{
    props:['title'],
    data(){
        return {show:true}
    },
    methods:{
        change(){
            this.$parent.open(this._uid);
            this.show =!this.show;
        }
    },  
    template:`<div class="collapse-item" @click="change">
        <div class="title">{{title}}</div>
        <div v-show="show">
            <slot></slot>    
        </div>
    </div>`
});
```

## v-slot应用

- v-slot:可以简写成#

  ```
  <List>
    <template v-slot:banana>🍌</template>
    <template v-slot:apple>🍎</template>
        🍊
  </List>  
  list:{
    template:`
        <ul>
            <li><slot></slot></li>
            <li><slot name="banner"></slot></li>    
            <li><slot name="apple"></slot></li>   
        </ul>
    `
  }
  ```

- 作用域插槽

  ```
  <List #default="{val}">
    {{val}}
  </List> 
  list:{
    data(){
        return {arr:[1,2,3]}
    },
    template:`
        <ul>
            <li v-for="a in arr" :key="a">
                <slot :val="a">{{a}}</slot>
            </li>
        </ul>
    `
  }
  ```

## Provide & inject

跨组件数据传递，主要为高阶插件/组件库提供用例

```
provide:{ name:'zf' },
components:{
    list:{
        inject:['name'],
        template:`<div>{{name}}</div>`
    }
}
```

## 父子组件数据同步

.sync 和 v-model的使用

```
<div id="app">
        {{msg}}
        <tab :msg="msg" @update:msg="change"></tab>
        <tab :msg.sync="msg"></tab>
        <tab v-model="msg"></tab>
</div>


let vm = new Vue({
    el:'#app',
    data:{
        msg:'hello'
    },
    methods:{
        change(value){
            this.msg = value
        }
    },
    components:{
        tab:{
            props:['msg'],
            methods:{
                change(){
                    this.$emit('update:msg','world')
                    this.$emit('input','world');
                }
            },
            template:`<div>
                {{msg}} <button @click="change">切换</button>
            </div>`
        }
    }
})
```

## ref 特性

- 放在dom上表示获取当前dom元素,放到组件上表示获取当前组件实例,在v-for中获取的是集合

```
// 在组件中可以获取组件实例
<tab :msg="msg" @update:msg="change" ref="ele"></tab>
this.$refs.ele.change()

// 放在dom上表示获取当前dom元素
<div ref="ele"></div>
this.$refs.ele.style.border="1px solid red"

// 在v-for中获取的是集合
<template v-for="a in 3">
    <tab :msg="msg" @update:msg="change" ref="ele" :key="a"></tab>
</template>
console.log(this.$refs.ele.length)
```

### 组件间通信

- 1) props和$emit 父组件向子组件传递数据是通过prop传递的，子组件传递数据给父组件是通过$emit触发事件来做到的
- 2) $attrs和$listeners A->B->C。Vue 2.4 开始提供了$attrs和$listeners来解决这个问题
- 3) $parent,$children 智能组件木偶组件
- 4) $refs 获取实例
- 5) 父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量。
- 6) envetBus 平级组件数据传递 这种情况下可以使用中央事件总线的方式
- 7) vuex状态管理

## 异步组件

```
Vue.component('async', function (resolve, reject) {
    setTimeout(function () {
        resolve({
            template: '<div>异步组件</div>'
        })
    }, 1000);
});
```

在后期我们一般配合webpack的import语法使用

## 递归组件

- name属性 (后期实现菜单组件)



## Message组件的调用方式

```
<template>
    <button @click="showMessage">点我啊</button>
</template>
<script>
export default {
    methods:{
        showMessage(){
            Message.info({ // 直接调用
                content:'hello 我帅不帅',
                duration:3000
            });
            this.$message.info({ // 通过实例调用
                content:'hello 你很帅',
                duration:3000
            })
        }
    }
}
</script>
```

## 编写Message组件

要考虑数据驱动视图，多次点击显示多个弹层,给每个层增加 id号,延迟时间和内容

```
<template>
    <div class="messages">
        <!-- 显示在数组中的层 -->
        <div v-for="message in messages" :key="message.id">
            {{message.content}}
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {messages:[]}
    },
    mounted(){
        // 给所有弹层增加唯一标示 方便弹层的卸载
        this.id = 0;
    },
    methods:{
        add(option){
            let id = this.id++; // id号
            let layer = {...option,id}
            this.messages.push(layer); // 将层存储起来
            layer.timer = setTimeout(()=>{
                this.remove(layer);
            },option.duration)
        },
        remove(layer){
            clearTimeout(layer.timer); // 清除定时器
            // 移除层 
            this.messages = this.messages.filter(message=>layer.id !== message.id);
        }
    }
}   
</script>
```

## 通过js文件控制显示Message弹层

- 步骤一:暴露调用方法

  ```
  // 暴露 不同类型的弹层方法
  const Message = {
    info(options){
        // 调用增加弹层方法
        getInstance(options).add(options);
    },
    warn(){},
    danger(){},
    success(){}
  }
  export {
    Message
  }
  ```

- 步骤二:生产实例

```
import Vue from 'vue';
import MessageComponent from './Message.vue';
let getInstance = () =>{
    let vm = new Vue({
        render:h=>h(MessageComponent)
    }).$mount();
    let messageComponent = vm.$children[0];
    // 获取真实dom元素，将其挂在页面上
    document.body.appendChild(vm.$el);
    return {
        add(options){ // 调用组件的add方法
            messageComponent.add(options);
        }
    }
}
const Message = {
    info(options){
        // 调用增加弹层方法
        getInstance().add(options);
    },
    warn(){},
    danger(){},
    success(){}
}
// 暴露 不同类型的弹层方法
export {
    Message
}
```

- 步骤三: 实现单例

```
let instance;
let inst = () => {
    instance = instance || getInstance();
    return instance;
}
const Message = {
    info(options){
        // 调用增加弹层方法
        inst().add(options);
    },
    warn(){},
    danger(){},
    success(){}
}
// 暴露 不同类型的弹层方法
export {
    Message
}
```

## 封装插件

install方法和use方法的应用

```
let _Vue;
export default {
    install(Vue,options){
        if(!_Vue){
            _Vue = Vue;
            let $message = {}
            Object.keys(Message).forEach(type => {
                $message[type] = Message[type]
            });
            Vue.prototype.$message = $message
        }
    }
}
// 组件中使用插件
import {Message} from './components/Message';
this.$message.info({
        content:'hello 你很帅',
        duration:3000
})
```

## Minx方法可以注入数据

给每个组件增加公用属性

```
Vue.mixin({
    beforeCreate() {
        if(this.$options.info){
            // 把数据挂在自己的_info上
            this._info = this.$options.info;
        }else{
            this._info = this.$parent && this.$parent._info;
        }
    },
})
```

## 实现表单组件

- 组件结构目录

  ```
  ├── App.vue
  ├── components
  │   ├── Form.vue
  │   ├── FormItem.vue
  │   └── Input.vue
  └── package.json
  ```

## 表单组件的使用

- Form 提供组件的数据
- FormItem 实现表单校验功能
- Input 输入内容时让FormItem发生校验

## 使用组件的方式

```
<template>
    <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" ></el-input>
        </el-form-item>
        <el-form-item>
        <el-form-item>
            <button>确认提交</button>
        </el-form-item>
    </el-form>
</template>
<script>
import Form from './components/Form';
import FormItem from './components/FormItem';
import Input from './components/Input.vue';
export default {
    components:{
        'el-form':Form,
        'el-form-item':FormItem,
        'el-input':Input
    },
    data(){
        return {
            form:{
                username:'',
                password:''
            },
            rules:{
                username:[
                    {required:true,message:'请输入用户名'}
                ],
                password:[
                    {required:true,message:'请输入密码'}
                ]
            }
        }
    }
}
</script>
```

## Form组件的基本结构

```
<template>
    <form onsubmit="return false">
        <slot></slot>
    </form>
</template>
<script>
export default {
    props:{
        model:{
            type:Object
        },
        rules:{
            type:Object
        }
    }
}
</script>
```

## FormItem组件结构

```
<template>
    <div>
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <div>校验文字</div>
    </div>
</template>
<script>
export default {
    props:{
        label:String,
        prop:String
    }
}
</script>
```

## Input组件结构

```
<template>
    <input type="text" :value="inputValue">
</template>
<script>
export default {
    props:{
        value:String
    },
    data(){
        return {inputValue:this.value}
    }
}
</script>
```

## 实现组件间的数据传递

- 为了在formItem中可以拿到form组件中的数据

  ```
  provide(){
    return {
        form:this
    }
  },
  ```

我们在form组件中直接将当前实例暴露出去

- 为了能实现input组件和formItem间的通信

  ```
  import Vue from 'vue';
  Vue.prototype.$bus = new Vue();
  export default {
    props:{
        label:String,
        prop:String
    },
    mounted(){
        this.$bus.$on('input',(value)=>{
            console.log(value)
        });
    }
  }
  ```

我们在formItem组件中，通过eventsBus订阅input事件

- 在input组件中监听输入事件进行数据的发射

  ```
  <input type="text" :value="inputValue" @input="handleInput">
  handleInput(e){
    // 更新数据
    this.inputValue = e.target.value;
    this.$bus.$emit('input',{
        id:this.$parent && this.$parent._uid,// 为了标识是哪个输入框
        value:this.inputValue
    }); // 发射输入事件
  }
  ```

- 在formItem中进行数据校验

  ```
  <template>
    <div>
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <!-- 有错误 显示错误提示信息 -->
        <div v-if="validateStatus === 'error'">
            {{validateContent}}
        </div>
    </div>
  </template>
  <script>
  import Vue from 'vue';
  Vue.prototype.$bus = new Vue();
  export default {
    props:{
        label:String,
        prop:String
    },
    inject:['form'], // 注入父级的实例
    data(){ 
        return {
            validateStatus:'', // 当前表单是否通过校验
            validateContent:'' // 当前校验后的信息
        }
    },  
    methods:{
        validate(value){
           let rules = this.form.rules[this.prop]; // 获取当前对应的规则
           rules.forEach(rule=>{
               // 如果必填 并且没有值，那就出错
               if(rule.required && !value){
                   this.validateStatus = 'error';
                   this.validateContent = rule.message
               }else{
                   this.validateStatus = '';
                   this.validateContent = '';
               }
           })
        }
    },
    mounted(){
        this.$bus.$on('input',(data)=>{
           if(this._uid === data.id){ // 说明更改的是当前自己的输入框
                this.validate(data.value);
           }
        });
    }
  }
  </script>
  ```

到目前为止基本的校验功能已经实现啦

## 当点击按钮时校验当前表单是否验证成功

```
<el-form :model="form" :rules="rules" ref="form">
<button @click="validate">确认提交</button>
validate(){ // form组件中校验是通过
    this.$refs.form.validate((valid)=>{
        if(valid){
            alert('校验通过')
        }else{
            alert('校验不通过')
        }
    });
}

// 在form组件中检查所有的formItem是否全部通过校验
validate(cb){
    cb(this.$children.every(child=>child.validateStatus!='error'))
}
```

# 基于elelemnt-ui二次封装tree组件

## 实现树菜单接口

数据分成两部分返回，文件夹列表以及文件列表,因为二者有包含关系，需要前端根据返回的数据渲染成树形结构数据。

- 安装express

  ```
  npm init -y
  npm install express
  ```

- parent数据代表文件夹数据，child的数据代表文件

  ```
  let express = require('express');
  let app = express();
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.method === 'OPTIONS'){
        return res.send();
    }
    next();
  });
  app.get('/getTreeList',function(req,res){
    res.json({
        code:0,
        parent:[
                {name:'文件夹1',pid:0,id:1},
                {name:'文件夹2',pid:0,id:2},
                {name:'文件夹3',pid:0,id:3},
                {name:'文件夹1-1',pid:1,id:4},
                {name:'文件夹2-1',pid:2,id:5},
        ],
        child:[
                {name:'文件1',pid:1,id:10001},
                {name:'文件2',pid:1,id:10002},
                {name:'文件2-1',pid:2,id:10003},
                {name:'文件2-2',pid:2,id:10004},
                {name:'文件1-1-1',pid:4,id:10005},
                {name:'文件2-1-1',pid:5,id:10006}
        ]
    });
  });
  app.listen(3000);
  ```

## 引入element-ui

```
import Vue from 'vue';
// 引入组件库行
import ElementUI from 'element-ui';
// 引入组件库样式
import 'element-ui/lib/theme-chalk/index.css';
// 引入App根组件
import App from './App.vue';
// 使用插件
Vue.use(ElementUI);
export default new Vue({
    el:'#app',
    render:h=>h(App)
});
```

## 通过axios调取接口

创建api.js 到出获取列表方法

```
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
export const getTreeList = async () =>{
    return axios.get('/getTreeList');
}
```

## 在组件中获取数据

对elememnt-ui树组件进行二次封装，封装TreeComponent组件

```
<template>
    <div>
        <TreeComponent :data="treeList"></TreeComponent>
    </div>
</template>
<script>
import {getTreeList} from './api.js';
import TreeComponent from './TreeComponent.vue';
export default {
    data(){
        return {
            treeList:[]
        }
    },
    async mounted(){
        let {data} = await getTreeList();
        // 增加标示 如果是文件夹 增加type标示
        let parent = data.parent.map(item=>(item.type="child",item));
        this.treeList = [...parent,...data.child];
    },
    components:{
        TreeComponent
    }
}
</script>
```

## 格式化数据-转化树列表

处理数据时不能对父组件传递的数据直接更改，所以操作前需要进行数据的拷贝

- 安装lodash

  ```
  npm install lodash
  ```

```
<template>
    <el-tree 
        :data="treeList">
    </el-tree>
</template>
<script>
import _ from 'lodash'
export default {
    props:{
        // 树的信息列表
        data:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return {
            treeList:[] // 格式化后的树的数据结构
        }
    },
    methods: {
        processData(){
            // 如果没有数据不进行任何处理
            if(this.data.length != 0){
                // 创造一个id的映射表，通过映射表创造关系,多数据操作时不要直接修改原数据
                let cloneList = _.cloneDeep(this.data);
                let mapList = cloneList.reduce((memo,current)=>{
                    memo[current['id']] = current;
                    return memo;
                },{}); 
                // 去列表中找 进行分类,最后返回数组结构
                this.treeList = cloneList.reduce((result,current)=>{
                    current.label = current.name;// 树的结构必须要有label属性
                    let parent = mapList[current.pid]; // 拿到当前项的父id去列表中查找，如果找到说明是儿子，就将它放到父亲的children属性中
                    if(parent){
                        parent.children? parent.children.push(current): parent.children = [current];
                    }else if(current.pid === 0){ // 说明这个是根把根放进到result中  
                        result.push(current);
                    }
                    return result
                },[]);
            }
        }
    },
    watch: {
        data:{
            handler(){ // 监控data的变化，如果数据有更新重新处理数据
                this.processData(); 
            },
            immediate:true // 默认上来就调用一次
        }
    },
}
</script>
```

## 自定义tree组件

文件夹添加文件夹标识，文件添加文件标识

通过render函数扩展树组件

```
<el-tree 
    :data="treeList"
    :render-content="renderFn"
    :expand-on-click-node="false"
    default-expand-all
>
</el-tree>
isParent(type){
    return type === 'parent';
},
renderFn(h, { node, data, store }){
    let parent = this.isParent(data.type);
    return (<div>
        {parent? 
            node.expanded?
                <i class="el-icon-folder-opened icon"></i>:
                <i class="el-icon-folder icon"></i>:
        <i class="el-icon-document icon"></i>}
        {data.label}
    </div>)
},
```

## 扩展操作列表

列表数据应该从外部传入，对文件夹和文件实现不同的操作

```
<TreeComponent 
    :data="treeList"
    :rootList="rootList"
    :childList="childList"
></TreeComponent>
rootList:[
    {name:'rename',text:'修改文件夹名字'},
    {name:'delete',text:'删除文件夹'}
],
childList:[
    {name:'rename',text:'修改文件名字'},
    {name:'delete',text:'删除文件'}
]
```

实现下拉菜单

```
let list = parent? this.rootList:this.childList;
<el-dropdown 
    placement="bottom-start" 
    trigger="click"
    on-command={this.handleCommand}
>
    <i class="el-icon-arrow-down el-icon--right"></i>
    <el-dropdown-menu slot="dropdown">
        {list.map(item=>(
            <el-dropdown-item command={item.name}>{item.text}</el-dropdown-item>
        ))}
    </el-dropdown-menu>
</el-dropdown>
handleCommand(name){
    if(name === 'rename'){
        // 修改文件名
    }else{
        // 删除文件
    }
}
```

## 点击修改切换输入框

```
if(name === 'rename'){
    this.currentId = data.id;
    this.currentContent = data.label;
}
{this.currentId === data.id?
    <span>
        <el-input 
            value={this.currentContent}
            on-input={this.handleChange}
        ></el-input>
        <el-button type="text">
            <i class="el-icon-close"></i>
        </el-button>
        <el-button type="text">
            <i class="el-icon-check"></i>
        </el-button>
    </span>
    :data.label
}
```

## 确认修改

使用.sync 同步修改后的数据

```
<el-button type="text" on-click={this.check.bind(this,data)}>
    <i class="el-icon-check"></i>
</el-button>

check(data){
    let list = _.cloneDeep(this.data);
    list = list.map(item=>{
        if(item.id === data.id){
            item.name = this.currentContent;
        }
        return item;
    });
    this.$emit('update:data',list);
    this.currentId = '';
}
```

## 取消修改

```
<el-button type="text" on-click={this.close}>
    <i class="el-icon-close"></i>
</el-button>
close(){
    this.currentId = '';
}
```

## 删除文件或文件夹

```
this.$confirm(`确认删除 ${data.type==='parent'?'文件夹':'文件'}吗`,"确认？",{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'  
}).then(()=>{
    this.handleDelete(data); // 删除文件
    this.$message({
        type:'success',
        message:'删除成功'
    })
}).catch(err=>{
    this.$message({
        type:'info',
        message:'已取消删除'
    })
});

handleDelete(data){
    let list = _.cloneDeep(this.data);
    list = list.filter(item=> item.id !== data.id);
    this.$emit('update:data',list);
    this.currentId = '';
}
```

## 调用接口删除文件

如果用户传递了delete方法，调用成功后在更新页面数据

```
<TreeComponent 
    :data.sync="treeList"
    :rootList="rootList"
    :childList="childList"
    :delete="deleteFn"
></TreeComponent>

this.delete && this.delete(data.id).then(()=>{
    this.handleDelete(data);
    this.$message({
        type:'success',
        message:'删除成功'
    })
})
```