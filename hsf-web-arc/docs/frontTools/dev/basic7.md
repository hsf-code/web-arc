---
title: JS 实现了识别网页验证码
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

很高兴大家喜欢！Github：**leonof/imgRecJs[1]**，刚刚上传，代码还需要完善～因为有不少同学表示训练和识别有疑问，我做了个小接口放在最后，可以方便大家先把流程走通。

后续会更新：将 js 代码等打包成 chrome 扩展程序，这样就可以让浏览器自动识别，完全傻瓜式使用啦～！（更新啦：**利用 chrome 扩展，让浏览器执行我们的脚本[2]**）

其实整篇文章难度不高，网上也有很多 java、c 等的代码。只是当时我写代码的时候，没有找到纯 js 可以用的代码和库，不能打包成 chrome 扩展，用起来还是不太方便的。所以在验证了思路的可行性后，我就大致写下来，给他人以方便吧。

目前有多种验证码识别思路，限于能力有限，我只好采用了最简单的机器学习。目标验证码也比较简单，如：

https://mmbiz.qpic.cn/mmbiz_png/tibUxowsg9P3BibicxxTyve2KaEd955pdYtKgibHlhHbeuv6RF0NknAp2hTqdhggc0dHp04gNC1u9AIngpvTozA7uQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

（含字母也一样）

https://mmbiz.qpic.cn/mmbiz_jpg/tibUxowsg9P3BibicxxTyve2KaEd955pdYt578bJOhwHAngwCK9TsrhHn0VicibY7ztEeE6iadiciac7NZDAyGicgqxHia7A/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

。识别控制速度在 0.1 秒以内的话，正确率在 99.99999%（因为一直是识别正确哈哈哈）。

在动手之前，先梳理一下大致思路，方便比较独立的同学自己尝试完成代码：

1、先分析网页 DOM 结构，载入验证码图片。

2、将图片画到 canvas 上，拿到图片的像素数据。

3、先后对图片进行二值化、腐蚀膨胀、切割、旋转、缩放处理。

4、记录处理后的单个数字的二值化数据，并人工录入真实数字。

5、重复训练。

6、识别时，用处理后的图像与库中数据对比，取得最相近的数据，得到真实数字。

（以下优化）

7、数据量大时，可以取前几个相似数据，并按权重从中选出最可能的数字，以提高准确度。

8、也可查找到相似度足够高时停止搜索，取其作为最后识别结果，以提升效率。

大神们可以直接去写了，我这低级简单的代码会遭你们嘲笑的。。。比较急于求成的同学也可以不用看了，回头直接拿 demo 去修改吧！

====================================================================

好吧既然你看到这里了，我就尽量说的清楚明白一点。

在动手之前，我简单模拟一下需要输入验证码的网站，效果如下：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

好吧，是真的简单…点击图片可以更换验证码，输入框用来输入，按钮模拟提交，如下：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

我们就假装他作为我们要自动识别的目标。

一、分析网页 DOM 结构，载入验证码图片。

我们可以看到，验证码的 url 是：img/0.jpg。我这里的 url 会变化，是为了模拟更换验证码的过程。但实际上，由于验证码绝大多数为后台生成的，所以地址是固定的。那么我们很容易就可以拿到图片数据：new 一个 Image，赋值 url 即可（直接 get 到 img 元素也行）。参考代码：

```
var img = document.getElementById("img");
```

二、将图片画到 canvas 上，拿到图片的像素数据。

要将图片画到 canvas 上，首先要创建一个 canvas 并初始化。参考代码：

```
var canvas1 = document.createElement("canvas");
document.getElementsByTagName("body")[0].appendChild(canvas1);
canvas1.style.backgroundColor = "cornsilk";
var ctx1 = canvas1.getContext("2d");
```

随后，将图片绘制上去。参考代码：

```
ctx1.drawImage(img,0,0,img.width,img.height);
```

然后我们就可以利用 canvas，拿到图片的像素数据。参考代码：

```
var imgData = ctx1.getImageData(0,0,WIDTH,HEIGHT);
```

三、先后对图片进行二值化、腐蚀膨胀、切割、旋转、缩放处理。

这部分是图像识别的重点，直接影响到识别准确率和速度。复杂的验证码还应加上去躁等处理过程。比如可以检测贯穿的横线并消除，或者将颜色高度统一的背景去掉等等。我们的图片几乎没有干扰，只有简单的旋转和缩放，故直接进行二值化操作（二值化也能去掉少量的干扰）。

1、二值化操作的思路是：计算图片的平均灰度作为阈值，比阈值大的置为纯黑，反之纯白。参考代码：

```
function toHex(fromImgData){//二值化图像
    var fromPixelData = fromImgData.data;
    var greyAve = 0;
    for(var j=0;j<WIDTH*HEIGHT;j++){
        var r = fromPixelData[4*j];
        var g = fromPixelData[4*j+1];
        var b = fromPixelData[4*j+2];
        greyAve += r*0.3 + g*0.59 + b*0.11;
    }
    greyAve /= WIDTH*HEIGHT;//计算平均灰度值。
    for(j=0;j<WIDTH*HEIGHT;j++){
        r = fromPixelData[4*j];
        g = fromPixelData[4*j+1];
        b = fromPixelData[4*j+2];
        var grey = r*0.333 + g*0.333 + b*0.333;//取平均值。
        grey = grey>greyAve?255:0;
        fromPixelData[4*j] = grey;
        fromPixelData[4*j+1] = grey;
        fromPixelData[4*j+2] = grey;
    }
    return fromImgData;
}//二值化图像
```

二值化后，效果如图：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

可以发现，简单的背景色是可以去掉的。

二值化处理之后，就可以将图片转换成数组（存 0 或 1）来保存了。参考代码如下：

```
function toXY(fromImgData){
    var result = new Array(HEIGHT);
    var fromPixelData = fromImgData.data;
    for(var j=0;j<HEIGHT;j++){
        result[j] = new Array(WIDTH);
        for(var k=0;k<WIDTH;k++){
            var r = fromPixelData[4*(j*WIDTH+k)];
            var g = fromPixelData[4*(j*WIDTH+k)+1];
            var b = fromPixelData[4*(j*WIDTH+k)+2];

            result[j][k] = (r+g+b)>500?0:1;//赋值0、1给内部数组
        }
    }
    return result;
}//图像转数组
```

2、接下来是腐蚀、膨胀。腐蚀的基本思路在于，将所有白色周围的像素都置成白色，以此来消除游离的个别黑色像素点噪声。膨胀正好相反，将黑色周围置成黑色，消除数字内部的个别白色。同时，腐蚀、膨胀的操作可以让图片更加平滑。参考代码：

```
function corrode(fromArray){
    for(var j=1;j<fromArray.length-1;j++){
        for(var k=1;k<fromArray[j].length-1;k++){
            if(fromArray[j][k]==1&&fromArray[j-1][k]+fromArray[j+1][k]+fromArray[j][k-1]+fromArray[j][k+1]==0){
                fromArray[j][k] = 0;
            }
        }
    }
    return fromArray;
}//腐蚀（简单）

function expand(fromArray){
    for(var j=1;j<fromArray.length-1;j++){
        for(var k=1;k<fromArray[j].length-1;k++){
            if(fromArray[j][k]==0&&fromArray[j-1][k]+fromArray[j+1][k]+fromArray[j][k-1]+fromArray[j][k+1]==4){
                fromArray[j][k] = 1;
            }
        }
    }
    return fromArray;
}//膨胀（简单）
```

由于我们的图片背景干扰不是很强烈，所以基本看不出差别。不过对于计算机来说，还是有不同的哟～尤其是背景复杂的图片，这一步很好用。

3、切割。

由于我们的图片内各数字没有粘连，所以切割时只需要从上至下，从左至右扫描图片，发现图片某一竖行均为白色，就切一刀。有粘连的验证码比较困难，暂时不讨论了。参考代码：

```
function split(fromArray,count){
    var numNow = 0;
    var status = false;
    var w = fromArray[0].length;
    for(var k=0;k<w;k++) {//遍历图像
        var sumUp = 0;
        for (var j=0;j<fromArray.length;j++)//检测整列是否有图像
            sumUp += fromArray[j][k];
        if(sumUp == 0){//切割
            for (j=0;j<fromArray.length-1;j++)
                fromArray[j].remove(k);
            w --;
            k --;
            status = false;
            continue;
        }
        else{//切换状态
            if(!status)
                numNow ++;
            status = true;
        }
        if(numNow!=count){//不是想要的数字
            for (j=0;j<fromArray.length-1;j++)
                fromArray[j].remove(k);
            w --;
            k --;
        }
    }
    return fromArray;
}//切割，获取特定数字
```

切割后，左右的空白因为都被切了，就没有了。但是上下仍然存在空白，所以进行处理。这里比较简单，就不放代码了，思路和切割类似，但简单很多。

4、旋转、缩放。

其实旋转不是必要的。没有旋转的步骤，可以用更多的数据量训练来弥补。同理，缩放也不是必须的。先大致讲一下思路：旋转和缩放都再次利用了 canvas，将图片画上去之后，利用 canvas 的方法操作图片旋转或缩放，之后再把数据拿下来，就像我们最开始读图片时做的一样。旋转时，取顺时针逆时针各 90 度，取左右宽度最窄的角度，当作数字站立的旋转角度。缩放时，直接按预设长宽画图即可。这里我就只写了缩放。处理后再转换回数组形式。参考代码：

```
function zoomToFit(fromArray){
    var imgD = fromXY(fromArray);
    var w = lastWidth;
    var h = lastHeight;
    var tempc1 = document.createElement("canvas");
    var tempc2 = document.createElement("canvas");
    tempc1.width = fromArray[0].length;
    tempc1.height = fromArray.length;
    tempc2.width = w;
    tempc2.height = h;
    var tempt1 = tempc1.getContext("2d");
    var tempt2 = tempc2.getContext("2d");
    tempt1.putImageData(imgD,0,0,0,0,tempc1.width,tempc1.height);
    tempt2.drawImage(tempc1,0,0,w,h);
    var returnImageD = tempt2.getImageData(0,0,WIDTH,HEIGHT);
    fromArray = toXY(returnImageD);
    fromArray.length = h;
    for(var i=0;i<h;i++)
        fromArray[i].length = w;
    return fromArray;
}//尺寸归一化
```

处理后效果如图：

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

四、记录处理后的单个数字的二值化数据，并人工录入真实数字。

到这里，图像处理就搞定了，后面的工作就比较简单了。我们把上一步得到的数组和真实的数字一起保存起来。这个过程可以有很多方法。我当时采取了大家一起录入的方式，所以搭建了 PHP+MySQL 的服务器，用数据库存储。这块就不详述了，大家各显神威。

五、重复训练

为了方便训练，我直接在页面里增加了手动输入的地方，提交后刷新验证码，继续提交。提交 20 个验证码（20*4=80 个数字）后，便经常可以正确识别出 4 位验证码，在单个数字的数据量在 300 左右时（大约需要 300/4=75 个验证码），识别效率已经在 95%以上。在 500 左右时已经基本见不到错误识别的情况了，这时候已经可以写代码实现自我训练了。此时识别一次大约需要 0.06 秒。

六、识别时，用处理后的图像与库中数据对比，取得最相近的数据，得到真实数字。

这块也比较简单。训练完成后，我将数据库数据导出，保存成了一个大的数组，直接用 js 就可以读了。识别时遍历所有的数据，按像素点逐一比较。由于尺寸做了归一化，所以直接数有多少像素匹配即可。匹配数量最多的即为识别出的结果。我只找到了最开始写的 PHP 代码，先放一下吧，有点懒得再写 js 了…：

```
function check($str)
{
    $str = str_split($str,1);
    $length = count($str);
    $tempNum = 0;
    $tempSimmiar = 0;
    $query = "SELECT * FROM numkeys";
    $sth = execSql($query);
    while ($RES = $sth->fetch()) {
        $thisSimmiar = 0;
        $thisFeature = str_split($RES["feature"],1);
        $thisNum = $RES["resultnum"];
        for($i=0;$i<$length;$i++){
            if($thisFeature[$i]==$str[$i]){
                $thisSimmiar ++;
            }
        }
        if($thisSimmiar>$tempSimmiar){
            $tempSimmiar = $thisSimmiar;
            $tempNum = $thisNum;
        }
    }
    return $tempNum;
}
```

七、优化部分

这块就大家自己看着来吧，因为我的图片不是很复杂，数据量也不是很大（千条级别），所以也没啥优化的必要，每次识别大约 0.1 秒吧。所以我只是没事干，做了之前大纲里写了那两个优化。其实我感觉主要的优化方向还是图像处理那块，尽量减少干扰，才能提高效率，也能检测更复杂的验证码。

PS：训练和识别的接口：

训练：POST 发送 username（用户名）、password（密码）、n1（第一个数组）、n2、n3

、n4、num（真实四位字符）至**http://www.leonszone.cn/test/yanzhengma/train.php[3]**。参考代码：

```
function sendData() {
    var str = prompt("请输入验证码:", "");
    if(!str)
        return false;
    postData = {//整合数据包
        username: 'pdgzfx',
        password: 'pdgzfx',
        nums: str,
        n1: numsArray[0],
        n2: numsArray[1],
        n3: numsArray[2],
        n4: numsArray[3]
    };
    $.ajax({
        url: '<http://www.leonszone.cn/test/yanzhengma/train.php>',
        type: 'POST',
        data: postData,
        success: function (data) {
            console.log(data);
            setTimeout(function () {
                location.reload();
            },1000);
        }
    });
}
```

识别：POST 发送 username（用户名）、password（密码）、n1（第一个数组）、n2、n3、n4 至 **http://www.leonszone.cn/test/yanzhengma/check.php[4]**。参考代码：

```
function getData() {
    postData = {//整合数据包
        username: 'pdgzfx',
        password: 'pdgzfx',
        nums: 'help!!!',
        n1: numsArray[0],
        n2: numsArray[1],
        n3: numsArray[2],
        n4: numsArray[3]
    };
    $.ajax({
        url: '<http://www.leonszone.cn/test/yanzhengma/check.php>',
        type: 'POST',
        data: postData,
        success: function (data) {
            $("#Vercode").val(data);
            console.log(data);
        }
    });
}
```

注册用户名密码（防止大家的库混淆）：POST 或 GET 发送 username（用户名）、password（密码）至 **http://www.leonszone.cn/test/yanzhengma/regist.php[5]**。参考代码：

```
function getData() {
    postData = {//整合数据包
        username: 'pdgzfx',
        password: 'pdgzfx',
        };
    $.ajax({
        url: '<http://www.leonszone.cn/test/yanzhengma/regist.php>',
        type: 'POST',
        data: postData,
        success: function (data) {
            console.log(data); } }); }
```

或直接浏览器访问：**http://www.leonszone.cn/test/yanzhengma/regist.php\\?username= 你的用户名 \&amp;password=[6]**你的密码

好累，先休息下，看看有没有人看吧…（*我感觉应该没多少人= =* 还真的有人！！！）



