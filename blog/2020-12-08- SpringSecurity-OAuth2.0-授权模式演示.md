---
slug: 2020-12-08-SpringSecurity-OAuth2.0-授权模式演示
title: SpringSecurity-OAuth2.0-授权模式演示
author: 杨不易呀
author_title: Java开发工程师
author_url: https://github.com/GenuineYangshuai
author_image_url: https://tvax3.sinaimg.cn/crop.0.0.1080.1080.180/b2745d44ly8g8s4muqeggj20u00u0n0k.jpg?KID=imgbed,tva&Expires=1582389585&ssig=EvXmyu%2FXsX
description: SpringSecurity-OAuth2.0-授权模式演示 快学起来!!!!!
tags: [后端,前端]
---

# SpringSecurityOauth2架构
# 介绍
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825001246231-515623162.png)

流程：
1. 用户访问,此时没有Token。Oauth2RestTemplate会报错，这个报错信息会被Oauth2ClientContextFilter捕获 并重定向到认证服务器 
2. 认证服务器通过Authorization Endpoint进行授权，并通过AuthorizationServerTokenServices生成授权码并返 回给客户端 
3. 客户端拿到授权码去认证服务器通过Token Endpoint调用AuthorizationServerTokenServices生成Token并返 回给客户端 
4. 客户端拿到Token去资源服务器访问资源，一般会通过Oauth2AuthenticationManager调用 ResourceServerTokenServices进行校验。校验通过可以获取资源。

<!-- truncate -->

# Spring Security Oauth2授权码模式
# 介绍
### 1.客户端进行申请第三方登陆信息
### 2.申请完毕后得到client_id、Client-Secret、回调(申请时自己填入的)
### 3.根据oauth2指定的uri来获取code码(用于获取access_token)

### 请求固定地址
`http://localhost:8080/oauth/authorize?response_type=code&client_id=admin&redirect_uri=https://yangbuyi.top&scope=all`

### 参数介绍
      http://localhost:8080/oauth/authorize --- 固定的请求oauth地址
      response_type=code --- 必须带入的code指定
      client_id=admin --- 申请完毕后的clientID
      redirect_uri=https://yangbuyi.top  --- 成功跳转回调地址
      scope=all   --- 申请的权限范围 

# 进行访问
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002444792-37036677.png)
### 自定义配置的登陆逻辑
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002529892-377586656.png)
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002541902-1063734980.png)

### 登陆成功
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002618132-1284218595.png)
### 您是否授权“管理员”访问您的受保护资源?
#### 我们点击 · APProve · 授权
#### 进行跳转页成功获取到code
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002754038-1108103375.png)
# 获取Access_token

### 我们进行复制下来刚刚的code参数,进行根据code获取 token
`http://localhost:8080/oauth/token` --- 固定的oauth2.0请求地址 

### 开始组装请求参数
{"key":"code","value":"4V3FwH","description":"","type":"text","enabled":true}
{"key":"grant_type","value":"authorization_code","description":"","type":"text","enabled":true},{"key":"client_id","value":"admin","description":"","type":"text","enabled":true},{"key":"redirect_uri","value":"http://www.baidu.com","description":"","type":"text","enabled":true}

![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825002008795-635651626.png)

### 成功获取token

`{
    "access_token": "96700ce5-dcd9-4994-9d7c-6fc6360ccde9", -- token 根据token访问资源服务器当中暴露的接口
    "token_type": "bearer",
    "expires_in": 43199,
    "scope": "all"
}`

# 定义暴露接口
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825003255228-1945548358.png)

## 访问接口获取数据
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200825003337555-277398946.png)

### 参数介绍：
{
    "username": "user", -- 当前登陆授权服务器的用户名称
    "password": "$2a$10$YYUAulOW5xMNj6zDgfR03O9XuOTtNLyH6w3EM1sUGmyd/HxBf5XJi", --- 密码 加密后的
    "authorities": [  
        {
            ---- 权限标识
            "authority": "admin"
        }
    ],
    "enabled": true,
    "accountNonLocked": true,
    "accountNonExpired": true,
    "credentialsNonExpired": true
}
# 总结
从客户端访问指定uri获取code
在根据code访问指定uri获取授权服务器的token
在根据token访问指定uri获取资源服务器暴露接口数据

和第三方QQ。。。等 相似 

# 完结 
