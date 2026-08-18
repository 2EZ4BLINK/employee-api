import app from "./app.js";

const PORT = process.env.PORT || 3000;
console.log("PORT:", process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
