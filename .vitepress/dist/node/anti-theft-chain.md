---
url: /node/anti-theft-chain.md
---
# 防盗链

* 在请求头中添加referer属性，属性值在允许的域名列表中才能访问 :tada:
  ::: details 点击展开代码

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 配置 body-parser 中间件
app.use(bodyParser.json()); // 解析 JSON 格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 防盗链中间件
const refererCheck = (req, res, next) => {
    const referer = req.headers.referer;
    // 允许的域名列表
    const allowedDomains = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    // 如果没有 referer 或者 referer 不在允许列表中
    if (!referer || !allowedDomains.some(domain => referer.startsWith(domain))) {
        return res.status(403).json({
            code: 403,
            message: '禁止访问：非法请求来源'
        });
    }
    
    next();
};

// 应用防盗链中间件到所有路由
app.use(refererCheck);

app.get('/', (req, res) => {
    console.log("请求头", req.headers);
    res.send('Hello World');
});

app.post('/api/v1/user', (req, res) => {
    console.log("请求体", req.body);
    res.send('请求成功！');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

:::
