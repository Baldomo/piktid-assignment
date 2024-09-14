export const validateMinLength = (length: number, required = true) => {
  return {
    required: required ? "This field is required" : false,
    minLength: {
      value: length,
      message: `The inimum length for this field is ${length}`,
    },
  }
}
