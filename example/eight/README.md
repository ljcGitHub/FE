# PM2管理进程
pm2是node进程管理工具，可以简化node应用管理的任务，如性能监控，自动重启，负载均衡等。简单强大的工具。

#### 文档
[官网](http://pm2.keymetrics.io/docs/usage/quick-start/)

[中文文档翻译](https://blog.csdn.net/sunscheung/article/details/79171608)

#### 安装
服务器终端安装pm2
```
npm install -g pm2
```

pm2常用的命令：
```
pm2 start app.js              # 启动app.js应用程序

pm2 start app.js --watch      # 当文件变化时自动重启应用

pm2 list                      # 列表 PM2 启动的所有的应用程序

pm2 monit                     # 显示每个应用程序的CPU和内存占用情况

pm2 logs                      # 显示所有应用程序的日志

pm2 logs [app-name]           # 显示指定应用程序的日志

pm2 stop all                  # 停止所有的应用程序

pm2 stop 0                    # 停止 id为 0的指定应用程序

pm2 restart all               # 重启所有应用
```


#### 运行app.js
上一章是直接用node启动app.js，终端关闭，服务会停止，用pm2启动app.js，服务不会停止，遇到问题会自动重启。

输入命令，启动服务器
```
pm2 start app.js 
```

打开浏览器查看，把远程服务器的终端关闭，浏览器还是能正常访问。

重新连接到远程服务器，输入
```
pm2 list
```
能查看到当前运行的app服务器
```
┌──────┬──────┬────────┬───┬─────┬───────────┐
│ Name │ mode │ status │ ↺ │ cpu │ memory    │
├──────┼──────┼────────┼───┼─────┼───────────┤
│ app  │ fork │ online │ 0 │ 0%  │ 41.4 MB   │
└──────┴──────┴────────┴───┴─────┴───────────┘
```
输入单独关闭这个进程, ↺ 是进程的id
```
pm2 stop 0  
```
服务器正常的关闭，并显示关闭的进程
```
┌──────┬──────┬─────────┬───┬─────┬────────┐
│ Name │ mode │ status  │ ↺ │ cpu │ memory │
├──────┼──────┼─────────┼───┼─────┼────────┤
│ app  │ fork │ stopped │ 0 │ 0%  │ 0 B    │
└──────┴──────┴─────────┴───┴─────┴────────┘
```
