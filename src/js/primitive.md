# JavaScript 对象转原始值及隐式转换详解

## 1. 对象到原始值的转换

在 JavaScript 中，当对象需要被转换为原始值（数字、字符串或布尔值）时，会遵循特定的转换规则。

### 1.1 转换方法

对象到原始值的转换主要通过以下三个方法实现：

1. `toString()`
2. `valueOf()`
3. `Symbol.toPrimitive`（ES6新增）

### 1.2 转换规则

#### 1.2.1 默认转换规则

当对象需要转换为原始值时，JavaScript 引擎会按照以下顺序尝试转换：

1. 如果存在 `Symbol.toPrimitive` 方法，优先调用
2. 否则，根据目标类型：
   - 转换为字符串：先调用 `toString()`，如果返回原始值则使用；否则调用 `valueOf()`
   - 转换为数字：先调用 `valueOf()`，如果返回原始值则使用；否则调用 `toString()`
   - 转换为默认类型：先调用 `valueOf()`，如果返回原始值则使用；否则调用 `toString()`

#### 1.2.2 Symbol.toPrimitive 方法

```javascript
const obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
    }
  }
};
```

## 2. 隐式类型转换

### 2.1 算术运算符转换

#### 2.1.1 加法运算符 (+)

- 如果任一操作数是字符串，则进行字符串拼接
- 否则，将操作数转换为数字进行加法运算

```javascript
"2" + 2    // "22"
2 + "2"    // "22"
2 + 2      // 4
```

#### 2.1.2 其他算术运算符 (-, *, /, %)

- 将操作数转换为数字进行运算

```javascript
"2" - 2    // 0
"2" * 2    // 4
"2" / 2    // 1
```

### 2.2 比较运算符转换

#### 2.2.1 相等运算符 (==)

- 如果操作数类型相同，直接比较
- 如果操作数类型不同，进行类型转换后比较
- null 和 undefined 相等
- 对象与原始值比较时，对象会被转换为原始值

```javascript
null == undefined    // true
"2" == 2            // true
[2] == 2            // true
```

#### 2.2.2 严格相等运算符 (===)

- 不进行类型转换，直接比较值和类型

```javascript
"2" === 2           // false
null === undefined  // false
```

### 2.3 逻辑运算符转换

#### 2.3.1 逻辑非 (!)

- 将操作数转换为布尔值后取反

```javascript
!""        // true
!"hello"   // false
!0         // true
!1         // false
```

#### 2.3.2 逻辑与 (&&) 和逻辑或 (||)

- 返回第一个能决定结果的表达式的值
- 不会将结果转换为布尔值

```javascript
"hello" && "world"  // "world"
"" || "default"     // "default"
```

## 3. 常见转换陷阱

### 3.1 数组转换

```javascript
[] + []     // ""
[] + {}     // "[object Object]"
{} + []     // 0
{} + {}     // NaN
```

### 3.2 对象转换

```javascript
const obj = {
  toString() {
    return "2";
  },
  valueOf() {
    return 1;
  }
};

obj + 2     // 3
String(obj) // "2"
```

### 3.3 日期对象转换

```javascript
const date = new Date();
date.toString()     // "Wed Mar 13 2024 10:00:00 GMT+0800"
date.valueOf()      // 1710295200000
```

## 4. 最佳实践

1. 优先使用严格相等运算符 (===)
2. 显式类型转换优于隐式转换
3. 使用 `Number()`, `String()`, `Boolean()` 进行显式转换
4. 在对象中实现 `Symbol.toPrimitive` 方法以获得更好的控制
5. 注意运算符优先级和结合性

## 5. 总结

JavaScript 的类型转换机制虽然灵活，但也容易导致意外的结果。理解这些转换规则对于编写可预测和可维护的代码至关重要。在实际开发中，应该：

- 明确代码意图，避免依赖隐式转换
- 使用适当的类型检查
- 在必要时进行显式类型转换
- 注意边界情况和特殊值
