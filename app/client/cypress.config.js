// ts import { defineConfig } from "cypress";
defineConfig = require('cypress').defineConfig

// old config
//{
//  "testFiles": "**/*.spec.js",
//  "componentFolder": "src",
//}

// yarn start-server-and-test preview http://127.0.0.1:4173/ 'cypress run --browser brave' 
const execa = require("execa");
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
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:4173",
    video: false,
    /*
    setupNodeEvents(on, config) {
      return findBrowser().then((browser) => {
        return {
          browsers: config.browsers.concat(browser),
        }
      })
    }*/
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
