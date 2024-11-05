const Heroma = require("../index.js");
const fs = require("fs");

const opt = JSON.parse(fs.readFileSync("./common.json", { encoding: "utf8", flag: "r" }));

let h = new Heroma(opt.host, opt.path);

// Log in using credentials from common.json
h.login(opt.user, opt.pass).then(() => {
    console.log("Logged in!");

    // Get work schedule for one week
    h.getWorkSchedule("2024-11-04", "2024-11-12").then(workschedule => {
        // Find person by name
        let person = workschedule.getPeople().byName("John", "Doe");

        // Retrieve their work schedule and print it to the console
        console.log(workschedule.getShifts().byPerson(person));

        // Log off
        h.logout();
    });
});