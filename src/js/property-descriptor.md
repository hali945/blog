# JavaScript 属性描述符（Property Descriptor）详解

## 定义

属性描述符（Property Descriptor）是 JavaScript 用于描述对象属性的元信息的对象。通过属性描述符，可以精确控制属性的行为，如是否可枚举、可写、可配置等。

属性描述符分为两类：
- **数据描述符（Data Descriptor）**：描述属性的值（value）和可写性（writable）。
- **访问器描述符（Accessor Descriptor）**：描述属性的 getter/setter。

常见属性：
- `value`：属性的值
- `writable`：是否可写
- `enumerable`：是否可枚举
- `configurable`：是否可配置
- `get`：getter 函数
- `set`：setter 函数

## 获取和定义属性描述符

### 获取属性描述符
```javascript
const obj = { a: 1 };
const desc = Object.getOwnPropertyDescriptor(obj, 'a');
console.log(desc);
// { value: 1, writable: true, enumerable: true, configurable: true }
```

### 定义/修改属性描述符
```javascript
const obj = {};
Object.defineProperty(obj, 'a', {
  value: 42,
  writable: false,
  enumerable: false,
  configurable: false
});
```

## 使用场景

### 1. 控制属性的可写性
```javascript
const user = {};
Object.defineProperty(user, 'id', {
  value: 1001,
  writable: false // 只读
});
user.id = 2002;
console.log(user.id); // 1001
```

### 2. 控制属性的可枚举性
```javascript
const obj = {};
Object.defineProperty(obj, 'secret', {
  value: 'hidden',
  enumerable: false
});
console.log(Object.keys(obj)); // []
```

### 3. 控制属性的可配置性
```javascript
const obj = {};
Object.defineProperty(obj, 'a', {
  value: 1,
  configurable: false
});
delete obj.a; // 删除失败
console.log(obj.a); // 1
```

### 4. 定义 getter/setter
```javascript
const person = {};
let _age = 18;
Object.defineProperty(person, 'age', {
  get() {
    return _age;
  },
  set(val) {
    if (val > 0) _age = val;
  }
});
person.age = 25;
console.log(person.age); // 25
```

### 5. 批量定义属性
```javascript
const obj = {};
Object.defineProperties(obj, {
  a: { value: 1, writable: true },
  b: { value: 2, writable: false }
});
```

## 注意事项

1. **数据描述符和访问器描述符不能混用**：同一个属性不能同时拥有 `value/writable` 和 `get/set`。
2. **默认值**：通过 `Object.defineProperty` 定义的属性，`writable`、`enumerable`、`configurable` 默认都是 `false`。
3. **不可配置属性不可再次修改描述符**：`configurable: false` 后，除了 `writable` 可以从 `true` 改为 `false`，其他描述符都不能再更改。
4. **继承链无效**：`Object.getOwnPropertyDescriptor` 只获取自有属性，不会查找原型链。
5. **严格模式下报错**：对只读属性赋值、删除不可配置属性等，在严格模式下会抛出错误。

## 妙用之处

### 1. 实现只读/常量属性
```javascript
Object.defineProperty(obj, 'PI', {
  value: 3.14159,
  writable: false,
  configurable: false
});
```

### 2. 隐藏属性（不可枚举）
```javascript
Object.defineProperty(obj, '_internal', {
  value: 'secret',
  enumerable: false
});
```

### 3. 数据劫持/响应式
```javascript
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      return val;
    },
    set(newVal) {
      console.log('set', key, newVal);
      val = newVal;
    }
  });
}
const data = {};
defineReactive(data, 'msg', 'hello');
data.msg = 'world'; // set msg world
console.log(data.msg); // get msg
```

### 4. 模拟私有属性
```javascript
function Person(name) {
  let _name = name;
  Object.defineProperty(this, 'name', {
    get() {
      return _name;
    },
    set(val) {
      if (val) _name = val;
    }
  });
}
const p = new Person('Tom');
console.log(p.name); // Tom
```

### 5. 防篡改对象
```javascript
Object.defineProperty(obj, 'id', {
  value: 123,
  writable: false,
  configurable: false
});
```

## 总结

属性描述符是精细控制对象属性行为的利器。通过合理使用，可以实现只读、隐藏、响应式、私有等多种高级特性，是底层框架和库实现的基础。
