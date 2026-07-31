# Start RabbitMQ

docker run -d --hostname my-rabbit --name rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:latest

# The Management Console Is Not Enabled by Default in a New RabbitMQ Instance

Enter the container and run:

rabbitmq-plugins enable rabbitmq_management

# Enter the Container and Add a User

rabbitmqctl add_user admin admin 

# Set Permissions for the Newly Added User

rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# Assign the `administrator` Role to the `admin` User

rabbitmqctl set_user_tags root administrator

# List Users

rabbitmqctl list_users
