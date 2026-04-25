import app from "../server/app";

export default {
  fetch(request: Request) {
    return app.fetch(request);
  },
};
