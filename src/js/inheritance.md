# JavaScript继承

## 1、继承的基本概念

::: info 什么是继承
- 继承是面向对象编程的重要特性
- 子类可以继承父类的属性和方法
- JavaScript通过原型链实现继承
- 继承可以提高代码的复用性
:::

## 2、继承的实现方式

### 2.1 原型链继承
```javascript
function Parent() {
    this.name = '父类';
}

Parent.prototype.sayName = function() {
    console.log(this.name);
};

function Child() {
    this.age = 18;
}

// 设置原型链
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child();
child.sayName(); // '父类'
```

::: warning 原型链继承的缺点
1. 引用类型属性被所有实例共享
2. 创建子类实例时无法向父类构造函数传参
3. 无法实现多继承
:::

### 2.2 构造函数继承
```javascript
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

function Child(name, age) {
    Parent.call(this, name); // 调用父类构造函数
    this.age = age;
}

const child1 = new Child('张三', 18);
const child2 = new Child('李四', 20);

child1.colors.push('green');
console.log(child1.colors); // ['red', 'blue', 'green']
console.log(child2.colors); // ['red', 'blue']
```

::: tip 构造函数继承的优点
1. 避免了引用类型属性被共享
2. 可以向父类构造函数传参
3. 可以实现多继承
:::

### 2.3 组合继承
```javascript
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

Parent.prototype.sayName = function() {
    console.log(this.name);
};

function Child(name, age) {
    Parent.call(this, name); // 构造函数继承
    this.age = age;
}

Child.prototype = new Parent(); // 原型链继承
Child.prototype.constructor = Child;

const child = new Child('张三', 18);
child.sayName(); // '张三'
```

::: info 组合继承的优点
1. 结合了原型链继承和构造函数继承的优点
2. 避免了各自的缺点
3. 是JavaScript中最常用的继承方式
:::

### 2.4 原型式继承
```javascript
function createObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

const parent = {
    name: '父类',
    colors: ['red', 'blue']
};

const child1 = createObject(parent);
const child2 = createObject(parent);

child1.colors.push('green');
console.log(child2.colors); // ['red', 'blue', 'green']
```

### 2.5 寄生式继承
```javascript
function createChild(parent) {
    const child = createObject(parent);
    child.sayHi = function() {
        console.log('Hi');
    };
    return child;
}

const child = createChild(parent);
child.sayHi(); // 'Hi'
```

### 2.6 寄生组合式继承
```javascript
function inheritPrototype(Child, Parent) {
    const prototype = createObject(Parent.prototype);
    prototype.constructor = Child;
    Child.prototype = prototype;
}

function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

Parent.prototype.sayName = function() {
    console.log(this.name);
};

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

inheritPrototype(Child, Parent);

const child = new Child('张三', 18);
child.sayName(); // '张三'
```

## 3、ES6的继承

::: info class继承
- 使用extends关键字实现继承
- 使用super调用父类构造函数
- 更简洁、更易理解
:::

```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
    
    sayName() {
        console.log(this.name);
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
    
    sayAge() {
        console.log(this.age);
    }
}

const child = new Child('张三', 18);
child.sayName(); // '张三'
child.sayAge(); // 18
```

## 4、最佳实践

::: tip 继承相关最佳实践
1. 优先使用ES6的class继承
   - 语法更清晰
   - 更易维护
   - 更符合面向对象编程思想

2. 合理使用组合继承
   - 适用于ES5及以下环境
   - 结合了多种继承方式的优点
   - 避免了各自的缺点

3. 注意继承的层次
   - 避免过深的继承链
   - 保持代码的清晰度
   - 考虑使用组合代替继承
:::

## 5、常见面试题

::: info 继承相关面试题
1. 原型链继承的优缺点？
   - 优点：实现简单，可以继承原型上的方法
   - 缺点：引用类型属性共享，无法传参

2. 组合继承的原理？
   - 结合构造函数继承和原型链继承
   - 使用构造函数继承属性
   - 使用原型链继承方法

3. ES6的class继承和ES5的继承有什么区别？
   - 语法更简洁
   - 必须使用super调用父类构造函数
   - 不存在变量提升
:::

