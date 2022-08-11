export default function (widgetName = 'debug', face = 'default') {
    return import(`../components/widgets/${widgetName}/${face}.vue`).catch(e => {
        return import(`../components/widgets/error/default.vue`)
    })
}
