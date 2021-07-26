---
slug: smd
title: SpringBoot-MybatisPlus-Dynamic(多数据源)
author: 杨不易呀
author_title: Java开发工程师
author_url: https://github.com/GenuineYangshuai
description: 多数据源集成
tags: [后端]
---

## 前言

​		基于工作上班累死了。。。打开自己电脑 不知道干些啥 就康康 PL 网站康康 更新了啥

​		咦~~~还挺多  看到了多数据源集成 挺简单的 来玩玩看看

## 简介

dynamic-datasource-spring-boot-starter 是一个基于springboot的快速集成多数据源的启动器。其支持 **Jdk 1.7+, SpringBoot 1.4.x 1.5.x 2.x.x**。

<!-- truncate -->


## 特性

1. 支持 **数据源分组** ，适用于多种场景 纯粹多库 读写分离 一主多从 混合模式。
2. 支持数据库敏感配置信息 **加密** ENC()。
3. 支持每个数据库独立初始化表结构schema和数据库database。
4. 支持 **自定义注解** ，需继承DS(3.2.0+)。
5. 提供对Druid，Mybatis-Plus，P6sy，Jndi的快速集成。
6. 简化Druid和HikariCp配置，提供 **全局参数配置** 。配置一次，全局通用。
7. 提供 **自定义数据源来源** 方案。
8. 提供项目启动后 **动态增加移除数据源** 方案。
9. 提供Mybatis环境下的 **纯读写分离** 方案。
10. 提供使用 **spel动态参数** 解析数据源方案。内置spel，session，header，支持自定义。
11. 支持 **多层数据源嵌套切换** 。（ServiceA >>> ServiceB >>> ServiceC）。
12. 提供对shiro，sharding-jdbc,quartz等第三方库集成的方案,注意事项和示例。
13. 提供 **基于seata的分布式事务方案。** 附：不支持原生spring事务。

## [](https://mybatis.plus/guide/dynamic-datasource.html)约定

1. 本框架只做 **切换数据源** 这件核心的事情，并**不限制你的具体操作**，切换了数据源可以做任何CRUD。
2. 配置文件所有以下划线 `_` 分割的数据源 **首部** 即为组的名称，相同组名称的数据源会放在一个组下。
3. 切换数据源可以是组名，也可以是具体数据源名称。组名则切换时采用负载均衡算法切换。
4. 默认的数据源名称为 **master** ，你可以通过 `spring.datasource.dynamic.primary` 修改。
5. 方法上的注解优先于类上注解。
6. 强烈建议只在service的类和方法上添加注解，不建议在mapper上添加注解。



## 使用方法

1. 引入依赖

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
		     // 多数据源依赖
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
            <version>2.5.5</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.1</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus</artifactId>
            <version>3.4.1</version>
        </dependency>
    </dependencies>
```

2. 配置数据源。

   ```java
   spring:
     datasource:
       dynamic:
         primary: master #设置默认的数据源或者数据源组,默认值即为master
         strict: false #设置严格模式,默认false不启动. 启动后在未匹配到指定数据源时候会抛出异常,不启动则使用默认数据源.
         datasource:
           master:
             url: jdbc:mysql://xxxxxxxx:3310/picture
             username: root
             password: 123456
             driver-class-name: com.mysql.jdbc.Driver ## 3.2.0开始支持SPI可省略此配置
           slave_1:
             url: jdbc:mysql://xxxxxxxx:3310/picture
             username: root
             password: 123456
             driver-class-name: com.mysql.jdbc.Driver
           slave_2:
               url: ENC(xxxxx) ## 内置加密,使用请查看详细文档
               username: ENC(xxxxx)
               password: ENC(xxxxx)
               driver-class-name: com.mysql.jdbc.Driver
               schema: db/schema.sql ## 配置则生效,自动初始化表结构
               data: db/data.sql ## 配置则生效,自动初始化数据
               continue-on-error: true ## 默认true,初始化失败是否继续
               separator: ";" ## sql默认分号分隔符
   
           #......省略
           #以上会配置一个默认库master，一个组slave下有两个子库slave_1,slave_2
   
   
   #mybatisplus的配置
   mybatis-plus:
     configuration:
       log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
     mapper-locations: classpath:mapper/*Mapper.xml
     global-config:
       db-config:
         id-type: auto
   ```

3. 其它配置格式

   ```yml
   ## 多主多从                      纯粹多库（记得设置primary）                   混合配置
   spring:                               spring:                               spring:
     datasource:                           datasource:                           datasource:
       dynamic:                              dynamic:                              dynamic:
         datasource:                           datasource:                           datasource:
           master_1:                             mysql:                                master:
           master_2:                             oracle:                               slave_1:
           slave_1:                              sqlserver:                            slave_2:
           slave_2:                              postgresql:                           oracle_1:
           slave_3:                              h2:                                   oracle_2:
   ```

4. 使用 **@DS** 切换数据源。

   **@DS** 可以注解在方法上和类上，**同时存在方法注解优先于类上注解**。

   强烈建议只注解在service实现上。

   

   

   ## 多数据源的使用 

   |     注解      |                   结果                   |
   | :-----------: | :--------------------------------------: |
   |    没有@DS    |                默认数据源                |
   | @DS("dsName") | dsName可以为组名也可以为具体某个库的名称 |



### 配置多数据源

![image-20201213220017378](http://oss-yby.yangbuyi.top/blog/image-20201213220017378.png)



#### 主数据源(默认)  

###### 省略CRUD代码自己生成一份即可



```java
/**
* ClassName: Loginfo
* Description: 杨不易网站 :www.yangbuyi.top
* date: 2020/12/13
* @author TeouBle
* @author yangbuyi
* @since JDK 1.8
**/

@Service(value = "LoginServiceImpl")
public class LoginServiceImpl extends ServiceImpl<LoginMapper, Login> implements LoginService{
	/**
	 * 主数据库
	 * */
	@Autowired
	private LoginMapper loginMapper;

	@Override
	public List<Login> loginList() {
		return loginMapper.selectList(null);
	}

}
```



#### 从数据源

```java
package top.yangbuyi.service.impl;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.yangbuyi.domain.Login;
import top.yangbuyi.mapper.LoginMapper;
import top.yangbuyi.service.LoginService;

import java.util.List;

/**
 * ClassName: Loginfo
 * Description: 杨不易网站 :www.yangbuyi.top
 * date: 2020/12/13
 *
 * @author TeouBle
 * @author yangbuyi
 * @since JDK 1.8
 **/

@Service(value = "LoginServiceSlaveImpl")
@DS("slave_1") // 从数据源名称
public class LoginServiceSlaveImpl extends ServiceImpl<LoginMapper, Login> implements LoginService {
	@Autowired
	private LoginMapper loginMapper;

	/**
	 * 从数据库
	 * */
	@Override
	public List<Login> loginList() {
		return loginMapper.selectList(null);
	}
}

```



### 最终测试访问同数据库数据

![img](http://oss-yby.yangbuyi.top/blog/427F5%5B%7BYE5WYYRF_KCN~LS8.png)

### [杨不易呀个人博客](https://yangbuyi.top)

#### [数据源文档官方网站](https://mybatis.plus/guide/dynamic-datasource.html)



