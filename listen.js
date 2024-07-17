const app = require("./app.js");
const { PORT = 9095 } = proces.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
