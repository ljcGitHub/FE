import Koa from 'koa'

const app = new Koa()

@testable
class MyTestableClass {}
function testable(target) {
  target.isTestable = '我是阮老师的decorators示例';
}
console.log(MyTestableClass.isTestable)

app.listen(3000, () => {
  console.log('koa2 is starting at port 3000')
})