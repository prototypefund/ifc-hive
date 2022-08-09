export default function (widgetName = 'debug', face = 'default') {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../components/widgets/${widgetName}/${face}.vue`).catch(e => {
        return import(`../components/widgets/error/default.vue`)
    })
}
