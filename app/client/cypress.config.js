// ts import { defineConfig } from "cypress";
defineConfig = require('cypress').defineConfig

// yarn start-server-and-test preview http://127.0.0.1:4173/ 'cypress run --browser brave' 
const execa = require("execa");

const fs = require('fs')
const path = require('path')

vitePreprocessor = require('cypress-vite')


const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath = "/snap/bin/brave";

  return execa(browserPath, ["--version"]).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
      result.stdout
    );
    const majorVersion = parseInt(version.split(".")[0]);

    return {
      name: "Brave",
      channel: "stable",
      family: "chromium",
      displayName: "Brave",
      version,
      path: browserPath,
      majorVersion,
    };
  });
};

config = defineConfig({
  chromeWebSecurity: false,
  /* Setup for E2E framework */
  e2e: {
    experimentalSessionAndOrigin: true,
    specPattern: ["cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}", "**/component.cy.{js,jsx,ts,tsx}", "**/*.component.cy.{js,jsx,ts,tsx}"],
    baseUrl: "http://localhost:4173",
    video: false,
    async setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        vitePreprocessor(path.resolve(__dirname, './vite.config.js')),
      )
      try {
        const visit = fs.readFileSync('cypress/fixtures/visit.json', 'utf8')
        JSON.parse(visit)
      } catch(e) {
        fs.writeFileSync('cypress/fixtures/visit.json','{}')
      }

      /*return findBrowser().then((browser) => {
      return {
        browsers: config.browsers.concat(browser),
      }
      })*/
      return config
    }
  },
  component: {
    specPattern: "src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}",
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});

// ts export default config
module.exports = config

