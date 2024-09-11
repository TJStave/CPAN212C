const _ = require("lodash");
const holidays = [
    {name: "Halloween", date: new Date(2024, 9, 31)},
    {name: "April Fools", date: new Date(2025, 3, 1)},
    {name: "Funny Weed Day", date: new Date(2025, 3, 20)},
    {name: "Puppy Day", date: new Date(2025, 2, 23)}
];
holidays.forEach((holiday) => {
    console.log(holiday.name + ": " + Math.floor((holiday.date - new Date()) / 86400000) + " Days")
});
let index = _.random(holidays.length - 1);
console.log(holidays[index].name + ": " + holidays[index].date.toDateString());
console.log(_.indexOf(holidays.map(holiday => holiday.name), "Halloween"));
console.log(_.indexOf(holidays.map(holiday => holiday.name), "Funny Weed Day"));