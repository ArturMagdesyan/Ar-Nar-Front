import axios from "axios";
import {API} from "../base_url";


const client = axios.create({
  baseURL: API,
  json: true
});

export default {
  async execute(method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "text",
      }
    }).then(req => {
      return req.data;
    });
  },

  get(api) {
    return this.execute("get", api);
  },

  delete(api) {
    return this.execute("delete", api);
  },

  post(api, data) {
    return this.execute("post", api, data);
  },

  put(api, data) {
    return this.execute("put", api, data);
  }
};
