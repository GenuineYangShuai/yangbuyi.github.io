---
slug: SpringCloud-ConfigServer配置中心
title: SpringCloud-ConfigServer配置中心
author: 杨不易呀
author_title: Java开发工程师
author_url: https://github.com/GenuineYangshuai
author_image_url: https://tvax3.sinaimg.cn/crop.0.0.1080.1080.180/b2745d44ly8g8s4muqeggj20u00u0n0k.jpg?KID=imgbed,tva&Expires=1582389585&ssig=EvXmyu%2FXsX
description: 基于Netfix公司的微服务 配置文件中心讲解!!!! SpringCloud-ConfigServer配置中心
tags: [后端]
---

# 当然第一步还是得要了解啦！

### 介绍

做项目， 那么就少不了配置微服务架构中，配置文件众多，各个服务的配置文件也有可能不一样，
Spring为我们提供了相应的配置中心组件--Spring Cloud config
他是一个配置管理中心，用于集中管理程序中各个环境下的配置，我们可以将配置通过git或svn等方式推送到我们的应用程序
同Eureka一样，他也分为server端与client端

#### 优点

	提供 服务端 和 客户端 支持
	集中式 管理分布式环境下的应用配置
	基于 Spring 环境，无缝 与 Spring 应用集成
	可用于 任何 语言开发的程序
	默认实现基于 git 仓库，可以进行 版本管理
	可替换 自定义实现
	
<!-- truncate -->

### Config

它是SpirngCloud自己开发的

### Spring Cloud Config Server 作为配置中心服务端

	拉取配置时更新 git 仓库副本，保证是最新结果
	支持数据结构丰富，yml, json, properties 等
	配合 eureke 可实现服务发现，配合 cloud bus 可实现配置推送更新
	配置存储基于 git 仓库，可进行版本管理
	简单可靠，有丰富的配套方案



### Spring Cloud Config Client 默认客户端实现

	SpringBoot 项目不需要改动任何代码
	加入一个启动配置文件指明使用 ConfigServer 上哪个配置文件即可



# 初步了解了Config那我们来了解配置--服务端配置



####  创建ConfigServer服务模块

```java
	<!-- 引入配置依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>

        <!-- 注册中心依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
```

#### 配置bootstrap.yml文件

![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200810120553620-1705824122.png)

#### 配置启动注解
![](https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200810120548336-1203978337.png)


# 待更新--- 使用使用远程