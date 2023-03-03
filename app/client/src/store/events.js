
export default function ($store, $log) {
  return {
    widgetConfLoaderHandler (widget) {
      $log.warning({ widget }, `widgetConfLoader ${widget.uuid}`) 
    },

    widgetTypeConfLoaderHandler (widget) {
      $log.warning({ widget }, `widgetTypeConfLoader ${widget.uuid}` )
    }
  }
}
