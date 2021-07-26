const path = require("path");



module.exports = {
  title: "杨不易呀",
  tagline: "帮助你提升后端开发技能",
  titleDelimiter: "-",
  url: "https://yangbuyi.top",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "杨不易呀", // Usually your GitHub org/user name.
  projectName: "yangbuyi.top", // Usually your repo name.
  stylesheets: ["https://fonts.font.im/css?family=Raleway:500,700"],
  themeConfig: {
    navbar: {
      title: "杨不易呀Java工程师",
      logo: {
        alt: "杨不易呀",
        // src: "http://oss-yby.yangbuyi.top/blog/41E3D943EC550DFDBFC2BDA970B9166C.jpg",
        // srcDark: "http://oss-yby.yangbuyi.top/blog/41E3D943EC550DFDBFC2BDA970B9166C.jpg",
        // ![logo](http://oss-yby.yangbuyi.top/blog/logo.png)
        src: "https://oss-yby.yangbuyi.top/blog/logo.png",
        srcDark: "https://oss-yby.yangbuyi.top/blog/logo.png",
      },
      items: [
        {
          to: "/",
          label: "博客分类",
          position: "right",
          items: [
            {
              label: "前端",
              to: "tags/前端",
            },
            {
              label: "后端",
              to: "tags/后端",
            },
            {
              label: "职业",
              to: "tags/职业",
            },
            {
              label: "健康",
              to: "tags/健康",
            },
          ],
        },
        {
          label: "关于我",
          position: "right",
          to: "docs/yangbuyi/yby",
        },
        // {
        //   label: "峰华视频",
        //   position: "right",
        //   to: "docs/videos/videos-intro",
        // },
        {
          label: "教程",
          position: "right",
          items: [
            {
              label: "CSS",
              to: "docs/css/box-model/box-model",
            },
          ],
        },
        {
          href: "https://github.com/GenuineYangshuai",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://gitee.com/yangbuyi",
          label: "GitEE",
          position: "right",
        },
        {
          href: "https://www.cnblogs.com/Yangbuyi/",
          label: "博客园",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "文档",
          items: [
            {
              label: "文档1",
              to: "docs/doc1"
            },
            {
              label: "文档2",
              to: "docs/doc2"
            }
          ]
        },
        {
          title: "Social",
          items: [
            {
              label: "博客",
              to: "/",
            },
            {
              label: "GitHub",
              href: "https://github.com/GenuineYangshuai",
            },
            {
              label: "GitEE",
              href: "https://gitee.com/yangbuyi",
            },
            {
              label: "博客园",
              href: "https://www.cnblogs.com/Yangbuyi/"
            }
          ],
        },
        {
          title: "友情链接",
          items: [
            {
              label: "坑位",
              to: "https://yangbuyi.top/",
            },
            {
              label: "坑位",
              to: "https://yangbuyi.top/",
            },
          ],
        },
        {
          title: "鸣谢",
          items: [
            {
              label: "峰华前端工程师(张旭乾)",
              to: "https://zxuqian.cn/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}  杨不易呀 (杨帅) <a href="http://www.beian.miit.gov.cn/" style="color: white; font-size: 14px;">湘ICP备20007214号</a>`,
    },
    prism: {
      darkTheme: require("prism-react-renderer/themes/vsDark"),
      defaultLanguage: "javascript",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://yangbuyi.top/",
        },
        blog: {
          path: "./blog",
          routeBasePath: "/",
          feedOptions: {
            type: "all",
            title: "杨不易呀后端工程师",
            copyright: `Copyright © ${new Date().getFullYear()} 杨不易呀 (杨帅) <a href="http://www.beian.miit.gov.cn/" style="color: white; font-size: 14px;">湘ICP备20007214号</a>`,
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "daily",
          priority: 0.5,
        },
      },
    ],
  ],
  themes: ["@docusaurus/theme-live-codeblock"],
  plugins: [
    path.resolve(__dirname, "./src/plugin/plugin-baidu-analytics"),
    path.resolve(__dirname, "./src/plugin/plugin-baidu-push"),
    // path.resolve(__dirname, "./src/plugin/pl"),
    // path.resolve(__dirname, "./src/plugin/valine"),
    // path.resolve(__dirname, "./src/plugin/plugin-google-adsense"),
  ],
};