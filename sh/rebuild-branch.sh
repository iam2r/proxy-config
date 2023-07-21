# !/bin/bash
help() {
    echo "Usage:"
    echo "rebuild-branch.sh [-c COMPARE_BRANCH -b BASE_BRANCH]"
    echo "e.g. rebuild-branch.sh -c feature/xxx -b main"
    echo "Description:"
    echo "COMPARE_BRANCH,比对分支（代码提纯的比对分支），默认是master"
    echo "BASE_BRANCH,基准分支（重建所需的基准分支），默认是master"
    echo "本脚本作用为将当前执行命令时的分支（需被重建的分支）与COMPARE_BRANCH进行比对，找出差异，并将差异应用到一条从BASE_BRANCH为基准创建的新分支（新分支名仍为需被重建的分支名，原来的需被重建的分支会被重命名并存在本地，用于安全自检。）"
    exit -1
}
# Defaults:
# 重建所需的基准分支
BASE_BRANCH=master
# 代码提纯的对比分支
COMPARE_BRANCH=master
# get opts
while getopts ":c:b:h" opt_name 
do
    case $opt_name in
        c)  COMPARE_BRANCH=$OPTARG
            ;;
        b)
            BASE_BRANCH=$OPTARG
            ;;
        h)
            help
            ;;
        ?) # 其它未指定名称参数
            echo "Unknown argument(s)."
            help
            exit 2
            ;;
    esac
done

# 确保在根目录
repo_dir=$(git rev-parse --show-toplevel)
# 捕获在项目根目录外执行脚本
if [ $? -ne 0 ];then
    exit
fi
cd $repo_dir

branch="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$branch" == "$COMPARE_BRANCH" ]]; then
    echo "当前分支是$COMPARE_BRANCH(代码对比取差异的分支)，请切换到你的工作分支"
    exit
elif [[ "$branch" == "$BASE_BRANCH" ]]; then
    echo "当前分支是$BASE_BRANCH(重建所基准的分支)，请切换到你的工作分支"
    exit    
else
    echo "需要被重建的分支：$branch"
    echo "代码比对提纯分支：$COMPARE_BRANCH"
    echo "重建所需基准分支：$BASE_BRANCH"
    echo "【请确认上述信息，输入y/n/h】？y 继续  n 放弃   h 查看帮助文档"
    read makesure
    if [[ "$makesure" == "y" ]];then
        echo "重建分支开始 !"
    elif [[ "$makesure" == "h" ]];then
        help
    else 
        exit 
    fi    
fi

# 检出比对分支
git checkout $COMPARE_BRANCH 
# 捕获上一步错误
if [ $? -ne 0 ];then
    echo "git checkout ${COMPARE_BRANCH} error"
    exit
fi
# 拉取最新代码
git pull

# 将当前分支往比对分支上合并提取差异
result="$(git merge $branch --no-commit --no-ff)"

if [[ $result == *conflict* ]];then
    echo "失败！存在冲突，请自行打开vscode解决，解决完后，输入y继续执行，输入n放弃并退出！"
    git merge --continue
    echo "【请输入y/n】？y 我已解决完  n 放弃合并"
    read constep
    if [[ "$constep" == "y" ]];then
        echo "您选择了我已解决完继续执行"
        # 暂存差异
        git add .
        # 将差异储藏
        git stash
        # result=`git merge --continue`
    else 
        echo "您选择了放弃合并，自动退出"
        git merge --abort
        git checkout $branch
        exit
    fi
else
    # 将差异储藏
    git stash
fi

# git merge --abort
# 切换到需要被重建的分支
git checkout $branch
# 捕获上一步错误
if [ $? -ne 0 ];then
    echo "git checkout ${branch} error"
    exit
fi

echo "【请输入y/n】合并正常，是否应用存储？"
read ispopstash
if [[ "$ispopstash" == "y" ]];then
    newbranch="$branch-$(date "+%d-%H-%M-%S")"
    echo $newbranch
    # 备份旧分支
    git branch -m $branch $newbranch
    # 检出基准分支
    git checkout $BASE_BRANCH
    # 从基准分支新建一条原分支名的分支
    git checkout -b $branch
    echo "【请输入y/n】分支已备份，从$BASE_BRANCH新建的纯净分支（这次未应用存储），是否推送到服务器？"
    read puremaster
    if [[ "$puremaster" == "y" ]];then
        echo "推送纯净分支"
        git push -f --set-upstream origin $branch
    else
        echo "未推送纯净分支，后续可一起推"
    fi

    # 应用最近一次的代码储藏，即之前提纯的代码
    result="$(git stash pop)"

    if [[ $result == *conflict* ]];then
        echo "应用提纯的代码失败！存在冲突，请自行打开vscode解决"
        echo "【请输入y/n】？y 我已解决完  n 放弃合并"
        read constep
            if [[ "$constep" == "y" ]];then
                echo "您选择了我已解决完继续执行"

                git add .

            else 
                echo "您选择了放弃合并，自动退出"
                git merge --abort
                git checkout $branch
                exit
            fi
    else
        # 无冲突
        git add .
    fi

    echo "【请输入y/n】已应用存储，是否提交并推送到服务器？"
    read ispush
    if [[ "$ispush" == "y" ]];then

        git commit -m "feature: 新建分支$branch"

        if [[ "$puremaster" == "y" ]];then
            git push -f
        else
            git push -f --set-upstream origin $branch
        fi

        echo "重建完成，本地原分支备份为$newbranch可移除"
    else
        echo "您选择了放弃推送，请手动推送后续操作"
        exit
    fi
else
    echo "您选择了放弃合并，自动退出"
    exit
fi
