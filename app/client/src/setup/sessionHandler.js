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
    const redirect = window.location.pathname.indexOf('/app') >= 0 ? window.location.pathname : false
    if (!user && redirect) {
      if (window.location.pathname === '/login') return
      if (redirect) return router.push({ name: 'public.login', query: { redirect } });
      return router.push({ name: 'public.login' });
    }
    if (user && (user.data?.ux?.lastProjectId
      || router.currentRoute?.value?.params?.projectId)) {
      if (router.currentRoute.value.name === 'app.project.index') return
      if (redirect) return router.push({ name: 'app.project.index', params: { projectId: router.currentRoute.value.params.projectId || user.data.ux.lastProjectId }, query: { redirect } });
      return router.push({ name: 'app.project.index', params: { projectId: router.currentRoute.value.params.projectId || user.data.ux.lastProjectId } });

    }
    if (user && !user.data.ux.lastProjectId
      && !router.currentRoute?.value?.params?.projectId) {
      if (router.currentRoute?.value?.name === 'app.project.select') return
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
