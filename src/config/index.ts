// Can setup setting for different environments
export default () => ({
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
