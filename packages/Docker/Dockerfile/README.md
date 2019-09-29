# Dockerfile

文本格式的配置文件，快速创建自定义的镜像

### 基本组成

- 基础镜像信息
- 维护者信息
- 镜像操作指令
- 容器启动时执行指令


eg:

```bash

    FROM ubuntu
    MAINTAINER  docker_user  docker_user@emaill.com
    RUN echo "helll ubuntu"
    RUN apt-get update & apt-get install -y nginx
    CMD /user/sbin/nginx

```

### 指令

* FROM  
源于基础镜像

* MAINTAINER 
维护者

* RUN
将在当前镜像基础上执行指定命令，并提交为新的镜像

* CMD
指定启动容器时执行的命令，每个 Dockerfile 只能有一条 CMD 命令， 如果指定了多条，只有最后一条会执行

* EXPOSE 
告诉 Docker 服务端容器暴露的端口号，供互联系统使用，在启动容器时需要通过 -P， Docker 主机会自动分配一个端口转发到指定的端口； 使用-p，则可以具体指定哪个本地端口映射过来

* ENV
指定一个环境变量

* ADD 
ADD <src> <dest>   改命令将复制指定的 src 到容器的 dest， 其中 src 可以是 Dockerfile 所在目录的一个相对路径(文件或目录)， 也可以是一个 URL,还可以是一个 tar 文件，

* COPY 
COPY <src> <dest>   复制本地主机的 src （为 Dockerfile 所在目录的相对路径，文件或目录）为容器中的 dest， 模板路径不存在时，会自动创建， 当使用本地目录为源目录时，推荐使用 COPY

* ENTRYPOINT 
配置容器后执行的命令，并且不可被 docker run 提的参数覆盖。

* VOLUME 
VOLUME [/data] 创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等。

* USER

* WORKDIR

* ONBUILD
配置当所创建的镜像作为其他新创建镜像的基础镜像时，所执行的操作指令

