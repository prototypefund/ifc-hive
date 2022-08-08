export default function (widetName = 'debug', face = 'default') {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../components/widgets/${widetName}/${face}.vue`).catch(e => {
        return import(`../components/widgets/error/default.vue`)
    })
}
