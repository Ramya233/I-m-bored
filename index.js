import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import  ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(express.static("public"));
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/" , async(req, res) => {
  try{
  const response = await axios.get("https://bored-api.appbrewery.com/random");
  const result = response.data;
  res.render("index.ejs", { data : result});
  }catch(error){
    console.log("Failed to display the data: " + error.message);
    res.render("index.ejs", {error : error.message});
  }
});

app.post("/", async(req, res) => {
  try{
  console.log(req.body);
  const type = req.body.type 
  const participants = req.body.participants
  const response = await axios.get(
    `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
  const result = response.data;
  console.log(result);
  res.render("index.ejs", {
    data: result[Math.floor(Math.random()*result.length)], 
  });
  }catch(error){
    console.log("Failed to make request: ", error.message);
   res.render("index.ejs", 
   {error : "No activities that match your criteria",
  }); 
  }

});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
