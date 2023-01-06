export default {
  optionsDashboard: {
    theme: 'dark',
    note: 'Description of what to upload.',
    width: '100%',
    height: 600,
    showLinkToFileUploadResult: true,
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: false
  },
  optionsUppy: {
    debug: false,
    restrictions: {
      maxFileSize: 1000000,
      maxNumberOfFiles: 0
    }
  },
  optionsXhrUpload: {
    endpoint: '/api/UploadFile',
    formData: true,
    headers: { 'accept': 'application/json' },
    limit: 1
  },
  fileMeta: {}
}
