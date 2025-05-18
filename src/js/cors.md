# 跨域资源共享 (CORS)

## 什么是跨域？

跨域是指浏览器出于安全考虑，限制从一个源（域名、协议或端口）加载的网页去请求另一个源的资源。当请求的 URL 与当前页面的 URL 在以下任何方面不同时，就会发生跨域：

- 协议不同（http vs https）
- 域名不同（example.com vs api.example.com）
- 端口不同（80 vs 8080）

## 同源策略

同源策略（Same-Origin Policy）是浏览器的一个安全机制，它要求：
- 协议相同
- 域名相同
- 端口相同

## CORS 解决方案

### 1. 服务器端配置

#### Node.js Express 示例
```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

### 2. 代理服务器

使用 Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name example.com;

    location /api {
        proxy_pass http://api.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. JSONP（仅支持 GET 请求）

```javascript
function jsonp(url, callback) {
    const script = document.createElement('script');
    script.src = `${url}?callback=${callback}`;
    document.body.appendChild(script);
}

// 使用示例
jsonp('http://api.example.com/data', 'handleResponse');

function handleResponse(data) {
    console.log(data);
}
```

### 4. 使用 CORS 中间件

#### 使用 cors 包（Node.js）
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://example.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 常见问题

### 预检请求（Preflight Request）

对于复杂请求，浏览器会先发送一个 OPTIONS 请求（预检请求），服务器需要正确响应这个请求才能继续实际的请求。

### 携带凭证的请求

如果需要发送带有凭证（如 cookies）的跨域请求，需要：

1. 客户端设置：
```javascript
fetch(url, {
    credentials: 'include'
});
```

2. 服务器端设置：
```javascript
res.header('Access-Control-Allow-Credentials', 'true');
```

## 最佳实践

1. 明确指定允许的源，避免使用 `*`
2. 只允许必要的 HTTP 方法
3. 限制允许的请求头
4. 设置适当的缓存时间
5. 考虑使用代理服务器处理跨域请求

## 安全注意事项

1. 谨慎配置 CORS 策略，避免过度开放
2. 验证 Origin 头信息
3. 使用 HTTPS 进行安全通信
4. 定期审查和更新 CORS 配置