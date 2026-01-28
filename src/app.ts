import server from "./server";

const port: number = Number(process.env.PORT) || 3000;

server.listen(port, () => {
  console.log(`App Running on ${port}`);
});
