import agent from "../util/agent";

export function login(username, password) {
  return agent
    .post('/login')
    .send({username, password})
    .then(res => res.body)
}

export function logout() {
  return agent
    .post('/logout')
}

export function signup(attributes) {
  return agent
    .post('/signup')
    .send(attributes)
    .then(res => res.body)
}
