const Observable = require("tns-core-modules/data/observable").Observable;
const calendarModule = require("nativescript-ui-calendar");
//const pageData = new Observable();

exports.onPageLoaded = function (args) {
    var items = [];
    items.push(
        {
            timeHeader: "PM",
            dayHeader: "Today",
            startTime: "",
            startLine: "",
            itemDesc: "",
            itemDescClass: "",
            endLine: "",
            endTime: "",
            backgroundColor: "#fff",
            headerVissibilty: true,
            startVissibility: false,
            endVissibility: false,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "4:00",
            startLine: "line",
            itemDesc: "Tiffany Budhyanto for 1st Touch-Up in-studio",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "5:30",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: true,
            endVissibility: true,
        },
        {
            timeHeader: "should not show",
            dayHeader: "",
            startTime: "",
            startLine: "",
            itemDesc: "15 MINUTE BUFFER",
            itemDescClass: "listViewNoteBuffer",
            endLine: "line", 
            endTime: "5:45",
            backgroundColor: "#e9e9e9",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "5:45",
            startLine: "line",
            itemDesc: "Ron Swanson for 1st Touch-Up at 2559 BlueBerry Avenue, Second Line, Toronto, ON",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "7:15",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "7:15",
            startLine: "line",
            itemDesc: "Britney Spears for inital Appointment in-studio",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "9:15",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
        {
            timeHeader: "AM",
            dayHeader: "TOMORROW",
            startTime: "",
            startLine: "",
            itemDesc: "",
            itemDescClass: "",
            endLine: "",
            endTime: "",
            backgroundColor: "#fff",
            headerVissibilty: true,
            startVissibility: false,
            endVissibility: false,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "11:00",
            startLine: "line",
            itemDesc: "Rich Gilbank for inital Appointment at 200 Adelaide St. W. Toronot, ON",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "1:00",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: true,
            endVissibility: true,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "7:15",
            startLine: "line",
            itemDesc: "Britney Spears for second Appointment in-studio",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "3:15",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
        {
            timeHeader: "should not show",
            dayHeader: "",
            startTime: "",
            startLine: "",
            itemDesc: "45 MINUTE BUFFER",
            itemDescClass: "listViewNoteBuffer",
            endLine: "line",
            endTime: "4:00",
            backgroundColor: "#e9e9e9",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
        {
            timeHeader: "",
            dayHeader: "",
            startTime: "4:00",
            startLine: "line",
            itemDesc: "Tiffany Budhyanto for 1st Touch-Up in-studio",
            itemDescClass: "listViewNote",
            endLine: "line",
            endTime: "5:30",
            backgroundColor: "#fff",
            headerVissibilty: false,
            startVissibility: false,
            endVissibility: true,
        },
    )
    var page = args.object;
    var listview = page.getViewById("listview");
    listview.items = items;
}


/*exports.onPageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = pageData;

    const eventTitles = ["Lunch with Steve", "Meeting with Jane", "Q1 Recap Meeting"];
    const events = [];

    let j = 1;
    for (let i = 0; i < eventTitles.length; i++) {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), j * 2, 12);
        const endDate = new Date(now.getFullYear(), now.getMonth(), (j * 2) + (j % 3), 13);
        const event = new calendarModule.CalendarEvent(eventTitles[i], startDate, endDate);
        events.push(event);
        j++;
    }
    pageData.set("events", events);
}*/

function onNavigatedTo(){
    return true
}
//pageData.set("onDateSelected", function(args){
//    console.dir(args);
//})


exports.onNavigatedTo = onNavigatedTo;