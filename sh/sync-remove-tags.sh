#! /bin/bash
 
# 确保在根目录
repo_dir=$(git rev-parse --show-toplevel)
# 捕获在项目根目录外执行脚本
if [ $? -ne 0 ];then
    exit
fi
cd $repo_dir

git tag -l | xargs git tag -d
git fetch origin --prune
git fetch origin --tags
