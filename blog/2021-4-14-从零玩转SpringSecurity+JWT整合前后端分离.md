---
slug: SpringSecurityAndJwt
title: 从零玩转SpringSecurity+JWT整合前后端分离
author: 杨不易呀
author_title: Java开发工程师
author_url: https://github.com/GenuineYangshuai
description: 从零玩转SpringSecurity+JWT整合前后端分离
author_image_url: https://img2020.cnblogs.com/blog/1735255/202008/1735255-20200821211621285-960805374.png
tags: [后端,JWT,SpringSecurity]
---

# 从零玩转SpringSecurity+JWT整合前后端分离

## 一、什么是Jwt?

**Json web token (JWT)**, 是为了在网络应用环境间传递声明而执行的一种基于 JSON 的开放标准 

（(RFC 7519).该 token 被设计为**紧凑且安全**的，特别适用于**分布式站点的单点登录（SSO）场景**。 

JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服 

务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该 token 也可直接被用于 

认证，也可被加密。

官网：https://jwt.io/introduction/

简单的说:jwt就是一个json字符串 它可以存储任何信息。

内置了校验-我们只需要请求时给到它生产出来的token令牌即可解析到我们存储进去的信息。

<!-- truncate -->


### 1.创建jwtDemo Maven工程

![image-20210408165757706](./img/image-20210408165757706.png)

```yaml
 <!-- 添加 jwt 的依赖 -->
        <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>3.11.0</version>
        </dependency>
```


### 2.创建jwtTest.class

```java
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * ClassName: JwtTest
 * 个人博客: https://yangbuyi.top
 * @author yangbuyiya
 * @Date: 2021-03-25 10:05
 * @Description: $
 **/
public class JwtTest {

    /**
     * 加密jwt
     *
     * @param username
     * @return
     */
    public static String createJwt(String username) {
        // 颁发时间
        Date createTime = new Date();
        // 过期时间
        Calendar now = Calendar.getInstance();
        // 设置未来时间 秒
        now.set(Calendar.SECOND, 7200);
        Date expireTime = now.getTime();
        // header
        Map<String, Object> header = new HashMap<>(4);
        header.put("alg", "HS256");
        header.put("type", "JWT");
        // 载体
        return JWT.create()
                // 设置头部信息
                .withHeader(header)
                // 设置创建时间
                .withIssuedAt(createTime)
                // 设置过期时间
                .withExpiresAt(expireTime)
                // 设置主体
                .withSubject("这是一个JWT")
                // 设置载荷--也就是用户信息
                .withClaim("username", username)
                .withClaim("pwd", "123456")
                // 设置签名密钥
                .sign(Algorithm.HMAC256("yby-jwt"));
    }

    /**
     * 解密jwt
     *
     * @param jwt
     * @return
     */
    public static boolean decryptJwt(String jwt) {
        // 带入密钥解密
        JWTVerifier require = JWT.require(Algorithm.HMAC256("yby-jwt")).build();
        try {
            DecodedJWT verify = require.verify(jwt);
            // 根据设置的key获取对应的value
            Claim username = verify.getClaim("username");
            System.out.println(username.asString());
            System.out.println(verify.getSignature());
            System.out.println(verify.getSubject());
            return true;
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void main(String[] args) {
        // 创建令牌
        System.out.println(createJwt("杨不易"));
       
 // 解析令牌       System.out.println(decryptJwt("eyJ0eXAiOiJKV1QiLCJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiLov5nmmK_kuIDkuKpKV1QiLCJleHAiOjE2MTcwODAyMjAsInB3ZCI6IjEyMzQ1NiIsImlhdCI6MTYxNzA3MzAzMSwidXNlcm5hbWUiOiLmnajkuI3mmJMifQ.GJOeFSVsAwFPcgUlalmxVXt0QQ-Be5bhGUtL1ep04vM"));
    }
}
```

### 3.测试jwt

创建令牌

![image-20210408164516157](./img/image-20210408164516157.png)

解析令牌信息

![image-20210408164641576](./img/image-20210408164641576.png)



#### 4.JWT的总结

JWT就是一个加密的带用户信息的字符串，没学习JWT之前，我们在项目中都是返回一个基本的

字符串，然后请求时带上这个字符串，再从session或者redis中（共享session）获取当前用户，

学过JWT以后我们可以把用户信息直接放在字符串返回给前段，然后用户请求时带过来，我们是在

服务器进行解析拿到当前用户，这就是两种登录方式，这两种方式有各自的优缺点，我们在后面

Oauth2.0+jwt中详细学习





## 二、什么是SpringSecurity?

Spring Security 是一个能够为基于 Spring 的企业应用系统提供声明式的安全访问控制解决方案 的安全框架。它提供了一组可以在 Spring 应用上下文中配置的 Bean，充分利用了 Spring IoC， DI（控制反转 Inversion of Control ,DI:Dependency Injection 依赖注入）和 AOP（面向切 面编程）功能，为应用系统提供声明式的安全访问控制功能，减少了为企业系统安全控制编写大量 重复代码的工作。 以上解释来源于百度百科。可以一句话来概括，SpringSecurity 是一个安全框架。



### 1.Spring Security 入门体验

#### 创建项目 springsecurity-hello

![image-20210408170254199](./img/image-20210408170254199.png)



#### 创建Controller请求访问

![image-20210408170650072](./img/image-20210408170650072.png)

#### 启动测试访问

####  http://127.0.0.1:8080/hello 

#### 发现我们无法访问 hello 这个请求，这是因为 spring Security 默认拦截了所有请求

![image-20210408170735306](./img/image-20210408170735306.png)

#### 我们在启动日志当中复制密码

![image-20210408170802657](./img/image-20210408170802657.png)

#### 用户名默认是 user 哦

![image-20210408170834997](./img/image-20210408170834997.png)

#### 登录成功之后访问 controller 

​	![image-20210408171302549](./img/image-20210408171302549.png)



#### 测试退出

页面当中输入： http://127.0.0.1:8080/logout  

![image-20210408171039986](./img/image-20210408171039986.png)





#### 自定义密码登录（yml 配置文件方式）



```yaml
spring:
  security:
   user:
   name: admin #默认使用的用户名
   password: 123456 #默认使用的密码
```

重启使用 admin 和 123456 登录即可



#### 总结 

从上面的体验来说，是不是感觉很简单，但是别急。后面的东西还是有点难度的，

如下：

如何读取数据库的用户名和密码 

如何对密码加密 

如何使用数据的角色和权限 

如何配置方法级别的权限访问

如何自定义登陆页面

如何集成 redis 把登陆信息放到 Redis

.............................



### 2.Spring Security 配置多用户认证

#### 概述

认证就是登陆，我们现在没有连接数据库，那么我们可以模拟下用户名和密码

```java
/**
 * @Author 杨不易呀
 * web 安全的配置类
 * <p>
 * WebSecurityConfigurerAdapter   web安全配置的适配器
 */
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter 
{


    /**
     * 配置认证(用户)管理 模拟内存用户数据
	* 重点说明：
	* 在开发中，我们一般只针对权限，很少去使用角色
	* 后面的讲解中我们以权限为主也就是 authorities 这里面的东西
     * @param auth
     * @throws Exception
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 在内存中创建了两个用户
        // 注意点： 我们添加了安全配置类，那么我们在 yml 里面的用户密码配置就失效了
        auth.inMemoryAuthentication()
                .withUser("yby") // 用户名
                .password("yby") // 密码 
                .roles("ADMIN_yby") // 给了一个角色
                .authorities("sys:add", "sys:update", "sys:delete", "sys:select") 
                // 注意点：给yby用户四个权限 如果权限和角色都给了 那么角色就失效了
                .and()
                .withUser("test")
                .password("test")
                .roles("TEST")
                .authorities("sys:select") // 加了一个权限
        ;
    }
}
```





#### 1.启动测试

使用yby/yby登录访问 可以发现 控制台报错了

![image-20210408172056590](./img/image-20210408172056590.png)

这个是因为 spring Sercurity 强制要使用密码加密，当然我们也可以不加密，但是官方要求是不 管你是否加密，都必须配置一个类似 Shiro 的凭证匹配器

#### 2.添加密码加密器

```java
    /**
     * 给容器中放一个加密器 springSecurity5.x之后推荐使用加密
     * 也可以不给加密
     * new NoOpPasswordEncoder()
     * 这个加密器对同一个值加密后 会得到不同的结果
     * 只要是用同一个加密器加密的 解密也是一样的
     *
     * @return
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
```



#### 3.修改用户配置

```java
 // 在内存中创建了两个用户
 // 注意点： 我们添加了安全配置类，那么我们在 yml 里面的用户密码配置就失效了
        auth.inMemoryAuthentication()
                .withUser("yby") // 用户名
                .password(passwordEncoder().encode("yby") // 密码 
                .roles("ADMIN_yby") // 给了一个角色
                .authorities("sys:add", "sys:update", "sys:delete", "sys:select") 
                // 注意点：给yby用户四个权限 如果权限和角色都给了 那么角色就失效了
                .and()
                .withUser("test")
                .password(passwordEncoder().encode("test")
                .roles("TEST")
                .authorities("sys:select")
        ;
```

#### 4.重启测试

两个用户都可以登录成功l了 恭喜恭喜！！！！



#### 5.测试加密和解密 demo

```java
public class TestPasswordEncoder {
public static void main(String[] args) {
BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
String encode1 = passwordEncoder.encode("123");
System.out.println(encode1);
String encode2 = passwordEncoder.encode("123");
System.out.println(encode2);
String encode3 = passwordEncoder.encode("123");
System.out.println(encode3);
// 查看加密后是否匹配
System.out.println(passwordEncoder.matches("123", encode1));
System.out.println(passwordEncoder.matches("123", encode2));
System.out.println(passwordEncoder.matches("123", encode3));
}
}
```

查看控制台发现特点是：相同的字符串加密之后的结果都不一样，但是比较的时候是一样的，这个 算法比 shiro 的 MD5 好用，不用自己在数据库去存盐了

![image-20210408172622024](./img/image-20210408172622024.png)



### 3.如何获取当前登录用户的信息（两种方式）

#### 1.往HelloController添加请求

```java
/**
* 获取当前用户信息，直接在参数中注入 Principal 对象
* 此对象是登录后自动写入 UsernamePasswordAuthenticationToken 类中
*
* @param principal
* @return
*/
@GetMapping("userInfo")
public Principal getUserInfo(Principal principal) {
return principal;
}
/**
* SecurityContextHolder.getContext()获取安全上下文对象
* 就是那个保存在 ThreadLocal 里面的安全上下文对象
* 总是不为 null(如果不存在，则创建一个 authentication 属性为 null 的 empty 安全上下文对象)
* 获取当前认证了的 principal(当事人),或者 request token (令牌)
* 如果没有认证，会是 null,该例子是认证之后的情况
*/
@GetMapping("userInfo2")
public Object getUserInfo2() {
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
ret
```



#### 2.请求任意一个都可以获取到登陆后的json信息

![image-20210408174013135](img/image-20210408174013135.png)



### 4.Spring Security 用户，角色，权限拦截配置讲解

#### 1.角色和权限的配置，修改 WebSecurityConfig 类

```java

 /**
     * 配置认证(用户)管理 模拟内存用户数据
     * 重点说明：
     * 在开发中，我们一般只针对权限，很少去使用角色
     * 后面的讲解中我们以权限为主也就是 authorities 这里面的东西
     * @param auth
     * @throws Exception
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 在内存中创建了两个用户
        auth.inMemoryAuthentication()
                .withUser("yby") // 用户名
                .password(passwordEncoder().encode("yby")) // 密码 需要加密
                .roles("ADMIN_SXT") // 给了一个角色
                .authorities("sys:add", "sys:update", "sys:delete", "sys:select") // 给yby用户四个权限 如果权限和角色都给了 那么角色就失效了

                // 测试用户 只有一个查看权限
                .and()
                .withUser("test")
                .password(passwordEncoder().encode("test"))
                .roles("TEST") // 失效 因为有 authorities这个了
                .authorities("sys:select")

                // admin用户 角色权限区分
                .and()
                .withUser("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN") // 注意点：不能带入前缀ROLE_ security里面默认会添加的 最终结果是  ROLE_ADMIN
        ;
    }




/**
* 配置 http 请求验证等
*
* @param http
* @throws Exception
*/
@Override
protected void configure(HttpSecurity http) throws Exception {
    // 注释掉他自己的方法 走我们自己的
    // super.configure(http);
    // 给一个表单登陆 就是我们的登录页面,登录成功或者失败后走我们的 url
    http.formLogin()
        .successForwardUrl("/welcome") // 登录成功走的url
        .failureForwardUrl("/fail") // 登录失败走的url
        .permitAll();
    // 匹配哪些 url，需要哪些权限才可以访问 当然我们也可以使用链式编程的方式
    http.authorizeRequests()
        .antMatchers("/query").hasAuthority("sys:query") // 表示这个用户有这个权限标识才能访问
        .antMatchers("/save").hasAuthority("sys:save")
        .antMatchers("/del").hasAuthority("sys:del")
        .antMatchers("/update").hasAuthority("sys:update")
        .antMatchers("/admin/**").hasRole("ADMIN") // 表示这个用户有这个角色才能访问
    ; // 其他所有的请求都需要登录才能进行
    // 所有的请求都需要认证才可以访问
    http.authorizeRequests().anyRequest().authenticated();
}
```



#### 2.创建AuthorityController 演示权限访问

```java

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author 杨不易呀
 */
@RestController
public class AuthorityController {

    /**
     * 登录成功的主页返回值
     *
     * @return
     */
    @PostMapping("welcome")
    public String welcome() {
        return "欢迎来到主页";
    }

    /**
     * 登录失败的返回值
     *
     * @return
     */
    @PostMapping("fail")
    public String fail() {
        return "登录失败了";
    }

    /**
     * 开启方法权限的注解
     *
     * @return
     */
    @GetMapping("add")
    public String add() {
        return "欢迎来到主ADD";
    }

    @GetMapping("update")
    public String update() {
        return "欢迎来到UPDATE";
    }

    @GetMapping("delete")
    public String delete() {
        return "欢迎来到DELETE";
    }

    @GetMapping("select")
    public String select() {
        return "欢迎来到SELECT";
    }

    @GetMapping("role")
    public String role() {
        return "欢迎来到ROLE";
    }
    
    @GetMapping("admin/hello")
    public String admin() {
    return "我是只有 admin 角色才可以访问的";
    }

}
```



#### 3.创建访问403权限不足页面.html

![image-20210408175450877](img/image-20210408175450877.png)



```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>没有访问权限哦</title>
</head>
<body>
<h1 style="color: red">您没有访问权限</h1>
</body>
</html>
```

#### 会自动的跳转到该目录下.

#### 访问该用户没有的权限请求

![image-20210408175834209](./img/image-20210408175834209.png)



### 5.Spring Security 返回 JSON（前后端分离）

在上面的例子中，我们返回的是 403 页面，但是在开发中，如 RestAPI 风格的数据，是不能返回一 个页面，而应该是给一个 json

#### 1.添加处理器 RestAuthorizationAccessDeniedHandler

```java

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

/**
 * @Author 杨不易呀
 * 自定义登录成功的处理器
 * 返回json
 */
@Configuration
public class AuthenticateSuccess implements AuthenticationSuccessHandler {


    /**
     * 登陆成功后执行的处理器
     *
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("登录成功了");
        // 把json串写出去
        response.setContentType("application/json;charset=utf-8");
        HashMap<String, Object> map = new HashMap<>(8);
        map.put("code", 200);
        map.put("msg", "登录成功");
        // 把用户信息返回给前端 让前端可以保存起来
        map.put("data", authentication);
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(map);
        // 写出去
        PrintWriter writer = response.getWriter();
        writer.write(s);
        // 刷新流 关闭流
        writer.flush();
        writer.close();
    }
}

```



#### 2.修改WebSecurityConfig配置文件

```java
/**
* 将自定义的拒绝访问处理器注入进来
*/
@Autowired
private AccessDeniedHandler accessDeniedHandler;

/**
* 配置 http 请求验证等
*
* @param http
* @throws Exception
*/
@Override
protected void configure(HttpSecurity http) throws Exception {
    // 自定义403请求返回json
    http.exceptionHandling().accessDeniedHandler(accessDeniedHandler());
    // 给一个表单登陆 就是我们的登录页面,登录成功或者失败后走我们的 url
    http.formLogin()
        .successForwardUrl("/welcome") // 登录成功走的url
        .failureForwardUrl("/fail") // 登录失败走的url
        .permitAll();
    // 匹配哪些 url，需要哪些权限才可以访问 当然我们也可以使用链式编程的方式
    http.authorizeRequests()
        .antMatchers("/query").hasAuthority("sys:query") // 表示这个用户有这个权限标识才能访问
        .antMatchers("/add").hasAuthority("sys:add")
        .antMatchers("/delete").hasAuthority("sys:delete")
        .antMatchers("/update").hasAuthority("sys:update")
        .antMatchers("/admin/**").hasRole("ADMIN") // 表示这个用户有这个角色才能访问
    ; // 其他所有的请求都需要登录才能进行
    // 所有的请求都需要认证才可以访问
    http.authorizeRequests().anyRequest().authenticated();
}
```



#### 3.重新启动访问用户没有权限的url下·

![image-20210408180438771](http://oss-yby.yangbuyi.top/blog/image-20210408180438771.png)



#### 4.登录成功或者失败都返回 JSON，我们需要自定义处理器

**创建 AuthenticateSuccess** 

登录成功返回json

```java

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

/**
 * @Author 杨不易呀
 * 自定义登录成功的处理器
 * 返回json
 */
@Configuration
public class AuthenticateSuccess implements AuthenticationSuccessHandler {


    /**
     * 登陆成功后执行的处理器
     *
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("登录成功了");
        // 把json串写出去
        response.setContentType("application/json;charset=utf-8");
        HashMap<String, Object> map = new HashMap<>(8);
        map.put("code", 200);
        map.put("msg", "登录成功");
        // 把用户信息返回给前端 让前端可以保存起来
        map.put("data", authentication);
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(map);
        // 写出去
        PrintWriter writer = response.getWriter();
        writer.write(s);
        // 刷新流 关闭流
        writer.flush();
        writer.close();
    }
}

```



**修改配置 http 请求验证** 

注入登录失败和登录成功返回json

```java
    /**
     * 自定义登录成功返回json
     */
	@Autowired
    private AuthenticationSuccessHandler authenticationSuccessHandler;

/**
* 配置 http 请求验证等
*
* @param http
* @throws Exception
*/
@Override
protected void configure(HttpSecurity http) throws Exception {
    // 给一个表单登陆 就是我们的登录页面,登录成功或者失败后走我们的 url
    //http.formLogin()
       // .successForwardUrl("/welcome") // 登录成功走的url
        //.failureForwardUrl("/fail") // 登录失败走的url
       // .permitAll();
    // 这里使用了前后端分离的模式 实现我们的登录成功和失败返回json
    http.formLogin()
        .successHandler(authenticationSuccessHandler)
        .failureHandler(authenticationFailureHandler());
    // 匹配哪些 url，需要哪些权限才可以访问 当然我们也可以使用链式编程的方式
    http.authorizeRequests()
        .antMatchers("/query").hasAuthority("sys:query") // 表示这个用户有这个权限标识才能访问
        .antMatchers("/save").hasAuthority("sys:save")
        .antMatchers("/del").hasAuthority("sys:del")
        .antMatchers("/update").hasAuthority("sys:update")
        .antMatchers("/admin/**").hasRole("ADMIN") // 表示这个用户有这个角色才能访问
    ; // 其他所有的请求都需要登录才能进行
    // 所有的请求都需要认证才可以访问
    http.authorizeRequests().anyRequest().authenticated();
}

/**
     * 登录失败的处理器
     *
     * @return
     */
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            response.setContentType("application/json;charset=utf-8");
            System.out.println(exception);
            // 有很多登录失败的异常
            HashMap<String, Object> map = new HashMap<>(4);
            map.put("code", 401);
            // instanceof 判断左右是否是右边的 一个实例  这里的exception已经是一个具体的错误了
            if (exception instanceof LockedException) {
                map.put("msg", "账户被锁定，登陆失败！");
            } else if (exception instanceof BadCredentialsException) {
                map.put("msg", "账户或者密码错误，登陆失败！");
            } else if (exception instanceof DisabledException) {
                map.put("msg", "账户被禁用，登陆失败！");
            } else if (exception instanceof AccountExpiredException) {
                map.put("msg", "账户已过期，登陆失败！");
            } else if (exception instanceof CredentialsExpiredException) {
                map.put("msg", "密码已过期，登陆失败！");
            } else {
                map.put("msg", "登陆失败！");
            }
            ObjectMapper objectMapper = new ObjectMapper();
            String s = objectMapper.writeValueAsString(map);
            PrintWriter writer = response.getWriter();
            writer.write(s);
            writer.flush();
            writer.close();
        };
    }

```





#### 5.重新启动工程进行登录测试json返回







### 6.Spring Security 方法授权   权限访问限制

我们使用方法级别的授权后，只需要在 controller 对应的方法上添加注解即可了，不需要再 webSecurityConfig 中配置匹配的 url 和权限了，这样就爽多了

#### 1.相关注解说明

@PreAuthorize 在方法调用前进行权限检查 

@PostAuthorize 在方法调用后进行权限检查

 @Secured 上面的三个注解如果要使用的话必须加上

 @EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true)

 如果只使用 PreAuthorize 就只用开启 prePostEnabled = true 

如果只使用@Secured 就只用开启 securedEnabled = true 这种方式不推荐，有坑 坑在这里 @Secured，而@Secured 对应的角色必须要有 ROLE_前缀

#### 2.在 WebSecurityConfig 类或者启动类上添加注解

![image-20210409141018951](./img/image-20210409141018951.png)



#### 3.注释掉 WebSecurityConfig 配置 url 和权限的代码

![image-20210409141117632](http://oss-yby.yangbuyi.top/blog/image-20210409141117632.png)

![image-20210409141135380](./img/image-20210409141135380.png)

#### 4.修改 controller，给方法添加注解

不加注解的，都可以访问，加了注解的，要有对应权限才可以访问哦

```java
    /**
     * 开启方法权限的注解
     *
     * @return
     */
    @GetMapping("add")
    @PreAuthorize("hasAuthority('sys:add')")
    public String add() {
        return "欢迎来到主ADD";
    }

    @GetMapping("update")
    @PreAuthorize("hasAuthority('sys:update')")
    public String update() {
        return "欢迎来到UPDATE";
    }

    @GetMapping("delete")
    @PreAuthorize("hasAuthority('sys:delete')")
    public String delete() {
        return "欢迎来到DELETE";
    }

    @GetMapping("select")
    @PreAuthorize("hasAuthority('sys:select')")
    public String select() {
        return "欢迎来到SELECT";
    }

    @GetMapping("role")
    public String role() {
        return "欢迎来到ROLE";
    }
```



#### 5.重新启动即可。



# 下期文章整合Jwt+Security



## 二、创建jwt_secueiry工程

![image-20210408163126803](./img/image-20210408163126803.png)

![image-20210409141835617](./img/image-20210409141835617.png)

![image-20210409141844128](./img/image-20210409141844128.png)

#### 1 、创建工程完毕之后 

#### 2、修改启动类  新增注解

![image-20210409143008707](./img/image-20210409143008707.png)

#### 3、修改配置文件 yml

```java
server:
  port: 8080
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://yangbuyi.top:3310/psringsecurity?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
    username: root
    password: 123456
  redis:
    host: yangbuyi.top
    port: 6391
    database: 0
    password: 123456
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

#### 4、使用idea连接数据库,进行代码生成

![image-20210409143458753](./img/image-20210409143458753.png)



##### 可以看到除了persistent_logins 其它的就是RBAC表了， 如果不懂RBAC的小伙伴的话请自行百度学习即可 so easy to happy

![image-20210409143910328](./img/image-20210409143910328.png)

##### 右击生成User表CRUD

![image-20210409144110298](./img/image-20210409144110298.png)



![image-20210409144118147](./img/image-20210409144118147.png)

![image-20210409144217100](./img/image-20210409144217100.png)

![image-20210409150023499](./img/image-20210409150023499.png)

##### 5、创建完毕，开始配置SpringSecurity 的配置啦。

###### 1. 创建WebSecurityConfig配置类

```
package top.yangbuyi.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.yangbuyi.constant.JwtConstant;

import java.io.PrintWriter;
import java.time.Duration;
import java.util.*;

/**
 * ClassName: WebSecurityConfig
 *
 * @author yangshuai
 * @Date: 2021-04-09 14:42
 * @Description: http请求配置 $
 **/
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * 权限403返回json
     */
    @Autowired
    private AccessDecision accessDecision;

    /**
     * redis
     */
    @Autowired
    private RedisTemplate<String, String> redisTemplate;


    /**
     * http请求
     *
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        
        // 关闭csrf攻击
        http.csrf().disable();
        // 登录配置
        http.formLogin()
                .loginProcessingUrl("/doLogin") // 指定登录地址
                .successHandler(authenticationSuccessHandler()) // 登录成功执行的
                .failureHandler(authenticationFailureHandler()) // 登录失败执行的
                .permitAll();
        // 403 权限不足
        http.exceptionHandling().accessDeniedHandler(accessDecision);
        // 基于token方式 不会存储session来进行登录判断了
        http.sessionManagement().disable();
        // 集成JWT 全部放行接口  使用jwt过滤器来进行 鉴权
        http.authorizeRequests().antMatchers("/**").permitAll();

    }


    /**
     * 登录成功的 handle 
     *
     * @return
     */
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request,response,authentication) -> {
         System.out.println("登录成功了");
        // 把json串写出去
        response.setContentType("application/json;charset=utf-8");
        HashMap<String, Object> map = new HashMap<>(8);
        map.put("code", 200);
        map.put("msg", "登录成功");
        // 把用户信息返回给前端 让前端可以保存起来
        map.put("data", authentication);
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(map);
        // 写出去
        PrintWriter writer = response.getWriter();
        writer.write(s);
        // 刷新流 关闭流
        writer.flush();
        writer.close();
        };
    }

    /**
     * 登录失败的json
     *
     * @return
     */
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            response.setContentType("application/json;charset=utf-8");
            // 写出去
            HashMap<String, Object> map = new HashMap<>(4);
            map.put("code", 401);
            map.put("msg", "登陆失败");
            ObjectMapper objectMapper = new ObjectMapper();
            String s = objectMapper.writeValueAsString(map);
            PrintWriter writer = response.getWriter();
            writer.write(s);
            writer.flush();
            writer.close();
        };
    }

}
```



##### 新增jwt依赖

```java
 <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>3.11.0</version>
        </dependency>
```



#### 6.自定义配置用户信息(数据库当中获取)

##### 1.修改user实体类

```java

@Data
@AllArgsConstructor
@NoArgsConstructor
public class sysUser implements Serializable, UserDetails {
    private Integer userid;

    private String username;

    private String userpwd;

    private String sex;

    private String address;

    private List<String> authors = Collections.emptyList();

    private static final long serialVersionUID = 1L;

    /**
     * 返回查询出来的权限给到springSecurity
     *
     * @return the authorities, sorted by natural key (never <code>null</code>)
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorityArrayList = new ArrayList<>();
        if (this.authors.size() > 0) {
            authors.forEach(e -> authorityArrayList.add(new SimpleGrantedAuthority(e)));
        }
        return authorityArrayList;
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * @return the password
     */
    @Override
    public String getPassword() {
        return this.userpwd;
    }

    /**
     * Indicates whether the user's account has expired. An expired account cannot be
     * authenticated.
     *
     * @return <code>true</code> if the user's account is valid (ie non-expired),
     * <code>false</code> if no longer valid (ie expired)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is locked or unlocked. A locked user cannot be
     * authenticated.
     *
     * @return <code>true</code> if the user is not locked, <code>false</code> otherwise
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials (password) has expired. Expired
     * credentials prevent authentication.
     *
     * @return <code>true</code> if the user's credentials are valid (ie non-expired),
     * <code>false</code> if no longer valid (ie expired)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled or disabled. A disabled user cannot be
     * authenticated.
     *
     * @return <code>true</code> if the user is enabled, <code>false</code> otherwise
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
```



##### 2.创建UserDetailsServiceImpl 到config配置下

```java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import top.yangbuyi.domain.sysUser;
import top.yangbuyi.mapper.sysUserMapper;

import java.util.List;

/**
 * ClassName: UserDetailsServiceImpl
 *
 * @author yangshuai
 * @Date: 2021-04-09 14:55
 * @Description: 用户信息配置 $
 **/
@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private sysUserMapper sysUserMapper;
    /**
     * 登录时会来到这里进行 用户校验 相当于shiro当中的 认证用户真实性
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 根据用户名称查询用户信息
        sysUser sysUser = sysUserMapper.selectName(username);
        if (sysUser != null){
            List<String> a = sysUserMapper.selectAuthor(sysUser.getUserid());
            System.out.println("权限标识符:{}"+ a);
            sysUser.setAuthors(a);
        }
        return sysUser;
    }
}
```

##### 3.修改mapper 

```java

    @Select(" select * from sys_user where username = #{username}  ")
    sysUser selectName(String username);

    @Select(" select distinct  sp.percode from sys_user_role sur left join sys_role_permission srp on sur.roleid = srp.roleid left join sys_permission sp on srp.perid = sp.perid where sur.userid = #{userid} ")
    List<String> selectAuthor(Integer userid);
```

##### 4.修改WebSecurityConfig配置文件

![image-20210409151016613](./img/image-20210409151016613.png)

​	

#### 4.启动项目测试登录

zhangsan/123456

相当于复习了上面的知识点只是将内存用户改为自己数据库当中的用户



芜湖！！！报错了，咱们看到控制台打印 咦熟悉~~~~

加密器没有注入欸，在SpringSeccurity当中是需要加密器来进行登录的

来设置设置。。。



![image-20210409154214246](./img/image-20210409154214246.png)

##### 修改web配置文件

```
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```



![image-20210409154722633](./img/image-20210409154722633.png)



##### 恭喜恭喜 登录成功了

![image-20210409154815893](./img/image-20210409154815893.png)

![image-20210409155029456](./img/image-20210409155029456.png)



### 7.咦不对呀  不是要玩jwt嘛 ，不急 这就开始.....



##### 思考：

##### 1. jwt用来干啥啊？？？？

##### 哎，搞这么久还不知道？ 用来搞权限啊  如果用户没有进行登录 直接访问我们的业务 那肯定不行的呀 那么带着这些问题 我们冲冲冲!!!!!

##### 2. 登录时我们如何接入jwt呢?

##### 在SpringSecurity登录成功时会执行successHandel里面的自定义方法，我们在里面把用户信息存储到JWT然后呢

##### 这时我们就需要使用到过滤器了,在springsecurity执行登录前 我们自己来进行校验登录 即可

看我操作.......



#### 1. 登录成功后我们进行将登录成功的用户数据存储到JWT 修改登录成功的handel  用于jwt颁发token 

```java
 /**
     * 登录成功的 handle
     * 1. 拿到用户的信息
     * 2. 组装JWT
     * 3. 写出去
     *
     * @return
     */
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request,response,authentication) -> {

            // 1.拿去用户数据
            UserDetails principal = (UserDetails) authentication.getPrincipal();
            String username = principal.getUsername();
            // 2.拿起权限
            Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
            List<String> authorizations = new ArrayList<>(authorities.size() * 2);
            authorities.forEach(e -> authorizations.add(e.getAuthority()));

            // 3.组装jwt
            // 生成jwt
            // 颁发时间
            Date createTime = new Date();
            // 过期时间
            Calendar now = Calendar.getInstance();
            // 设置未来的时间
            now.set(Calendar.MINUTE, JwtConstant.EXPIRETIME);
            Date expireTime = now.getTime();
            // header
            HashMap<String, Object> header = new HashMap<>(4);
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            // 设置载体
            String sign = JWT.create()
                    .withHeader(header)
                    .withIssuedAt(createTime)
                    .withExpiresAt(expireTime)
                    .withClaim("username", username)
                    .withClaim("authorizations", authorizations)
                    .sign(Algorithm.HMAC256(JwtConstant.SIGN));
            ObjectMapper objectMapper = new ObjectMapper();
            HashMap<String, Object> map = new HashMap<>(4);
            map.put("access_token", sign);
            map.put("expire_time", JwtConstant.EXPIRETIME);
            map.put("type", "bearer");
            // 保存redis  --- 客户端和服务器来建立有状态 
            redisTemplate.opsForValue().set(JwtConstant.JWT_KET + sign, sign, Duration.ofMinutes(JwtConstant.EXPIRETIME));
            String s = objectMapper.writeValueAsString(map);
            PrintWriter writer = response.getWriter();
            writer.write(s);
            writer.flush();
            writer.close();
        };
    }
```







#### 2.创建JwtCheckToken类  用户校验用户来的token是否合法并且是否由我颁发的



```java


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import top.yangbuyi.constant.JwtConstant;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * ClassName: JwtCheckFiter
 *
 * @author yangshuai
 * @Date: 2021-03-29 09:56
 * @Description: jwt鉴权 $
 **/
@Component
public class JwtCheckFilter extends OncePerRequestFilter {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 每一次请求都会进行执行改过滤器
     * 每次请求都会走这个方法
     * jwt 从header带过来
     * 解析jwt
     * 设置到上下文当中去
     * jwt 性能没有session好
     *
     * @param httpServletRequest
     * @param httpServletResponse
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,
                                    HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {
        httpServletResponse.setContentType("application/json;charset=utf-8");
        String requestURI = httpServletRequest.getRequestURI(); // 获取请求 url 来判断是否是登录
        String method = httpServletRequest.getMethod(); // 请求类型
        if ("/doLogin".equals(requestURI) && "POST".equalsIgnoreCase(method)) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }
        // 判断是否带入了token
        String header = httpServletRequest.getHeader(JwtConstant.AUTHORIZATION);
        if (StringUtils.hasText(header)) {
            // 解析真正的 token
            header = header.replaceAll(JwtConstant.JWTTYPE, "");
            // 判断token是否存在
            Boolean aBoolean = stringRedisTemplate.hasKey(JwtConstant.JWT_KET + header);
            // 校验是否过期 登出
            if (!aBoolean) {
                // 说明已经登出或者过期
                httpServletResponse.getWriter().write("token过期，请重新登录!");
                return;
            }

            // 解析验证
            JWTVerifier build = JWT.require(Algorithm.HMAC256(JwtConstant.SIGN)).build();
            DecodedJWT verify = null;
            try {
                verify = build.verify(header);
            } catch (JWTVerificationException e) {
                httpServletResponse.getWriter().write("token验证失败");
                return;
            }
            // 拿到解析后的jwt了 后端服务器没保存用户信息 给他设置进去
            Claim usernameClaim = verify.getClaim("username");
            String username = usernameClaim.asString();
            // 拿到权限
            Claim authsClaim = verify.getClaim("authorizations");
            List<String> authStrs = authsClaim.asList(String.class);
            // 转变权限信息
            ArrayList<SimpleGrantedAuthority> simpleGrantedAuthorities = new ArrayList<>(authStrs.size() * 2);
            authStrs.forEach(auth -> simpleGrantedAuthorities.add(new SimpleGrantedAuthority(auth)));
            // 变成security认识的对象` 
            // 参数一： 用户名称
            // 参数二：密码
            // 参数三：权限标识
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, simpleGrantedAuthorities);
            SecurityContextHolder.getContext().setAuthentication(authenticationToken); // 重新存储到Security当中
            filterChain.doFilter(httpServletRequest, httpServletResponse); // 放行
            return;
        }
        httpServletResponse.getWriter().write("token验证失败.");
        return;
    }
}
```



#### 3.修改web配置文件  

#####  将自定义的过滤器放在springSecurity执行登录之前调用，用于校验token 的合法权限

![image-20210409160647950](./img/image-20210409160647950.png)



#### 4.重新启动测试token



##### 登录成功，返回token

![image-20210409160845615]( ./img/image-20210409160845615.png)

##### 根据token带入 调用业务接口

![image-20210409161014525](img/image-20210409161014525.png)

##### 好像忘记写业务接口了  不过没关系 补上不就行了

![image-20210409161103689](./img/image-20210409161103689.png)



#### 5.创建IndexController



```java

/**
 * ClassName: IndexController
 *
 * @author yangshuai
 * @Date: 2021-04-09 16:11
 * @Description: 业务 $
 **/
@RestController
public class IndexController {

    @RequestMapping("query")
    @PreAuthorize("hasAuthority('sys:query')")
    public String query() {
        return "query";
    }

    @RequestMapping("add")
    @PreAuthorize("hasAuthority('sys:add')")
    public String add() {
        return "add";
    }

    @RequestMapping("delete")
    @PreAuthorize("hasAuthority('sys:delete')")
    public String delete() {
        return "delete";
    }

    @RequestMapping("update")
    @PreAuthorize("hasAuthority('sys:update')")
    public String update() {
        return "update";
    }

}
```



#### 重新启动测试token

##### 可以带入刚刚我们的登录过的token  因为我们设置了过期时间 2小时嘛



![image-20210409161416705](./img/image-20210409161416705.png)

##### 欸 访问成功  我们试一试 没有权限的

![image-20210409161459254](./img/image-20210409161459254.png)



### 8.JWT登出

##### 思考：

1.咋记录登录的唯一性呀

思路：

在用户登录成功后进入到handel我们进行记录当前jwt颁发的token到redis当中

然后就是，访问登出接口 我们根据传递来的token前往redis当中查询，判断是否存在  存在删除 即可。

这就引发出了我们自定义的 过滤器来校验 上次登录的token判断redis当中是否存在 就判断为 过期或者登出.

这段代码功能我已经写在Demo里面的IndexController了  小伙伴们课自己研究查看。

```java
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @PostMapping("toLogout")
    public String toLogout() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String header = request.getHeader(JwtConstant.AUTHORIZATION);
        String jwtToken = header.replaceAll(JwtConstant.JWTTYPE, "");
        if (StringUtils.hasText(jwtToken)) {
            // 移除token
            stringRedisTemplate.delete(JwtConstant.JWT_KET + jwtToken);
        }
        return "退出成功!";
    }
```



##### 到此 从零玩转 jwt+SpirngSeccurity 就结束了哦!

### 我们下次再见....



## 个人博客网站： https://www.yangbuyi.top/

## 春天交流群 ：598347590

## 本文Demo:   https://gitee.com/yangbuyi/bky_yby



![img](https://oss-yby.yangbuyi.top/blog/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



## 🍺你的压力源于无法自律，只是假装努力，现状跟不上你内心的欲望，所以你焦急又恐慌---杨不易.|





















































































