export const isAuthenticated = () => localStorage.getItem('us_lg') !== null;
export const getToken = () => localStorage.getItem('us_lg');
export const auth = token => {
  localStorage.setItem('us_lg', token);
};
export const logout = () => {
  localStorage.removeItem('us_lg');
};
//us_lg = usuário logado
