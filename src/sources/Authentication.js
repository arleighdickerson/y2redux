import agent from "../util/agent";

export function login(username, password) {
  return agent
    .post('/login')
    .send({LoginForm: {username, password}})
    .then(res => res.body)
}

export function logout() {
  return agent.post('/logout')
}
