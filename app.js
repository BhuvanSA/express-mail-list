import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mailchimp from "@mailchimp/mailchimp_marketing";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/signup.html"));
});

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY, // Something Like this "cb300d55b85db96f58591b8za2b499g96-us21"
  server: process.env.MAILCHIMP_SERVER, // Something Like this "us21"
});

app.post("/", function(req, res) {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID; // Something like this "351212152f"
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  console.log(
    subscribingUser.firstName,
    subscribingUser.lastName,
    subscribingUser.email,
  );
  console.log(__dirname);
  async function run() {
    const response = await mailchimp.lists.addListMember(audienceId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    console.log(
      `Sucessfully added contact as an audience member. The contact's id is ${response.id}.`,
    );
    res.sendFile(__dirname + "/success.html");
  }
  run();
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
