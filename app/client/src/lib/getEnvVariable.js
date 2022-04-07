/*
 * A small helper function to load env variables
 *
 * - In developmen mode we can utilize Vite's ability to load env-variables. 
 * - In production mode we need to inject our env variables, which are passed
 *   to the container to the index.html when we build the container.
 */
export default function getEnvVariable (name) {
  if (!window.configs) {
    return import.meta.env[name]
  }
  return window.configs[name]
}
