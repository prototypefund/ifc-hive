export const globalTools = ($store) => {
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-file-tree",
      uuid: "projectTree",
      widget: {
        name: "projectTree",
      },
    },
  });
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-magnify",
      uuid: "projectSearch",
      widget: {
        name: "projectSearch",
      },
    },
  });
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-history",
      uuid: "projectHistory",
      widget: {
        name: "projectHistory",
      },
    },
  });
  /* $store.dispatch({
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
   */
}
