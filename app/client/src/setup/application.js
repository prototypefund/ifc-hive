export const globalTools = ($store) => {
  $store.dispatch({
    type: "toolbar/add",
    payload: {
      page: false,
      title: "quickList",
      icon: "mdi-text-box-search-outline",
      iconActive: "mdi-text-box-search",
      uuid: "quickList",
      widget: {
        name: "quickList",
        face: 'expansionVertical'
      },
    },
  });
  $store.dispatch({
    type: "toolbar/add",
    payload: {
      title: "fileUploader",
      page: false,
      icon: "mdi-upload-network-outline",
      iconActive: "mdi-upload-network",
      uuid: "fileUploader_global",
      widget: {
        name: "fileUploader",
      },
    },
  });
}
