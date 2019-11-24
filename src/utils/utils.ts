export const getQueryStringData = function(): any {
  return location.search
    .slice(1)
    .split("&")
    .filter(Boolean)
    .reduce((data, paramStr) => {
      let [key, value] = paramStr.split("=");
      data[key] = decodeURIComponent(value) || "";
      return data;
    }, {});
};
