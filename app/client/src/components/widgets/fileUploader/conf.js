export default {
  optionsDashboard: {
    // https://uppy.io/docs/dashboard/
    theme: 'dark',
    width: '100%',
    showLinkToFileUploadResult: true,
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: false
  },
  optionsProgressBar: {
    // https://uppy.io/docs/progress-bar/
    target: ".UploadForm",
    fixed: false,
    hideAfterFinish: false,
  },
  optionsStatusBar: {
    // https://uppy.io/docs/status-bar/
    hideUploadButton: true,
    hideAfterFinish: false,
    showProgressDetails: true,
  },
  optionsUppy: {
    // https://uppy.io/docs/uppy/
    debug: false,
    restrictions: {
      maxFileSize: 1000000,
      maxNumberOfFiles: 0
    }
  },
  optionsXhrUpload: {
    // https://uppy.io/docs/xhr-upload/
    endpoint: '/api/UploadFile',
    formData: true,
    headers: { 'accept': 'application/json' },
    limit: 1
  },
  fileMeta: {}
}
