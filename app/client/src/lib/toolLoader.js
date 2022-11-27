export default function (widgetName = 'debug', toolType = false, face = 'default') {
    if (!toolType) {
        return import(`../components/widgets/${widgetName}/${face}.vue`).catch(e => {
            return import('../components/widgets/error/default.vue')
        })
    } else {
        return import(`../components/widgets/${widgetName}/${toolType}/${face}.vue`).catch(e => {
            return import('../components/widgets/error/default.vue')
        })
    }

}
