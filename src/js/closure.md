# 闭包

## 什么是闭包？

闭包（Closure）是指一个函数可以访问其被创建时所在的词法作用域，即使该函数在其他地方被调用。简单来说，闭包就是`函数`和声明该函数的`词法环境`的组合。


## 闭包的特点

1. 函数嵌套
2. 内部函数可以访问外部函数的变量
3. 外部函数的变量会被保存在内存中

## 闭包的作用

1. 数据私有化
2. 保持数据在内存中
3. 模块化开发

## 示例代码

### 基础示例

```javascript
function outer() {
    let count = 0;
    
    function inner() {
        count++;
        console.log(count);
    }
    
    return inner;
}

const counter = outer();
counter(); // 输出: 1
counter(); // 输出: 2
counter(); // 输出: 3
```

### 私有变量示例

```javascript
function createCounter() {
    let privateCount = 0;
    
    return {
        increment() {
            privateCount++;
            return privateCount;
        },
        decrement() {
            privateCount--;
            return privateCount;
        },
        getCount() {
            return privateCount;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
```

### 模块化示例

```javascript
const module = (function() {
    let private = '私有变量';
    
    function privateMethod() {
        console.log(private);
    }
    
    return {
        publicMethod() {
            privateMethod();
        }
    };
})();

module.publicMethod(); // 输出: 私有变量
```

::: danger 闭包导致内存泄漏的场景

- 有本该被回收的函数没有回收，从而导致其关联的词法环境也无法被回收，最终导致内存泄漏

- 当多个函数共享一个词法环境时，可能会造成词法环境的膨胀，从而导致出现无法访问且无法回收的内存空间
:::
## 注意事项

1. 内存泄漏：过度使用闭包可能导致内存泄漏，因为闭包会保持对外部变量的引用
2. 性能影响：闭包会占用更多的内存空间
3. 变量共享：多个闭包共享同一个外部变量时需要注意数据同步问题

## 最佳实践

1. 及时释放不需要的闭包
2. 避免在循环中创建闭包
3. 合理使用闭包，不要过度使用
4. 注意闭包中变量的作用域

## 常见应用场景

1. 事件处理
2. 模块化开发
3. 函数工厂
4. 数据缓存
5. 防抖和节流

