---
title: "[Hugo] Building a Personal Blog with Hugo and Nginx"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["Hugo","Blog"]
categories: ["Hugo"]
author: "Jalen Qian"
---

> Server platform: CentOS 64-bit

# 1. Install Git

If you are using a fresh CentOS operating system, you first need to install Git.

```shell
 yum install git
```

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909140210.png)

# 2. Install Go

Because Hugo is developed in Go, you need to install Go before installing Hugo.

## 2.1 Download the Installation Package

First, download the Go installation package locally [from the Chinese GoLang website](https://studygolang.com/dl/).

```shell
wget https://studygolang.com/dl/golang/go1.15.1.linux-amd64.tar.gz
```

After the command finishes, you can see that the package has been saved to the local root directory.

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909154347.png)

## 2.2 Install Go in the Specified Directory

Install Go in a specified directory. Here, I install it in the `/usr/local` directory.

```
tar -C /usr/local -xzf go1.15.1.linux-amd64.tar.gz
```

Go is now installed in the `/usr/local/go` directory.

Enter the `go version` command to verify whether the installation was successful.

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909155238.png)

## 2.3 Configure GOPATH

### 2.3.1 Create GOPATH for Third-Party Go Packages and Projects

```
mkdir -p /usr/local/goPath/src    #存放第三方包及项目
mkdir -p /usr/local/goPath/bin    #存放项目编译后的可执行文件
mkdir -p /usr/local/goPath/pkg    #存放项目编译后的文件
```
## 2.4 Configure Environment Variables

Add the `/usr/local/go/bin/` directory to the `PATH` environment variable and configure `GOROOT`.

```
export PATH=$PATH:/usr/local/go/bin:/usr/local/goPath/bin #添加环境变量
export GOROOT=/usr/local/go           # golang解析器的存放路径
export GOPATH=/usr/local/goPath     #golang项目及第三方包存放路径

export GOPROXY=https://mirrors.aliyun.com/goproxy/#设置go代理
```
> Note that this is only temporary. To make it permanent, modify the
> `/etc/profile` file, add these lines of code to the end of the file, and then run:
> `source /etc/profile`

## 2.5 Verify the Installation

Enter `go env` to verify whether the configuration was successful.

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909163159.png)

If the printed `GOPATH` and `GOROOT` values both match the paths configured above, the configuration was successful.

# 3. Install Hugo

Hugo official website: [https://gohugo.io](https://gohugo.io/)

There are two ways to install Hugo on Linux. One is through `Homebrew`, in which case you can simply run:

```shell
brew install hugo
```

The other is to install it directly from a downloaded binary package. We will use this method here.

## 3.1 Download the Hugo Installation Package

Download the installation package from [https://github.com/gohugoio/hugo/releases/](https://github.com/gohugoio/hugo/releases/).

<b><span style="color:red;">Here, we select the file shown below for download.</span></b>

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909180910.png?imageView2/1/w/500)

After copying the link address, download it locally.

```shell
wget https://github.com/gohugoio/hugo/releases/download/v0.74.3/hugo_0.74.3_Linux-64bit.tar.gz
```
P.S. If the download is too slow, you can download it to your local computer first and then upload it to Linux using the `rz` command. Install the `rz` command-line tool with:

```shell
yum install lrzsz
```

## 3.2 Install the Hugo Package

Here, we install the Hugo command in the `/usr/local/hugo` directory.

```
tar -C /usr/local/hugo -xzf hugo_0.74.3_Linux-64bit.tar.gz
```
## 3.3 Add the Hugo Command to the Environment Variables

As with the Go environment variable configuration above, add the `/usr/local/hugo` directory to `PATH`.

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909181621.png)

Run the following command to apply the environment variables:

```
source /etc/profile
```
## 3.4 Verify That Hugo Was Installed Successfully

```
hugo version #输出Hugo版本号表示安装成功
```
![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909182050.png)

## 3.5 Create a Hugo Project

A Hugo project is a website. Use the following command to create one:

```
hugo new site [project-name]
```

For example, to create a `blog` project in the `$GOPATH/github.com/blog` directory, run:

```
cd /usr/local/goPath/src/github.com/
hugo new site blog
```

The Hugo command creates a `blog` project with the following structure:

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909183329.png)

```
.
├── archetypes # 存放生成博客的模版
├── assets # 存放被 Hugo Pipes 处理的文件
├── config # 存放 hugo 配置文件 支持 JSON YAML TOML 三种格式配置文件
├── content # 存放 markdown 文件
├── data # 存放 Hugo 处理的数据
├── layouts # 存放布局文件
├── static # 存放静态文件 图片 CSS JS文件
└── themes # 存放主题
```
## 3.6 Add a Theme

To quickly set up a blog, you can use a theme. After applying a theme, you only need to add Markdown files to the `content` folder.<br>
Hugo has a theme marketplace at https://themes.gohugo.io/ where you can browse and select a theme.

For example, the following image shows the preview of this theme on the website:

![image](http://cdn1.jalen-qian.com/Hugo/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200909184526.png)

[https://github.com/olOwOlo/hugo-theme-even](https://github.com/olOwOlo/hugo-theme-even)

To use this theme, clone it directly into the `blog` directory with Git:

```
cd blog
git clone https://github.com/olOwOlo/hugo-theme-even themes/even
```
## 3.7 Start Hugo

Open the `blog/themes/even/exampleSite` folder and copy the `config.tom` file to the project root directory. Then replace the `content` folder in the root directory with the `blog/themes/even/exampleSite/content` folder.

From the `blog` root directory, enter the following command to start Hugo:

```shell
hugo service
```

**Note: This method starts a local service. To deploy the blog publicly, you need to install a web server such as Nginx.**

# 4. Install Nginx

## 4.1 Install with Yum

```
yum install nginx
```

## 4.2 Configure the `service` Command to Easily Start and Stop Nginx

After installation, edit the `nginx` file in the `/etc/init.d/` directory.

```shell
cd /etc/init.d/
vim nginx
```

Enter the following content:

```shell
nx - this script starts and stops the nginx daemon
#
# chkconfig:   - 85 15
# description:  NGINX is an HTTP(S) server, HTTP(S) reverse \
#               proxy and IMAP/POP3 proxy server
# processname: nginx
# config:      /etc/nginx/nginx.conf
# config:      /etc/sysconfig/nginx
# pidfile:     /var/run/nginx.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

nginx="/usr/sbin/nginx"
prog=$(basename $nginx)

NGINX_CONF_FILE="/etc/nginx/nginx.conf"

[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginx

lockfile=/var/lock/subsys/nginx

make_dirs() {
   # make required directories
   user=`$nginx -V 2>&1 | grep "configure arguments:.*--user=" | sed 's/[^*]*--user=\([^ ]*\).*/\1/g' -`
   if [ -n "$user" ]; then
      if [ -z "`grep $user /etc/passwd`" ]; then
         useradd -M -s /bin/nologin $user
      fi
      options=`$nginx -V 2>&1 | grep 'configure arguments:'`
      for opt in $options; do
          if [ `echo $opt | grep '.*-temp-path'` ]; then
              value=`echo $opt | cut -d "=" -f 2`
              if [ ! -d "$value" ]; then
                  # echo "creating" $value
                  mkdir -p $value && chown -R $user $value
              fi
          fi
       done
    fi
}

start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    make_dirs
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    configtest || return $?
    stop
    sleep 1
    start
}

reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $nginx -HUP
    RETVAL=$?
    echo
}

force_reload() {
    restart
}

configtest() {
  $nginx -t -c $NGINX_CONF_FILE
}

rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
            ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
esac

```

Then save the file and make it executable:

```
sudo chmod a+x nginx
```

Afterward, you can use the following four commands to start, stop, and restart the Nginx service:

```
service start nginx #开启服务
service stop nginx #停止服务
service restart nginx #重启服务
service reload nginx #重新加载服务
```

> P.S. You can enter the `ps aux|grep nginx` command to check whether the Nginx server is running.

## 4.3 Configure the Blog Website on the Nginx Server

- Locate the Nginx installation directory, which is `/etc/nginx/` by default, and edit the default configuration file:

```
cd /etc/nginx
vim nginx.conf
```

Modify the default configuration as follows. There are three main changes:

```
http {
    server {
        listen       80; ## 改动点1：输入想要监听的端口号
        server_name  www.jalen-qian.com; ##改动点2：填写外网访问博客网站的域名或者外网IP（无域名时）
      
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        root         /usr/local/goPath/src/github.com/blog/public; ##改动点3：输入nginx需要找到博客网站项目的路径，注意是public目录
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

    
}

```

Then restart the service with `service restart nginx`.

# 5. Serve Hugo Through Nginx

Open the blog project's root directory and enter the following command:

```
hugo --theme=even --baseUrl="http:www.jalen-qian.com"
## --theme后面跟的是主题名称，你下载了什么主题，就写对应的名字
## --baseUrl后面是外网通过nginx访问Hugo项目的路径，注意要与上面nginx.conf中的一致
```
# 6. Update the Blog

Updating the blog is simple. You only need to update the `.md` files in the `content/post` directory, and then run
`hugo --theme=even --baseUrl="http:www.jalen-qian.com"` to publish the site again.
