# 启动Rabbitmq
docker run -d --hostname my-rabbit --name rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:latest

# 新启动的RabbitMQ默认没有开启后台管理控制台
需要进入到容器，然后执行

rabbitmq-plugins enable rabbitmq_management

# 进入到容器，添加账号
rabbitmqctl add_user admin admin 

# 为新添加的账号设置权限
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# 赋予admin账号administrator角色
rabbitmqctl set_user_tags root administrator

# 查看用户
rabbitmqctl list_users