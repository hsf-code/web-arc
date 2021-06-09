---
title: Git 异常处理清单
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

## **前言**

Git 作为一种分布式版本控制系统已经成为现在开发的宠儿，不仅应用在前端、后端、客户端等开发场景中，也成为各行业互联网企业分工协作的必备技能之一。

大家在使用过程中总会碰到这样那样的问题，本文主要针对以下经常发生的几种异常情况提供一些解决方案：

1. 本地工作区文件恢复
2. 远程分支删除后，删除本地分支与其关联
3. 修改提交时的备注内容
4. 修改分支名，实现无缝衔接
5. 撤回提交
6. 撤销本地分支合并
7. 恢复误删的本地分支
8. 不确定哪个分支有自己提交的 commit

## **（一）本地工作区文件恢复**

大家都知道，一个文件夹中的文件如果被删掉了，那只有在垃圾箱里面找了。如果垃圾箱里面的也被删掉了，以笔者的常识在不借助工具的情况下怕是就找不到了，emmmm。。。

不过，关联了 Git 的文件和文件夹就不一样了，有了本地仓库和远程仓库的双重保护，找到一个被删除的文件也不过就分分钟，一个命令行的事情吧。

**语法**：`git checkout <filename/dirname>`

**命令**：`git checkout 1.js`

这一命令主要用于本地工作区文件的撤回，下图是一个工作区文件被删除后的完美恢复过程。

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7btq1G10t3dKfqrvYH9fJe8Dicpia1UibJicx4MOdjrBu3SSqxhgpWKnu0A/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **（二）远程分支删除后，删除本地分支及关联**

为方便分支提交，一般情况下会用本地命令 `git branch --set-upstream-to=origin/master master` 建立本地分支与远程分支的关联，从 master 拉出的分支可以自动建立与远程已有分支的关联，这样可以很方便的使用 `git pull` 和  `git push` 拉取远程分支的代码和将本地分支提交到远程。

Git 远程分支删除之后，本地分支就无法成功推送到远程，想要重新建立与远程仓库的关联，就需要先删除其原本的与已删除的远程分支的关联。

如下图所示，需要删除的远程分支为 feature/test，使用 `git push origin --delete feature/test` 删除掉对应的远程分支之后，删除本地分支关联。

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7v5ibJib8P31UZic6BjclfWzU3icLl6tfS9b5iaiaDGR1K1FmtC9zwvXxrdgw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

**语法**：`git branch --unset-upstream <branchname>`

**命令**：`git branch --unset-upstream feature/test`

删除掉关联关系之后，用 `git branch -vv` 命令可查看到本地分支与远程分支的关联关系如下图所示，可观察到 feature/test 分支已经没有关联的远程分支了。

[data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

## **（三）修改提交时的备注内容**

平时提交代码很多时候因为军情紧急，会在刚提交的时候填写了自己不太满意的备注，但笔者本人有点强迫症，一定要把它改成想要的样子咋办。。。。，不要慌，还是有解决办法滴！

想要修改最近一次提交的“修改xxx功能”的备注：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7FlOpC8bsm6B1icCJJdEjM3PB4UobHfUGdbkBAb6YqOGS07sjpQGhQicA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

**语法**：`git commit --amend`

**命令**：`git commit --amend`

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7rY69tGicTz5Lj1bgcZib5r7kicedwh5W6KejAqREBdsFiaYXTzdkLKLjvw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

使用 `git log --pretty=oneline` 查看内容，发现已经成功修改啦。**需要注意的是此项命令会修改提交时的commit-id，即会覆盖原本的提交，需要谨慎操作**。

## **（四）修改分支名，实现无缝衔接**

开发中的大佬都是拥有极快手速的人，建了个分支一不小心打错了某个字母或者两个字母打反了，可能就与本意存在较大误差了，Git 提供一种已经拉取了分支，在上面开发了不少的内容，但后来发现原本拉的分支名字就有问题的修复方法。

例如，我们的想新建的分支名为 feature/story-13711，却写成了  feature/stor-13711：

**语法**：`git branch -m <oldbranch> <newbranch>`

**命令**：`git branch -m feature/stor-13711 feature/story-13711`

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7JjZ9ActqXly6fMCQMPIpNOVA4wXRiaBl5OknRkeHMAdHox606KuL8YA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

执行完之后发现文件的工作区已修改内容一点都没有变化，真正的实现了无痛过渡，皆大欢喜！

## **（五）撤回提交**

日常工作中，可能由于需求变更、或者误操作等原因需要进行提交的撤回：

如下分析了各种原因撤销的场景，主要包括：

- 已将更改交到本地存储，需要撤回提交
- 用新的提交内容替换上一次的提交
- 本地提交了错误的文件

### **已将更改提交到本地，需要撤回提交**

**语法**：`git reset --soft [<commit-id>/HEAD~n>]`

**命令**：`git reset --soft HEAD~1`

命令执行完成后，查看文件变更记录，可发现如下图所示：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7alKSS3lFF5pBPmVzNicWudWQQpkxULHqv0nog3PlOGL31YExm40CgQA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

文件变更记录与未提交之前的文件变更记录是一致的，只是撤销了 commit 的操作。

### **用新的更改替换撤回的更改**

提交之中可能有些地方需要优化，我们可以撤销本次的 commit 以及文件暂存状态，修改之后再重新添加到暂存区进行提交。

**语法**：`git reset --mixed [<commit-id>/HEAD~n>]`

**命令**：`git reset --mixed HEAD~1`

命令执行完成后，查看文件变更记录，可发现如下图所示：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7P8LcMfwHFk9QPjdnBrmbwTXHpy90VDDbrXHzp1BhRicQsenia44szXnw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

已变更的文件都未添加到暂存区，撤销了 commit 和 add 的操作。

### **本地提交了错误的文件**

本地将完全错误的，本不应提交的内容提交到了仓库，需要进行撤销，可以使用 --hard 参数

**语法**：`git reset --hard [<commit-id>/HEAD~n>]`

**命令**：`git reset --hard HEAD~1`

命令执行完成后，查看文件变更记录，可发现如下图所示：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7wnMFolbXvGDWyicUbkiaGt3c7VjxZlpnraR0UHuX9eibTugBH2cibxnItA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

已追踪文件的变更内容都消失了，撤销了 commit 和 add 的操作，同时撤销了本地已追踪内容的修改；未追踪的内容不会被改变。从上面的效果可以看到，文件的修改都会被撤销。**-hard  参数需要谨慎使用**。

## **（六）撤销本地分支合并**

实际操作中，总会有很多的干扰，导致我们合并了并不该合并的分支到目标分支上。解决这种问题的方式有两种，`git reset` 和 `git revert`。reset 的语法和命令之前已经介绍过，不做赘述， revert 的语法和命令和 reset 一致。但是产生的实际效果会有不同。

可以先来看下 revert 操作的实际效果，合并分支之后的效果如下图所示：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7iaicrZdqAibNqNQoaScickWJe5vCPHy7bBkxnqojCd5CImKpZrU3icmm0jw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

撤销合并：

**语法**：`git revert <commit-id>`

**命令**：`git revert 700920`

下图为执行命令后的效果：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7pM3ZP5lLoYqnzVRiascmnFbAHgakeFWHmpiayI36J57DLiaSbtlcw8sEA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

经过前后对比可知，revert 执行之后会在原本的记录中新增一条提交记录。

reset 如上 “本地文件撤销” 例子所述，会删除掉原本已有的提交记录，在合并分支中，会删除原本合并分支的记录。revert 则有不同，会保留原本合并分支的记录，并在其上新增一条提交记录，便于之后有需要仍然能够回溯到 revert 之前的状态。

从需要提交到远程分支的角度来讲，reset 能够“毁尸灭迹”，不让别人发现我们曾经错误的合并过分支（**注：多人协作中，需要谨慎使用**）；revert 则会将合并分支和撤回记录一并显示在远程提交记录上。

## **（七）恢复误删的本地分支**

本地分支拉取之后，由于疏忽被删除，而且本地的分支并没有被同步到远程分支上，此时想要恢复本地分支。

误删的分支为 feature/delete，使用 `git reflog` 命令可查看到该仓库下的所有历史操作，如下图所示：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7wo2RFAbvdrjne3eUdfIdvybiaNEhHpfDy0WFPpIDCqcf2WDazXntSyw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

**语法**：`git checkout -b <branch-name> <commit-id>`

**命令**：`git checkout -b feature/delete HEAD@{2}`

命令执行完成后，分支恢复到 HEAD@{2} 的快照，即从 master 分支拉取 feature/delete 分支的内容，仍然缺少“新增xxx文件”的提交，直接将文件内容恢复到最新的提交内容，使用命令 `git reset --hard HEAD@{1}` 即可实现硬性覆盖本地工作区内容的目的。`git reflog` 命令获取到的内容为本地仓库所有发生过的变更，可谓恢复利器，既可向前追溯，亦可向后调整，满满的时光追溯器的赶脚啊。。。

## **（八）不确定哪个分支有自己提交的 commit**

工作中会经常碰到一种场景，某个提交先后合并到了各个分支上，但后来发现提交的这个修改是有问题的，需要排查到底哪个分支包含这个提交，然后将其修复掉。

需要先确定有问题的提交的 commit-id :

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa73KSibsU7p6H3W7VmYsTiaia9hLCb8ZS8BpgzQrxykkbJOj6wLvI2wbITQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

然后查看本地所有的分支：

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa768aBibdXBiaW7cb8xFQjgAtSS4Ae9oRy0pF003EkL6JjKe7jjRV7rU6A/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

可以看到本地有 4 个分支，本地的分支数量非人为控制的，在使用状态的分支直接删掉也不合适，分支数量达到一定程度，一个一个分支查找也不现实。Git 提供了一种能够直接通过 commit-id 查找出包含该内容分支的命令。

**语法**：`git branch --contains <commit-id>`

**命令**：`git branch --contains 700920`

命令执行后可以看到包含该问题提交的分支如下图所示，就可以很方便的在对应分支上修复内容啦。

https://mmbiz.qpic.cn/mmbiz_jpg/vzEib9IRhZD4WY8ABnO2Ywfnt51VibTMa7HMs8VMmt56L8VCrxzDyxEZ2ZjfedyuXXQOIhU27QqCjCrprs03aWmg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **总结**

本文介绍的是实际工作场景中可能出现的几种异常情况及解决方式，希望能够对大家有所帮助，不足之处敬请指正。实际上现在已经有很多 Git 操作对应的工具可以使用，需要明白的是工具中的每个操作等同于 Git 命令行的哪个命令，会有什么样的结果，以避免一些不必要发生的错误。

## **参考文献**

**Git 错误集锦和修复方法** (https://www.edureka.co/blog/common-git-mistakes/#pushed)

**Git 中.gitignore的配置语法** (https://www.jianshu.com/p/ea6341224e89)

**git reset 和 git revert** (https://juejin.im/post/5b0e5adc6fb9a009d82e4f20)





# 10个最需要常备的后悔药

# **前言**

Git是目前世界上最优秀最流行的分布式版本控制系统，也是程序员们日常使用最频繁的工具之一（几乎每天都需要使用它来对源代码进行版本管理）。

使用Git的过程，难免由于手快或者别的什么原因，需要对做过的事情进行“反悔”或者多次“反悔”。不用担心，Git强大到几乎任何操作都是可以“反悔”的，让我们一起来看看吧。

# **1.在未暂存前，撤销本地修改**

在介绍Git“反悔”操作之前，先简单提及下Git的一些基础知识。

Git项目有3个区域：工作区、暂存区和Git仓库（分成本地仓库和远程仓库）。如下图：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcGaGKp580uccU1eW2ESia8aEDCpD6Riaw6XqAQKiaV9Yxgk9MK8BE8QKiaA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

本地编写的代码，不执行任何git命令，处于工作区。

执行`git add`命令时，会将工作区的文件标记为已暂存，保存在暂存区。

执行`git commit`命令时，会将标记为已暂存的文件保存都本地Git仓库，并生成一个快照。

在没有暂存之前（没有执行`git add`命令），我们可以通过以下命令查看本地修改：

```
git diff
```

显示的格式如下图所示：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcmz3iclAcXcicPNuHDoPVb9Dde9C93fQcJMhf3bKwE1nqI98TOFELKafg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如果我们不想要这些代码本地代码（比如一些临时的测试代码），可以通过以下命令一次性撤销所有本地修改：

```
git checkout -- .
```

> 注意：该命令不可二次“反悔”，本地操作一旦撤销，将无法通过Git找回。

撤销之后再次执行`git diff`命令将没有任何输出，代表没有文件在暂存区。

我们也可以指定具体的文件路径，撤销该文件的修改：

```
git checkout -- [filename]
```

# **2.在暂存之后，撤销暂存区的修改**

本地写完代码，提交到本地仓库之前，需要先将修改的文件添加到暂存区，执行以下命令将本地所有已修改的文件添加到暂存区（当然也可以指定具体的文件）：

```
git add .
```

此时我们执行git diff命令，将不会有任何输出（因为文件已被添加到暂存区），想要查看暂存区的修改，可以执行以下命令：

```
git diff --staged
```

看到的效果和之前为暂存前，通过git diff看到的一模一样。

如果这时我们想要一次性撤销暂存区的全部修改，可以执行以下命令（当然也可以撤销暂存区指定文件的修改）：

```
git reset .
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcicO9qDWfQOMT4fzj3C8RziaNTeR3rXq1nZrS31myn5GEoPguN0rQRFibA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

> 注意：该命令可以二次“反悔”，通过git add .命令可以将文件再一次添加到暂存区。这里的“撤销暂存区的修改”是指撤销git add .这个命令，回到执行git add .之前的状态，即已修改未暂存状态。此时，如果执行git diff --staged命令，将没有任何输出，执行git diff命名将看到已修改未暂存状态的输出。

1和2的两个命令可以合并成一个：

```
git reset --hard

<=>

git reset .
git checkout --
```

即：如果已暂存，但未提交本地仓库之前，想把所有文件直接抛弃（而不是从暂存区删除），可以直接执行以上命令。

# **3.提交到本地仓库之后（但未推送到远程仓库），撤销本次提交**

执行以下命令，可以将暂存区的所有文件保存到本地Git仓库，并生成文件快照（便于之前的回退等操作）：

```
git commit -m "modify some files"
```

此时提交历史里面会有一条记录`f8651ff`（Commit ID）：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcRqcvudpQWKdibIIprBnzBm9svmC6G10jdNXRDtXTw6fgYibxB07h0Wow/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如果我们不想要这次修改的内容，有以下2种方法：

## **方法一**

回到当前提交的父对象`a18c6fa`（即上一次提交，通过`git log`查看），就等于撤销了本次提交：

```
git checkout a18c6fa
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcuZzQv0DKXcjzoyUUrEoBA3S87vOCkEERw9dOUHicgD1S5iafjDvd9bhQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

执行git log命令，发现已经回到之前的提交：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcN1MFthuariaPQGMosp5weiaRxogRGzxL43XicxrjhibQfOCsZbFQENpxaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

## **方法二**

重置之前的提交

```
git reset --hard HEAD~1
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcEIHMWYFibnByHXBjHsVuEB0H9VgUA6d3rNQib5b5bib8DR76tN1Ajia9eQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

效果和方法一一样：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcN1MFthuariaPQGMosp5weiaRxogRGzxL43XicxrjhibQfOCsZbFQENpxaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

注意：该命令是可以二次“反悔”的，具体步骤如下：

```
1.找到被重置的提交 git reflog，发现是 f8651ff
2.使用reset回到该提交 git reset --hard f8651ff
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMciau6nKoyWqVsVzC9ccP1ZZklxicTBeha2aP5l684Ax3JPrztXGHPpzMA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

# **4.修改提交**

考虑以下场景：

原本打算修改两个文件，结果只提交了一个文件，但又不想生成两个提交记录（Commit ID），具体执行的命令如下：

```
git add src/app/app.component.html
git commit -m "add test block"
git log
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMccF9asp5VibAjBC0cEnvpBUAC0G8a1gVIuz6dc9GJXRIibg8vdCWUca8Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

这样其实只提交了`app.component.html`一个文件，不是我们想要的。

可以通过以下命令“反悔”（添加遗漏文件，又不重新生成新的Commit ID）：

```
git add src/app/app.component.css
git commit --amend
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMckwga15YIkEpwv1PeAxzTZZeKfiaXYFVcCAKhYK8VYnvyxF2Q1ojGYlg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

还有一种场景可能更加常见，没有遗漏的文件，只是提交信息里有一个单词写错了，可以使用以下命令进行修补：

```
git commit --amend -m "add test container"
```

> 注意：--amend修补参数会将改变之前的Commit ID，但不会生成新的Commit ID。

# **5.撤销提交历史中的某一次指定的提交**

第3小结提到回退最近一次提交的方法（使用git reset命令），该方法只能针对连续的提交，如果只想撤销提交历史中的某一次提交（比如：），该怎么办呢？

比如：Commit ID为711bb0b的提交，该次提交将标签的target属性由"_blank"改成了"_self"。

https://mmbiz.qpic.cn/mmbiz_jpg/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcRK19xFrTqREOHm7ym6tGhiaE1LdHuTZRG6K8ZxUHf4Ptlf7S3pQfHcg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

可以使用以下命令撤销该次提交（将提交的内容“反操作”），并生成一个新的提交在最前面：

```
git revert 711bb0b
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcfibyQ7ljtMK4EjOaw8y8JRz6X5wdpJvtdGTTiaWicGv9SsJEd3v1crHkA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

revert之后，会在提交历史的最前面生成一个新的Commit ID（1f49a42），该次提交将标签的target属性由"_self"改回了"_blank"。

https://mmbiz.qpic.cn/mmbiz_jpg/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcPfKFHa2fWWAoQjogw1dHBJEbGNhSdpKRxSUkcSs01FZJVDlNIjKicicA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

# **6.合并出现冲突时，撤销合并操作**

两个分支改了同一个文件的同一个地方，合并时将出现冲突：

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcSXBStuzr8icKUQnPNicj6mWMTGuodY80wDNU7t9ak3w0K2lJnWciaiclibw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcibvk9DuDibfTlBmn6Pib87VnT4iap3hOlFkRmKFUwySffZBd2V9MoIjf0w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

如果不想解决冲突，想撤销这个合并，可以使用以下命令：

```
git merge --abort
```

abort之后，将恢复合并之前的状态。

# **7.暂存区的文件加多了，想移除，又不想删掉本地的文件**

```
git rm --cached src/test.pptx
```

# **8.分支重命名**

```
git br -m [old_br] [new_br]
```

# **9.撤销变基操作**

将 rebase_test 分支的修改变基到master上：

```
git co rebase_test
git rebase master
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMcE4bgy9Y60EAZGpuibGJpibL9iaUZ4ww8yicKaBr60HCpeuJ6xl4vLa0HbA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

撤销的步骤如下：

```
1.使用 git reflog 命令找到变基前的提交 09b0adc
2.使用 git reset --hard 09b0adc 重置到该提交
```

https://mmbiz.qpic.cn/mmbiz_png/XP4dRIhZqqVyE23e0eLmgGQVnm4FgEMccViaI0jU9oxqX9L3NolXxhWkYDF8ZvibqnNDwTnaRJBARmHCvW0YABqQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1

# **10.以脚本方式改写提交**

考虑以下场景，在一次很早的提交中，将一个储存密码的文件passwords.txt提交到了远程仓库，这时如果只是从远程仓库中删除该文件，别人依然可以通过提交历史找到这个文件。

因此我们需要从每一个快照中移除该密码文件，用以下命令就可以做到：

```
git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
```

该命令执行完会将提交历史中所有提交的passwords.txt文件彻底删除，永远没法通过Git找回。

除了以上“反悔”操作，还有一个很强大的命令，也可以以某种形式对过去做过的事情进行“反悔”，那就是交互式变基：

```
git rebase -i
```

该命令非常强大，DevUI团队的少东之前专门写过一篇来介绍该命令，欢迎大家移步阅读：

关于Git rebase你必须要知道的几件事

如果发现文中有错误或者遗漏的地方，欢迎大家指正！



