import axios from "axios";
import { BrowserUtility } from "utility/browserUtility";
import { StorageConstant } from "utility/constant";
import { APIPath } from "../utility/constant/apiPath";

const onSuccess = (response) => {
  console.debug("Request Successful!", response);
  return response.data;
};

const onError = async (error) => {
  console.debug("Request Failed:", error);

  console.debug("Request Failed:", error.config);

  if (error.response) {
    // Request was made but server responded with something
    // other than 2xx
    console.debug("Status:", error.response.status);
    console.debug("Data:", error.response.data);
    console.debug("Headers:", error.response.headers);
  }

  return Promise.reject({
    error: error.response.data.error || error.response.data,
    status: error.response.status,
  });
};

const request = async (options) => {
  let headers = {};

  headers["Authorization"] = `Bearer ${BrowserUtility.get(
    StorageConstant.token
  )}`;

  const client = axios.create({
    baseURL: APIPath.server,
    headers: { ...headers },
  });

  return client(options).then(onSuccess).catch(onError);
};

export class BaseService {
  static get = (url) => {
    return request({
      url,
      method: "GET",
    });
  };

  static post = (url, data) => {
    return request({
      url,
      method: "POST",
      data,
    });
  };

  static put = (url, data) => {
    return request({
      url,
      method: "PUT",
      data,
    });
  };

  static extenralAPICall = (url) => {
    const client = axios({
      url,
      method: "GET",
      timeout: 1000 * 3,
    });
    return client.then(onSuccess).catch(onError);
  };
}
