import axios from "axios";
import { getToken } from "./auth";

const rest = axios.create({
  baseURL: "http://127.0.0.1:4000"
});

rest.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
});

let isAlreadyFetchingAccessToken = false
let subscribers = [];

/*
function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token))
}
*/

function addSubscriber(callback) {
  subscribers.push(callback)
}

rest.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const { config, response: { status } } = error
  const originalRequest = config

  if (status === 401) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true
      /*store.dispatch(fetchAccessToken()).then((access_token) => {
        isAlreadyFetchingAccessToken = false
        onAccessTokenFetched(access_token)
      })*/
    }

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(access_token => {
        originalRequest.headers.Authorization = 'Bearer ' + access_token
        resolve(rest(originalRequest))
      })
    })
    return retryOriginalRequest
  }
  return Promise.reject(error)
})


/*
rest.interceptors.request.use(function (config) {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
}, function (error) {
  console.log('<*>',error)
  // Do something with request error
  return Promise.reject(error);
});
*/


export default rest;