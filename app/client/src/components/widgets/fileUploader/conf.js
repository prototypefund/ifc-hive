export default {
  optionsDashboard: {
    // https://uppy.io/docs/dashboard/
    theme: 'dark',
    width: '100%',
    showLinkToFileUploadResult: true,
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: false
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
