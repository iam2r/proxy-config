## 重建分支脚本

1、打开 git bash
2、从根目录执行 ./doc/rebuild-branch.sh 或者进入 doc 目录执行 ./rebuild-branch.sh
3、如果出现冲突，自行根据列出的冲突文件打开 vscode 修改，标记 incomming 是你代码
4、在 git bash 中继续输入 y 继续执行，输入 n 放弃所有
5、如果继续执行完毕，会在本地生成一个分支，名字是当前名+时间，留做安全自查，也可直接删除
