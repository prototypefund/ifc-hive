
import { inject } from 'vue';

import * as S from '../src/store/state.js'

function initStore() {
    const $store = inject("$store");
    
    for (var key in S.applicationState) {
        var value = S.applicationState[key];
        
        if (key == 'pages') {
            console.log('SKIP ', key)
            continue
        }
        console.log('RESET', key + value)
        $store.dispatch({
            type: `${key}/set`,
            payload:value
          });   
    }
}

function prepareStore(name, args) {
    args.value = Math.floor(Math.random()*100);
    args[`random_noise_0${Math.floor(Math.random()*100)}`] = args.value; 
    const $store = inject("$store");
    const routeName = `app.${name}`
    $store.dispatch({
      type: "pages/add",
      routeName,
      payload: args,
    });
    $store.dispatch({
      type: "currentPage/set",
      routeName,
      payload: args,
    });
}

export {initStore, prepareStore};
