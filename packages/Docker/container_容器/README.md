# container

### 创建容器

```bash
    sudo docker create -it ubuntu:latest
```

### 启动容器

```bash
    将终止的启动
    docker run 
    
    docker run ubuntu /bin/echo 'hello world'


    新建并启动
    docker create 
    docker start


    启动 bash 终端且允许交互
    sudo docker run -t -i ubuntu:latest  /bin/bash


    守护态运行 -d
    sudo docker run -d ubuntu /bin/sh -c 'hello'
```

### 终止

```bash
    sudo docker stop
```


### 进入

`attach, exec, nsenter`

```bash
    sudo docker attach container


    sudo docker exec -ti container   /bash/bin
```


### 删除 rm

```bash
    sudo docker ps -a
    sudo docker rm contarinId
```

### 导入导出

export  import

```bash
    sudo docker export xxx > yyyy_run.tar


    cat yyyy_run.tar | sudo docker import - test/yyyy
```