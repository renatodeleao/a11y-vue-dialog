const pkg = require("../../package.json");

module.exports = {
  title: 'A11y Vue Dialog',
  description: 'Just playing around',
  base: `/${pkg.name}/`,
  version: pkg.version,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],

  themeConfig: {
    repo: 'renatodeleao/a11y-vue-dialog',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    //repoLabel: 'Contribute!',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],

    sidebarDepth: 2,
    sidebar: [
      '/guide/',
      ['/guide/basic-usage', "Getting Started"],
      ['/guide/advanced-usage', "Full Example"],
      ['/guide/props', "Props"],
      ['/guide/slot-scope', "Slot scope"],
      ['/guide/events', "Events"],
      ['/guide/advanced-tips', "Advanced tips"],
      ['/guide/thanks', "Thanks"],
    ]
  }
}