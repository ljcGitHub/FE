## 初始化数据
开发的时候，总需要提供测试的数据，保证数据正确

database文件夹目录下，新建data-init文件夹

新建 data-init/user.js
```
// 用户
export const user = [
  {
    id: 101,
    account: 'beiji',
    password: '$2a$10$7kKcGG94P2WlBMB49fAmluyJgky0F8sopeDLVYde25ueO3V1J2pNu',
    name: '张三',
    portraits: '',
    note: ''
  }
]
```
新建 data-init/index.js  统一管理数据
```
export { user } from './user'
```

修改 database/init-db.js ， 新增初始化数据的函数
```
import models from '../models'
import * as data from './data-init'

models.sync().then(res => {
  console.log('init db success！')
  initData()
}).catch(error => {
  throw new Error(error)
})

const initData = async function () {
  try {
    for (let m of Object.keys(data)) {
      if (models[m]) {
        await models[m].bulkCreate(data[m], { ignoreDuplicates: true })
        console.log(`Table ${m} data initial success!`)
      }
    }
  } catch (err) {
    throw new Error(err);
  }
  process.exit()
}

console.log('please wait for init db')

```

执行命令 npm run dbInit , 能看到控制台打印的信息
```
please wait for init db
Executing (default): DROP TABLE IF EXISTS `user`;
Executing (default): DROP TABLE IF EXISTS `user`;
Executing (default): CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER(11) NOT NULL auto_increment , `account` VARCHAR(20), `password` VARCHAR(255), `name` VARCHAR(255), `portraits` VARCHAR(255), `note` VARCHAR(255), PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
Executing (default): SHOW INDEX FROM `user`
To initialize the database successfully
init db success！
Executing (default): INSERT IGNORE INTO `user` (`id`,`account`,`password`,`name`,`portraits`,`note`) VALUES (101,'beiji','$2a$10$KTibVOcxQqAe19951NJfBe11qJBFPwRKPrprpcaMPB5a63/BHpBkW','张三','','');
Table user data initial success!
```

1. 打开navicat 查看user表，能看到刚插入的数据


2. 或者 启动服务器，请求用户数据

输入下面参数, 配置请求头的参数
- url: http://localhost:3000/api/getUser?userid=1
- method: get
- headers: {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6bnVsbCwiaWF0IjoxNTI4ODE2NjM5LCJleHAiOjE1Mjk0MjE0Mzl9.EdBZSMDGJ9_APqMQS54oEFap7ezBv8ecZ9Iu699keco"}