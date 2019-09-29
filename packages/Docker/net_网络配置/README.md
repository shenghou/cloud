# net 网络

docker 提供映射容器端口到宿主主机和容器互联机制来为容器提供网络服务

### 端口映射实现访问容器  -p

```bash

    # 从外部访问 -p
    sudo docker run -d -p training/webapp python app.py

    # 映射所有接口地址  hostPort:containerPort   本地/容器
    sudo docker run -d -p 5000:5000 training/webapp python app.py

    # 映射到指定地址的指定端口 ip:hostPort:containerPort
    sudo docker run -d -p 127.0.0.1:5000:5000 raining/webapp python app.py

    # udp端口
    sudo docker run -d -p 127.0.0.1:5000:5000/udp raining/webapp python app.py

    # 映射到指定地址的任意端口 ip:hostPort:containerPort
    sudo docker run -d -p 127.0.0.1::5000 raining/webapp python app.py 

    # 查看端口配置
    sudo docker port xxxx 5000

```

### 容器互联实现容器间通信  link

在源和接收容器之间创建一个隧道，接收容器可以看到容器指定的信息

```bash

   # 自定义容器命名，连接系统依据容器的名称来执行 --name
   # 如果添加 --rm 标记则容器在终止后会立刻删除，  --rm  - d 不能同时使用
    sudo docker run -d -p --name web training/webapp  python app.py

   # 容器互联 --link name:alias   name是要链接容器的名称，alias是这个链接的别名
   # 创建数据库容器连接 web容器

   sudo docker run -d --name db training/postgress

   sudo docker run -d -p --name --link db:db training/webapp  python app.py

```