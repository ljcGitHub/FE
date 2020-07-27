# vue+Mocha+chai进行单元测试

## 翻阅的资料
- [Mocha.js官网](https://mochajs.org/) 
- [Mocha.js翻译](https://www.jianshu.com/p/9c78548caffa) 
- [vue-test-utils](https://vue-test-utils.vuejs.org/zh/) 
- [阮一峰-Mocha 实例教程
](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html) 

----


###基于Vue组件做单元测试
推荐用** vue-cli** ([安装地址](https://cli.vuejs.org/zh/guide/installation.html))
1.选择 ** Manually select features** ，空格选有** Unit Testing** 
2.然后在选eslint那些选项之后，其中选项 ** Pick a unit testing solution** ，选**Mocha + Chai** 

----


###编写首个TDD(测试驱动开发,Test-Driven Development)
在 `/tests/unit` 中，默认创建一个 example.spec.js
```
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
```
上面例子测试策略为：
1. 用 `shallowMount` 渲染组件(也可以由`mount`渲染)
2. 断言组件的文本内容，是否包含msg

`describe`和`it`由 Mocha 提供，describe类似一组测试内容，it是测试用例。
```
  HelloWorld.vue
    ✓ renders props.msg when passed (21ms)
```
 
 ### 断言库的使用
 `expect(wrapper.text()).to.include(msg)`
 
 "断言"，就是判断代码的实际执行结果与预期结果是否一致，如果不一致就抛出一个错误。
 
 上面这句断言的意思是，就是判断组件传递参数msg，组件渲染的文本是否包含msg。


----
#### mocha + chai 基本用法
##### 使用例子
```
// 相等或不相等
expect(4 + 5).to.be.equal(9);
expect(4 + 5).to.be.not.equal(10);
expect(foo).to.be.deep.equal({ bar: 'baz' });

// 布尔值为true
expect('everthing').to.be.ok;
expect(false).to.not.be.ok;

// typeof
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
expect(foo).to.be.an.instanceof(Foo);

// include
expect([1,2,3]).to.include(2);
expect('foobar').to.contain('foo');
expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');

// empty
expect([]).to.be.empty;
expect('').to.be.empty;
expect({}).to.be.empty;

// match
expect('foobar').to.match(/^foo/);
```
##### 钩子函数
```
describe('hooks', function () {
	  before(function () {
		// 在这个作用域的所有测试用例运行之前运行
	  })

	  after(function () {
		// 在这个作用域的所有测试用例运行完之后运行
	  })

	  beforeEach(function () {
		// 在这个作用域的每一个测试用例运行之前运行
	  })

	  afterEach(function () {
		// 在这个作用域的每一个测试用例运行之后运行
	  })
})
```

----

#### 测试 Props

修改`/tests/unit/example.spec.js` 
```javascript
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
	it('renders props.msg when passed', async () => {
	const msg = 'new message'
	const wrapper = shallowMount(HelloWorld, {
		propsData: { msg }
	})
	expect(wrapper.text()).to.include(msg)
	const msg2 = 'new message2'
	wrapper.setProps({ msg: msg2 })
	await wrapper.vm.$nextTick()
	expect(wrapper.text()).to.include(msg2)
  })
})
```
主要通过传入propsData和设置propsData，来检验props是否传递，更新视图是否成功

----

#### 测试 Computed
修改`src/components/HelloWorld` ,新增计算属性和模板
```
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <span>msg的长度：{{ strLength }}</span>
  </div>
</template>
```
```
  computed: {
    strLength () {
      if (!this.msg) return 0
      return this.msg.length
    }
  }
  ```
 Vue 的 computed，就是一个函数，根据函数特征，可以用** Call ** 传递自定义的this测试。
 
修改`/tests/unit/example.spec.js` 
```
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
	it('get computed of strLength value', () => {
		const msg = 'new message'
		const dp = { msg } // 自定义this的环境 
		expect(HelloWorld.computed.strLength.call(dp)).to.be.equal(msg.length)
	})
})
```
除了通过Call，也可以按常用`shallowMount/mount`，挂载组件进行判断，新增个用例
```javascript
	it('renders computed of strLength', () => {
		const msg = 'new message'
		const wrapper = shallowMount(HelloWorld, { propsData: { msg } })
		expect(wrapper.find('span').text()).to.be.equal(`msg的长度：${msg.length}`)
	})
```
用例的`find`和`text` ，都是vue-test-utils提供的方法，请自行查阅，过一篇api就大概知道有哪些方法，等编写用例的时候，可以用这些方法获取挂载之后的元素进行判断。


#### 模拟用户输入
修改`src/components/HelloWorld` 
```html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input class="username" v-model="username">
      <input type="submit" value="提交">
    </form>
    <div class="message"  v-if="submitted">
      Thank you for your submission, {{ username }}.
    </div>
  </div>
</template>
```
```javascript
<script>
export default {
  data() {
    return {
      username: '',
      submitted: false
    }
  },
  methods: {
    handleSubmit () {
      this.submitted = true
    }
  }
}
</script>
```
编写用例，思路是实例组件，对表单赋值，提交，然后查看内容是否和预期一致。
修改`/tests/unit/example.spec.js` 
```
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('reveals a notification when submitted', async () => {
    const wrapper = shallowMount(HelloWorld)
    const username = 'handsomeBoy'
    wrapper.find('.username').setValue(username)
    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.message').text()).to.be.equal(`Thank you for your submission, ${username}.`)
  })
})
```
设置了 username 并使用了 vue-test-utils 提供的 trigger 方法以简化用户输入。trigger 对自定义事件起作用，也包括使用了修饰符的事件，如 submit.prevent、keydown.enter 等等。

#### mocks对象
`vue-test-utils `为实例添加额外的属性。在伪造全局注入的时候有用。是一种将任何属性附加到 Vue.prototype 上的方式。这通常包括：
* `$store`, 对于 Vuex
* `$router`, 对于 Vue Router
* `$t`, 对于 vue-i18n

以及其他种种。



以`$route`示例
```
const $route = { path: 'http://www.example-path.com' }
const wrapper = shallowMount(Component, {
  mocks: {
    $route
  }
})
expect(wrapper.vm.$route.path).to.be.equal($route.path)
```

