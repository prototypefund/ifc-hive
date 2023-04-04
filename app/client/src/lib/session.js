
import { setHttpToken } from '@lib/httpClient.js'
export default (store, api, eventbus, router) => {
    const checkToken = async (token) => {
        if (!token) {
            router.push({ name: 'public.login' });
            return false
        }
        // set token in client
        setHttpToken(api, token)
        // check if token is valid
        const res = await api.get('/core/user/check-token')
        // early return if no result
        if (!res) return false
        // save received user object to store
        store.dispatch({ type: 'user/update', payload: res.data })
        return res
    }
    checkToken(localStorage.getItem("USER_TOKEN")).then(user => {
        if (!user) {
            router.push({ name: 'public.login', query: { request } });
            return
        }
        if (user && user.data.ux.lastProjectId) {

        }
    })


}
