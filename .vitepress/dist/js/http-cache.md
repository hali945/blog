---
url: /js/http-cache.md
---
# HTTP缓存

## 什么是HTTP缓存？

HTTP缓存是一种在客户端或服务器端存储HTTP响应数据的技术，用于减少重复请求，提高网站性能。当用户再次访问相同资源时，可以直接使用缓存的数据，而不需要重新从服务器获取。

## 缓存位置

1. **浏览器缓存**
   * 内存缓存（Memory Cache）
   * 硬盘缓存（Disk Cache）

2. **代理服务器缓存**
   * CDN缓存
   * 反向代理缓存

## 缓存策略

### 1. 强缓存

强缓存不需要向服务器发送请求，直接使用本地缓存。

相关响应头：

* `Expires`：过期时间（HTTP/1.0）
* `Cache-Control`：缓存控制（HTTP/1.1）

```http
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2024 07:28:00 GMT
```

### 2. 协商缓存

协商缓存需要向服务器发送请求，服务器判断资源是否可用。

相关响应头：

* `Last-Modified` / `If-Modified-Since`：基于文件修改时间
* `ETag` / `If-None-Match`：基于文件内容

```http
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

## Cache-Control 指令

### 可缓存性

* `public`：响应可以被任何对象缓存
* `private`：响应只能被单个用户缓存
* `no-cache`：需要向服务器验证缓存是否可用
* `no-store`：不缓存响应

### 过期时间

* `max-age=<seconds>`：设置缓存存储的最大周期
* `s-maxage=<seconds>`：覆盖max-age，仅用于共享缓存
* `max-stale=<seconds>`：客户端愿意接受的最大过期时间

### 重新验证

* `must-revalidate`：过期后必须向服务器验证
* `proxy-revalidate`：要求中间缓存服务器验证

## 缓存流程

1. **首次请求**
   ```
   浏览器 -> 服务器：请求资源
   服务器 -> 浏览器：返回资源 + 缓存策略
   ```

2. **再次请求（强缓存）**
   ```
   浏览器：检查本地缓存是否过期
   未过期：直接使用缓存
   已过期：进入协商缓存
   ```

3. **协商缓存**
   ```
   浏览器 -> 服务器：发送If-Modified-Since/If-None-Match
   服务器：检查资源是否更新
   未更新：返回304 Not Modified
   已更新：返回新资源
   ```

## 最佳实践

### 1. 静态资源缓存策略

```http
# HTML文件
Cache-Control: no-cache

# CSS/JS文件
Cache-Control: max-age=31536000

# 图片等媒体文件
Cache-Control: max-age=31536000
```

### 2. 动态资源缓存策略

```http
# API响应
Cache-Control: no-store, no-cache, must-revalidate
```

### 3. 缓存更新策略

1. 文件名添加版本号或哈希值
2. 使用Service Worker进行缓存控制
3. 合理设置缓存时间

## 常见问题

### 1. 缓存穿透

* 问题：请求不存在的数据，导致缓存失效
* 解决：使用布隆过滤器或缓存空值

### 2. 缓存击穿

* 问题：热点数据过期，导致大量请求直接访问数据库
* 解决：使用互斥锁或永不过期策略

### 3. 缓存雪崩

* 问题：大量缓存同时过期
* 解决：设置随机过期时间

## 调试工具

1. Chrome DevTools
   * Network面板
   * Application面板

2. 命令行工具
   ```bash
   curl -I https://example.com
   ```

## 性能优化建议

1. 合理设置缓存策略
2. 使用CDN加速
3. 实现资源版本控制
4. 监控缓存命中率
5. 定期清理过期缓存
