/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, useEffect, useState } from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import BlogPostItem from "../BlogPostItem";
import BlogListPaginator from "@theme/BlogListPaginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faQq,
  faWeixin,
  faGitlab,
  faGit,
  faGitter,
  faGitAlt,
} from "@fortawesome/free-brands-svg-icons";
import useBaseUrl from "@docusaurus/useBaseUrl";
// import bilibiliIcon from "@site/static/icons/bilibili.svg";

import useThemeContext from "@theme/hooks/useThemeContext";
import useFollowers from "./useFollowers";
import useViews from "./useViews";
import { useTrail, animated, useSpring } from "react-spring";
import Fade from "react-reveal/Fade";

import ArrowDown from "@site/static/icons/arrow-down.svg";

function BlogListPage(props) {
  const { metadata, items } = props;

  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const isBlogOnlyMode = metadata.permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : "Blog";
  const description = `不仅仅是后端端工程师，分享React.js, HTML, CSS, JavaScript, Node.js 技术以及个人发展、自我提升相关的心得`;

  // Get all post views
  const views = useViews(items);
  // Get followers
  const followers = useFollowers();
  // animation
  const animatedTexts = useTrail(5, {
    from: { opacity: 0, transform: "translateY(3em)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: {
      mass: 3,
      friction: 45,
      tension: 460,
    },
    delay: 200,
  });
  const animatedHero = useSpring({
    opacity: 1,
    transform: "translateX(0)",
    from: { opacity: 0, transform: "translateX(8em)" },
    config: { mass: 2, tension: 260, friction: 30 },
    delay: 600,
  });

  // const animatedBackground = useSpring({
  //   background: "linear-gradient(25deg, #1081ff, #72e1f6, #b185ff)",
  //   to: {
  //     background: "linear-gradient(375deg, #1081ff, #72e1f6, #b185ff)",
  //   },
  // });

  return (
    <Layout title={title} description={description}>
      {/* 个人简介 */}
      <div className="hero">
        <div className="bloghome__intro">
          <animated.h1 style={animatedTexts[0]}>
              Hi! <span className="intro__name">All</span> <br /> 欢迎来到
             <span className="intro__name">杨不易呀</span>
             博客小屋<br />
          </animated.h1>
          <animated.p style={animatedTexts[1]}>
          {/* 致力于将编程和艺术相结合，以直观、生动、有趣的方式呈现枯燥的编程概念和原理，助你以最快的速度、愉快的心情掌握编程技巧，进而提升工作竞争力和创新创业能力。 */}
          🍺你的压力源于无法自律，只是假装努力，现状跟不上你内心的欲望，所以你焦急又恐慌---杨不易.|
          </animated.p>
          <animated.div style={animatedTexts[2]}>
            {/* <a
              href="https://space.bilibili.com/480271374"
              className="bloghome__follow"
            >
              去B站关注 ({(Math.round(followers) / 10000).toFixed(1)} 万)
            </a> */}
          </animated.div>
          <animated.p style={animatedTexts[3]}>
            春天交流群 598347590
            <br />
          </animated.p>
          <SocialLinks animatedProps={animatedTexts[4]} />
        </div>
        <div className="bloghome__image">
          {/* 主页图片 */}
          {/* <animated.img src="/img/wallhaven-5we787.jpg" style={animatedHero} /> */}
        </div>
        {/* <animated.div
          className="bloghome__scroll-down"
          style={animatedBackground}
        >
          <button>
            <ArrowDown />
          </button>
        </animated.div> */}
      </div>
      <div className="container margin-vert--sm">
        <div className="row">
          <div className="col col--12">
            {/* <div className="content__divider"></div> */}
            <h1 className="blog__section_title">
              最新博客&nbsp;
              <svg
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.8333 5.16666H5.16668C3.73293 5.16666 2.59626 6.31624 2.59626 7.74999L2.58334 23.25C2.58334 24.6837 3.73293 25.8333 5.16668 25.8333H25.8333C27.2671 25.8333 28.4167 24.6837 28.4167 23.25V7.74999C28.4167 6.31624 27.2671 5.16666 25.8333 5.16666ZM10.9792 19.375H9.42918L6.13543 14.8542V19.375H4.52084V11.625H6.13543L9.36459 16.1458V11.625H10.9792V19.375ZM17.4375 13.2525H14.2083V14.6992H17.4375V16.3267H14.2083V17.7604H17.4375V19.375H12.2708V11.625H17.4375V13.2525ZM26.4792 18.0833C26.4792 18.7937 25.8979 19.375 25.1875 19.375H20.0208C19.3104 19.375 18.7292 18.7937 18.7292 18.0833V11.625H20.3438V17.4504H21.8033V12.9037H23.4179V17.4375H24.8646V11.625H26.4792V18.0833Z"
                  fill="var(--themeColor)"
                />
              </svg>
            </h1>
            <div className="bloghome__posts">
              {items.map(({ content: BlogPostContent }) => (
                <Fade key={BlogPostContent.metadata.permalink}>
                  <BlogPostItem
                    key={BlogPostContent.metadata.permalink}
                    frontMatter={BlogPostContent.frontMatter}
                    metadata={BlogPostContent.metadata}
                    truncated={BlogPostContent.metadata.truncated}
                    views={
                      views.find(
                        (v) => v.slug == BlogPostContent.frontMatter.slug
                      )?.views
                    }
                  >
                    <BlogPostContent />
                  </BlogPostItem>
                </Fade>
              ))}
              <BlogListPaginator metadata={metadata} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SocialLinks({ animatedProps, ...props }) {
  const { isDarkTheme } = useThemeContext();
  return (
    <animated.div className="social__links" style={animatedProps}>
      {/* <a href="https://space.bilibili.com/302954484">
        <img
          src={useBaseUrl(`icons/bilibili${isDarkTheme ? "-dark" : ""}.svg`)}
          alt="峰华前端工程师-bilibili"
        />
      </a> */}
      <a href="http://wpa.qq.com/msgrd?v=3&uin=1692700664&site=qq&menu=yes">
        <FontAwesomeIcon icon={faQq} />
      </a>
      <a href="https://gitee.com/yangbuyi">
        <FontAwesomeIcon icon={faGitlab} />
      </a>
      <a href="https://github.com/GenuineYangshuai">
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <div class="dropdown dropdown--hoverable">
        <FontAwesomeIcon icon={faWeixin} color="#07C160" size="lg" />
        <span></span>
        <img
          width="50%"
          className="dropdown__menu"
          src={useBaseUrl("https://oss-yby.yangbuyi.top/blog/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png")}
        />
      </div>
    </animated.div>
  );
}

export default BlogListPage;
