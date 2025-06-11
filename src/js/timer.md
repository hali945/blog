# JavaScript 定时器详解

## 1. 定时器类型

JavaScript 提供了三种主要的定时器机制：

1. **setTimeout()** - 延迟执行
2. **setInterval()** - 循环执行
3. **requestAnimationFrame()** - 动画帧执行

## 2. setTimeout

### 2.1 基本用法
```javascript
// 基本用法
setTimeout(() => {
    console.log('延迟1秒执行');
}, 1000);

// 带参数的用法
setTimeout((name, age) => {
    console.log(`姓名: ${name}, 年龄: ${age}`);
}, 1000, 'John', 25);

// 清除定时器
const timerId = setTimeout(() => {
    console.log('这个不会执行');
}, 2000);
clearTimeout(timerId);
```

### 2.2 特点
- 延迟指定时间后执行一次
- 返回定时器ID，可用于清除定时器
- 可以传递参数给回调函数
- 最小延迟时间约为4ms

## 3. setInterval

### 3.1 基本用法
```javascript
// 基本用法
setInterval(() => {
    console.log('每秒执行一次');
}, 1000);

// 带参数的用法
setInterval((name, age) => {
    console.log(`姓名: ${name}, 年龄: ${age}`);
}, 1000, 'John', 25);

// 清除定时器
const timerId = setInterval(() => {
    console.log('这个会执行5次');
}, 1000);

// 5秒后清除定时器
setTimeout(() => {
    clearInterval(timerId);
}, 5000);
```

### 3.2 特点
- 每隔指定时间重复执行
- 返回定时器ID，可用于清除定时器
- 可以传递参数给回调函数
- 最小间隔时间约为4ms

## 4. requestAnimationFrame

### 4.1 基本用法
```javascript
// 基本用法
function animate() {
    console.log('动画帧执行');
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 清除动画
const requestId = requestAnimationFrame(() => {
    console.log('这个不会执行');
});
cancelAnimationFrame(requestId);
```

### 4.2 特点
- 在下一帧动画时执行
- 与屏幕刷新率同步
- 适合用于动画效果
- 在页面不可见时自动暂停

## 5. 定时器比较

### 5.1 执行时机
- **setTimeout**: 指定延迟后执行一次
- **setInterval**: 每隔指定时间重复执行
- **requestAnimationFrame**: 在下一帧动画时执行

### 5.2 性能比较
- **setTimeout/setInterval**: 
  - 可能不精确，受系统负载影响
  - 最小延迟约为4ms
  - 在页面不可见时仍会执行

- **requestAnimationFrame**: 
  - 与屏幕刷新率同步，更流畅
  - 在页面不可见时自动暂停
  - 更适合动画效果

### 5.3 使用场景
- **setTimeout**: 
  - 延迟执行
  - 一次性操作
  - 简单的定时任务

- **setInterval**: 
  - 定时重复执行
  - 轮询操作
  - 定期更新数据

- **requestAnimationFrame**: 
  - 动画效果
  - 视觉更新
  - 需要流畅的动画

## 6. 注意事项

### 6.1 内存泄漏
- 及时清除不需要的定时器
- 注意闭包中的变量引用
- 在组件卸载时清除定时器

### 6.2 性能优化
- 避免创建过多定时器
- 使用防抖和节流
- 动画优先使用 requestAnimationFrame

### 6.3 精确性
- setTimeout/setInterval 不保证精确时间
- 考虑使用 Date.now() 计算实际延迟
- 注意系统负载对定时器的影响

## 7. 最佳实践

### 7.1 防抖函数
```javascript
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
```

### 7.2 节流函数
```javascript
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

### 7.3 动画帧节流
```javascript
function rafThrottle(func) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}
```

## 8. 实际应用示例

### 8.1 倒计时
```javascript
function countdown(seconds) {
    const timer = setInterval(() => {
        console.log(`剩余时间: ${seconds}秒`);
        if (seconds <= 0) {
            clearInterval(timer);
            console.log('倒计时结束');
        }
        seconds--;
    }, 1000);
}
```

### 8.2 动画效果
```javascript
function animate() {
    let position = 0;
    function move() {
        position += 1;
        console.log(`位置: ${position}`);
        if (position < 100) {
            requestAnimationFrame(move);
        }
    }
    requestAnimationFrame(move);
}
```

### 8.3 轮询
```javascript
function poll() {
    const timer = setInterval(async () => {
        try {
            const response = await fetch('api/data');
            const data = await response.json();
            console.log('数据更新:', data);
        } catch (error) {
            console.error('轮询错误:', error);
            clearInterval(timer);
        }
    }, 5000);
}
```

## 9. 调试技巧

### 9.1 监控定时器
```javascript
let timerCount = 0;
const originalSetTimeout = window.setTimeout;
window.setTimeout = function() {
    timerCount++;
    console.log(`Active timers: ${timerCount}`);
    return originalSetTimeout.apply(this, arguments);
};
```

### 9.2 使用 Chrome DevTools
- Performance 面板监控定时器
- Memory 面板检查内存泄漏
- Console 面板查看定时器日志

## 10. 总结

JavaScript 定时器是异步编程的重要工具，合理使用可以：
- 实现延迟执行
- 创建循环任务
- 优化动画效果
- 处理异步操作

注意事项：
- 及时清除定时器
- 避免内存泄漏
- 考虑性能影响
- 选择合适的使用场景

## 11. 定时器参数简写与this指向

### 11.1 参数简写形式
```javascript
// 1. 直接传入函数名
function sayHello() {
    console.log('Hello');
}
setTimeout(sayHello, 1000);  // 正确
setTimeout(sayHello(), 1000); // 错误：会立即执行

// 2. 使用字符串（不推荐）
setTimeout('console.log("Hello")', 1000);  // 不推荐，有安全风险

// 3. 使用对象方法
const obj = {
    name: 'John',
    sayName() {
        console.log(this.name);
    }
};
setTimeout(obj.sayName, 1000);  // 注意：this指向会改变
```

### 11.2 this指向问题

#### 11.2.1 普通函数中的this
```javascript
// 1. 全局作用域
function test() {
    console.log(this);  // 浏览器中指向window，Node中指向global
}
setTimeout(test, 1000);

// 2. 对象方法
const obj = {
    name: 'John',
    sayName() {
        console.log(this.name);  // undefined，this指向window/global
    }
};
setTimeout(obj.sayName, 1000);

// 3. 使用bind保持this指向
const obj2 = {
    name: 'John',
    sayName() {
        console.log(this.name);  // 'John'
    }
};
setTimeout(obj2.sayName.bind(obj2), 1000);
```

#### 11.2.2 箭头函数中的this
```javascript
// 1. 全局作用域
const test = () => {
    console.log(this);  // 指向外层作用域的this
};
setTimeout(test, 1000);

// 2. 对象方法
const obj = {
    name: 'John',
    sayName: () => {
        console.log(this.name);  // 指向外层作用域的this
    }
};
setTimeout(obj.sayName, 1000);

// 3. 类方法
class Person {
    constructor(name) {
        this.name = name;
    }
    sayName = () => {
        console.log(this.name);  // 正确指向实例
    }
}
const person = new Person('John');
setTimeout(person.sayName, 1000);  // 'John'
```

### 11.3 保持this指向的方法

#### 11.3.1 使用bind
```javascript
const obj = {
    name: 'John',
    sayName() {
        console.log(this.name);
    }
};
setTimeout(obj.sayName.bind(obj), 1000);  // 'John'
```

#### 11.3.2 使用箭头函数
```javascript
const obj = {
    name: 'John',
    sayName() {
        setTimeout(() => {
            console.log(this.name);  // 'John'
        }, 1000);
    }
};
obj.sayName();
```

#### 11.3.3 使用变量保存this
```javascript
const obj = {
    name: 'John',
    sayName() {
        const self = this;
        setTimeout(function() {
            console.log(self.name);  // 'John'
        }, 1000);
    }
};
obj.sayName();
```

### 11.4 最佳实践

1. **优先使用箭头函数**
   - 自动绑定外层this
   - 代码更简洁
   - 避免this指向问题

2. **使用bind明确绑定**
   - 明确指定this指向
   - 提高代码可读性
   - 便于调试

3. **避免使用字符串参数**
   - 有安全风险
   - 性能较差
   - 不利于代码维护

4. **注意回调函数执行时机**
   - 函数名作为参数时不要加括号
   - 确保参数传递正确
   - 注意执行顺序