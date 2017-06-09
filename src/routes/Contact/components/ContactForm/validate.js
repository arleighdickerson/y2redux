const constraints = {
  name: {
    presence: true,
  },
  email: {
    presence: true,
    email: true
  },
  subject: {
    presence: true,
  },
  body: {
    presence: true,
  },
};

module.exports = ({recaptcha, ...attributes}) => ({
  ...require('../../../../util/validate')(constraints)(attributes),
  ...(recaptcha ? {} : {recaptcha: 'fill out the captcha'})
})
