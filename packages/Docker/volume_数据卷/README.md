# volume
 
volume 有如下特性

- 数据卷可以在容器直接共享和重用
- 对数据卷的修改会立马生效
- 对数据卷的更新，不会影响镜像
- 卷会一直存在，直到没有容器使用


### 容器内创建卷 -v

```bash
    # 使用training/webapp 镜像创建一个web容器，并创建一个数据卷挂载到容器的/webapp目录
    sudo docker run -d -p --name web -v /webapp training./webapp python app.py

    # 挂载主机目录作为数据卷
    # 加载主机的/src/webapp目录到容器的/opt/webapp目录
    sudo docker run -d -p --name web -v /src/webapp:/opt/webapp  training/webapp python app.py

```

### 数据卷容器

在容器之间共享一些持续更新的数据。

```bash

    # 首先创建一个数据卷容器dbdata,并在其中创建一个数据卷到/dbdata
    sudo docker run -it -v /dbdata --name dudata ubuntu

    # 然后可以在其他容器中使用--volumes-from 来挂载dbdata容器中的数据卷
    sudo docker run -it --volumes-from dbdata --name db1 ubuntu
    sudo docker run -it --volumes-from dbdata --name db2 ubuntu

```