# ssh

创建支持 ssh 服务的镜像

```bash

    # 创建工作目录
    mkdir sshd_ubuntu

    # 创建 Dockerfile 和 run.sh 文件
    cd sshd_ubuntu
    touch Dockerfile run.sh

    # 编写 run.sh 脚本和 authorized_keys 文件
    # !/bins/bash
    /user/sbin/sshd -D 

    # 在宿主主机上生成 SSH 密匙对，并创建 authorized_keys 文件
    ssh-keygen -t rsa
    ...
    cat ~/.shh/id_rsa.pub > authorized_keys

    # 编写 Dockerfile

    # 创建镜像
    # 在 sshd_ubuntu 目录下，使用 docker build 命令来创建镜像
    cd sshd_ubuntu
    sudo docker build -t sshd:dockerfile .

    # 测试镜像，运行容器
    # 直接启动镜像，映射容器的 22 端口到本地的 10122 端口
    sudo docker run -d -p 10122:22 sshd:dockerfile


```