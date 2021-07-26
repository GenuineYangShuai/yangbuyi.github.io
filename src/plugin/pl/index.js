module.exports = function(context, options) {
  return {
    name: "valine",
    injectHtmlTags() {
      return {
        headTags: [
          {
            resolve: `gatsby-plugin-valine`,
            options: {
                appId: `aoG651bXFFJg87Q0sUgt2I13-gzGzoHsz`,
                appKey: `igJwFCfybTqugRiambpYj9xA`,
                avatar: `robohash`,
            },
          }
        ]
      };
    }
  };
};
