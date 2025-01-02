import axios from "axios";

export const commonApi = async (httpRequest, url, reqBody, reqHeader) => {
    console.log("inside common api")
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
  };

  console.log(reqConfig)
  return await axios(reqConfig)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
