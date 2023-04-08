
import { setHttpToken } from '@lib/httpClient.js'

const sessionHandler = (store, api, eventbus, router) => {

  const checkToken = async () => {
    const token = localStorage.getItem("USER_TOKEN")
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
    store.dispatch({ type: 'user/set', payload: res.data })
    return res
  }

  const logout = async () => {
    localStorage.removeItem('USER_TOKEN')
    router.push({ name: 'public.login' })
  }


  checkToken().then(user => {
    if (!user) {
      if (window.location.pathname === '/login') return
      router.push({ path: '/login' });
      return
    }
    if (user && (user.data.ux.lastProjectId || router.currentRoute.value.params.id)) {
      if (router.currentRoute.value.name === 'app.project.index') return
      router.push({ name: 'app.project.index' });
      return
    }
    if (user && !user.data.ux.lastProjectId && !router.currentRoute.value.params.id) {
      if (router.currentRoute.value.name === 'app.project.select') return
      router.push({ name: 'app.project.select' });
      return
    }
  })

  return {
    checkToken,
    logout
  }
}

export default sessionHandler
export {
  sessionHandler,
}
