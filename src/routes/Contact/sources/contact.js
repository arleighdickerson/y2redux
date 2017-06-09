import agent from "../../../util/agent";

export function send(formData) {
  return agent
    .post('/contact')
    .type('json')
    .send(formData)
    .then(console.debug)
    .catch(console.error)
}
