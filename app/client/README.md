# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# Test Preperation
If you want to run 2 non-headless sessions simultanusly make sure to select diffrent Browsers
```
docker-compose up --build -d
cd app/client
```

## Integration Test non-headless for Development or Debuging
Runs a Test against the RAW app via with Browser For Test Development/Debuging
1) -> Test Preperation 
```
yarn test:integration
```

## Integration Test Headless 
Runs a Test against the RAW app via Comandline
1) -> Test Preperation
```
yarn test:integration:ci
```

## Component Storybook Test non-headless for Development or Debuging
Runs a Test against the Storybook RAW app via Comandline
```
yarn test:component
```
## Component Storybook Test Headless
```
yarn test:component:ci
```

# Developer How To
https://repo.karo.design/pacifico/projektjournal/-/blob/e9cc6980ba4cfb4ae71624928914167b031bb0b4/app/client/src/store/state.js#L1-L20