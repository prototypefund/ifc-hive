import { S } from 'fluent-json-schema'

export function defaultHeadersSchema (versionsArray = ['1.0.0'], versionIndex) {
  const version = versionIndex || versionsArray.length - 1 

  /* headers */
  return S.object()
    .prop('Accept-Version', S.string().enum(versionsArray).default(versionsArray[version]).required())
    .prop('X-Request-Id', S.string())
}

