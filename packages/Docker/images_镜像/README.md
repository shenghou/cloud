# 镜像

### 获取镜像

```bash
    sudo docker pull  ubuntu
```


### 使用镜像

```bash
    sudo docker run -t -i ubuntu  /bin/bash
```

### 查看镜像

```bash
    sudo docker images
```

### 删除镜像

需关掉运行的容器

sudo docker ps -a

```bash
    sudo docker rmi  imagsID
    sudo docker rmi  -f imagsID
```


### 创建

- 基于现有更改   docker commit
- 本地导入  cat

- docker file


### 存出和载入

```bash
    sudo docker save -o imageName
    sudo docker load --input imageName
```