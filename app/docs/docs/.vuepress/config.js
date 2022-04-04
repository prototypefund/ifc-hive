module.exports = {
  title: 'IFC-HIVE',
  description: 'Just playing around',
  port: 8089,
  dest: 'dist',
  themeConfig: {
    logo: '/hero.png',
    nav: [
      { text: 'Start', link: '/' },
      { text: 'Konzept', link: '/concept/' },
      { text: 'Docs (EN)', link: '/docs/' },
      { text: 'Kontakt', link: '/contact/' },
      { text: 'Gitlab', link: 'https://repo.karo.design/daniel/ifc-hive' },
    ],
    sidebar: {
      '/concept/': [
        '/concept/',
        '/concept/motivation',
        '/concept/openbim',
        '/concept/ifc',
        '/concept/CommonDataEnvironment',
        '/concept/graphdatabase',
      ],
      '/docs/': [
        '/docs/',
        '/docs/quickstart',
        '/docs/technologies',
      ]
    } 
  }
}
