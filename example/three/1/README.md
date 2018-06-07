## 3.模型(一)
本文推荐数据库为mysql，ORM采用(Sequelize)[https://github.com/sequelize/sequelize]

#### 数据库安装
mysql 请自行查阅网上的安装教程，傻瓜式安装。

(本文不分配角色，用root链接mysql)


命令行执行(使用sequelize，必须依赖mysql2)
```
npm i -S sequelize mysql2
```
新建config文件夹，新建config.js
```
const config = {
  dialect: 'mysql',
  database: 'lmq',
  username: 'root',
  password: '123456',
  host: '127.0.0.1', 
  port: 3306
};

export default config
```













