// Can setup setting for different environments
export default () => ({
  reqIdPrefix: 'quotation',
  redis: {
    host: 'localhost',
    port: 6379
  },
  validatorOptions: {
    validationError: {
      target: false,
      value: true
    }
  }
})
