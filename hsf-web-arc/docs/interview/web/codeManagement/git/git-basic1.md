---
title: 工程化（一）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

### 你的git⼯作流是怎样的?

GitFlow 是由 Vincent Driessen 提出的⼀个 git操作流程标准。包含如下⼏个关键分⽀：

| 名称    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| master  | 主分⽀                                                       |
| develop | 主开发分⽀，包含确定即将发布的代码                           |
| feature | 新功能分⽀，⼀般⼀个新功能对应⼀个分⽀，对于功能的拆分需要⽐较合理，以避免⼀些后⾯不必要 的代码冲突 |
| release | 发布分⽀，发布时候⽤的分⽀，⼀般测试时候发现的bug 在这个分⽀进⾏修复 |
| hotfix  | hotfix 分⽀，紧急修 bug 的时候⽤                             |
| tag     | 这个不属于分支，只是当一个版本发布之后，就会创建一个tag，如果一个上线的版本出现什么问题，就会紧急创建一个hotfix的分支用于来修改发布版本的紧急bug |

##### GitFlow 的优势有如下⼏点：

- **并⾏开发：**GitFlow 可以很⽅便的实现并⾏开发：每个新功能都会建⽴⼀个新的 feature 分⽀，从⽽和已经完成 的功能隔离开来，⽽且只有在新功能完成开发的情况下，其对应的 feature 分⽀才会合并到主开发分⽀上（也就是我们经常说的 develop 分⽀）。另外，如果你正在开发某个功能，同时⼜有⼀个新的功能需要开发，你只需要 提交当前 feature 的代码，然后创建另外⼀个 feature 分⽀并完成新功能开发。然后再切回之前的 feature 分 ⽀即可继续完成之前功能的开发。
- **协作开发：**GitFlow 还⽀持多⼈协同开发，因为每个 feature 分⽀上改动的代码都只是为了让某个新的 feature 可以独⽴运⾏。同时我们也很容易知道每个⼈都在⼲啥。 
- **发布阶段：**当⼀个新 feature 开发完成的时候，它会被合并到 develop 分⽀，这个分⽀主要⽤来暂时保存那些还 没有发布的内容，所以如果需要再开发新的 feature ，我们只需要从 develop 分⽀创建新分⽀，即可包含所有已 经完成的 feature 。
- **⽀持紧急修复：**GitFlow 还包含了 hotfix 分⽀。这种类型的分⽀是从某个已经发布的 tag 上创建出来并做⼀个紧 急的修复，⽽且这个紧急修复只影响这个已经发布的 tag，⽽不会影响到你正在开发的新 feature 。

###### 解释：

1. ​	feature（个人开发的单个功能分支） 分⽀都是从 develop 分⽀创建，完成后再合并到 develop 分⽀上，等待发布。
2. ​	当需要发布时，我们从 develop 分⽀创建⼀个 release 分⽀。
3. ​	然后这个 release 分⽀会发布到测试环境进⾏测试，如果发现问题就在这个分⽀直接进⾏修复。在所有问题修复之 前，我们会不停的重复发布->测试->修复->重新发布->重新测试这个流程。
4. ​	发布结束后，这个 release 分⽀会合并到 develop 和 master 分⽀，从⽽保证不会有代码丢失。
5. ​	master 分⽀只跟踪已经发布的代码，合并到 master 上的 commit 只能来⾃ release 分⽀和 hotfix 分⽀。
6. ​	hotfix 分⽀的作⽤是紧急修复⼀些 Bug。

`它们都是从 master 分⽀上的某个 tag 建⽴，修复结束后再合并到 develop 和 master 分⽀上。`

### rebase 与 merge的区别?

git rebase 和 git merge ⼀样都是⽤于从⼀个分⽀获取并且合并到当前分⽀. 

假设⼀个场景,就是我们开发的[feature/todo]分⽀要合并到master主分⽀,那么⽤rebase或者merge有什么不同呢?

![](D:\resDoc\hsf-web-arc\docs\interview\web\codeManagement\git\img\marge合并方式.jpg)

marge 特点：⾃动创建⼀个新的commit 如果合并的时候遇到冲突，仅需要修改后重新commit 

​	优点：记录了真实的commit情况，包括每个分⽀的详情 

​	缺点：因为每次merge会⾃动产⽣⼀个merge commit，所以在使⽤⼀些git 的GUI tools，特别是commit⽐较频繁 时，看到分⽀很杂乱。

![](D:\resDoc\hsf-web-arc\docs\interview\web\codeManagement\git\img\rebase合并方式.jpg)

rebase 特点：会合并之前的commit历史 

​	优点：得到更简洁的项⽬历史，去掉了merge commit 

​	缺点：如果合并出现代码问题不容易定位，因为re-write了history 

因此,当需要保留详细的合并信息的时候建议使⽤git merge，特别是需要将分⽀合并进⼊master分⽀时；当发现⾃⼰修 改某个功能时，频繁进⾏了git commit提交时，发现其实过多的提交信息没有必要时，可以尝试git rebase.

### git reset、git revert 和 git checkout 有什么区别

这个问题同样也需要先了解 git 仓库的三个组成部分：⼯作区（Working Directory）、暂存区（Stage）和历史记录区 （History）。 

- ⼯作区：在 git 管理下的正常⽬录都算是⼯作区，我们平时的编辑⼯作都是在⼯作区完成 
- 暂存区：临时区域。⾥⾯存放将要提交⽂件的快照 
- 历史记录区：git commit 后的记录区

三个区的转换关系以及转换所使⽤的命令：

![](D:\resDoc\hsf-web-arc\docs\interview\web\codeManagement\git\img\代码的转换关系.jpg)

git reset、git revert 和 git checkout的共同点：⽤来撤销代码仓库中的某些更改。

然后是不同点： 

​	⾸先，从 commit 层⾯来说：

- git reset 可以将⼀个分⽀的末端指向之前的⼀个 commit。然后再下次 git 执⾏垃圾回收的时候，会把这个 commit 之后的 commit 都扔掉。git reset 还⽀持三种标记，⽤来标记 reset 指令影响的范围： 
  - [ ] --mixed：会影响到暂存区和历史记录区。也是默认选项 
  - [ ] --soft：只影响历史记录区 
  - [ ] --hard：影响⼯作区、暂存区和历史记录区

**注意：因为 git reset 是直接删除 commit 记录，从⽽会影响到其他开发⼈员的分⽀，所以不要在公共分⽀（⽐如 develop）做这个操作。**

- git checkout 可以将 HEAD（这个是标记当前的操作空间） 移到⼀个新的分⽀，并更新⼯作⽬录。因为可能会覆盖本地的修改，所以执⾏这个指令 之前，你需要 stash 或者 commit 暂存区和⼯作区的更改。 
- git revert 和 git reset 的⽬的是⼀样的，但是做法不同，它会以创建新的 commit 的⽅式来撤销 commit，这样能保 留之前的 commit 历史，⽐较安全。另外，同样因为可能会覆盖本地的修改，所以执⾏这个指令之前，你需要 stash 或者 commit 暂存区和⼯作区的更改。

然后，从⽂件层⾯来说：

- git reset 只是把⽂件从历史记录区拿到暂存区，不影响⼯作区的内容，⽽且不⽀持 --mixed、--soft 和 --hard。 
- git checkout 则是把⽂件从历史记录拿到⼯作区，不影响暂存区的内容。 
- git revert 不⽀持⽂件层⾯的操作。





