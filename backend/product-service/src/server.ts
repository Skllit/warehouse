// import app from './app';

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
});
