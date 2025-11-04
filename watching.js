import { getCurrentlyWatching } from "./CurrentlyWatching.js";

getCurrentlyWatching().then(data => {
  const { watching } = data;
  console.log(watching);
});