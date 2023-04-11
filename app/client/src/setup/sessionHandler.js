/*
 * Session management such as
 * - checkToken
 * - logout
 * - handleToken
 *
 *  @TODO shouldn't this also contain requestToken? 
 */
import { setHttpToken } from '@lib/httpClient.js'

const sessionHandler = (store, api, eventbus, router) => {

  /*
   * check token
   */
  const checkToken = async () => {
    const token = localStorage.getItem("USER_TOKEN")
    if (!token) {
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

  /*
   * logout 
   */
  const logout = async () => {
    localStorage.removeItem('USER_TOKEN')
    router.push({ name: 'public.login' })
  }

  /*
   * handle token
   * This function takes the response from check token as input
   */
  const handleToken = async (user) => {
    if (!user) {
      if (window.location.pathname === '/login') return
      router.push({ name: 'public.login', query: { redirect: window.location.pathname } });
      return
    }
    if (user && (user.data.ux.lastProjectId
      || router.currentRoute.value.params.projectId)) {
      if (router.currentRoute.value.name === 'app.project.index') return
      router.push({ name: 'app.project.index', params: { projectId: router.currentRoute.value.params.projectId || user.data.ux.lastProjectId }, query: { redirect: window.location.pathname } });
      return
    }
    if (user && !user.data.ux.lastProjectId
      && !router.currentRoute.value.params.projectId) {
      if (router.currentRoute.value.name === 'app.project.select') return
      router.push({ name: 'app.project.select' });
      return
    }
  }

  checkToken().then(user => handleToken(user))

  return {
    checkToken,
    handleToken,
    logout
  }
}

export default sessionHandler
export {
  sessionHandler,
}
