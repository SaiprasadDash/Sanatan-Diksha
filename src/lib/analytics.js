import ReactGA from "react-ga4";

export const trackPage = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
