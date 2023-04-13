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
    return router.push({ name: 'public.login' })
  }

  /*
   * handle token
   * This function takes the response from check token as input
   */
  const handleToken = async (user) => {
    const redirect = window.location.pathname.indexOf('/app') >= 0 ? window.location.pathname : false
    if (!user && redirect) {
      // we are not signed in but we wanted to see a internal page, so lets send them to the login page with a redirect url query to get them where they want
      if (window.location.pathname === '/login') return
      if (redirect) return router.push({ name: 'public.login', query: { redirect } });
      return router.push({ name: 'public.login' });
    }
    if (user && window.location.pathname.indexOf('/app') == -1) {
      // apparently we want to see a public page while being signed in, which is not illegal
      return
    }
    if (user && window.location.pathname == '/app/projects') {
      // apparently we reloaded the project selection page, so let them
      return
    }
    if (user && (user.data?.ux?.lastProjectId
      || router.currentRoute?.value?.params?.projectId)) {
      // we are signed in and we know where to go, if we wanted to go to a specific page, we will remember this too
      if (router.currentRoute.value.name === 'app.project.index') return
      if (redirect) return router.push({ name: 'app.project.index', params: { projectId: router.currentRoute.value.params.projectId || user.data.ux.lastProjectId }, query: { redirect } });
      return router.push({ name: 'app.project.index', params: { projectId: router.currentRoute.value.params.projectId || user.data.ux.lastProjectId } });

    }
    if (user && !user.data.ux.lastProjectId
      && !router.currentRoute?.value?.params?.projectId) {
      // we are signed in but we have no idea where to go, so let the user choose
      if (router.currentRoute?.value?.name === 'app.project.select') return
      return router.push({ name: 'app.project.select' });
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
