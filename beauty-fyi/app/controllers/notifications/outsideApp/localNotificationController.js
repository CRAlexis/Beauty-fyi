const { LocalNotifications } = require('@nativescript/local-notifications');
const randomString = require('random-string');

exports.newAppointment = (clientName, serviceName, date, time) => {
    
    LocalNotifications.schedule([
        {
            id: 0 + randomString({ length: 20 }),
            title: 'New Beauty-fyi appointment',
            body: 'Client name has booked a service',
            ticker: '',
            color: 'rgb(220,220,60',
            badge: 1,
            groupedMessages: ['Client name has booked Service name', 'On Sat, Dec 2 at 1:00pm', 'Tap here to view more details.'], //android only
            groupSummary: '', //android only
            ongoing: false, // makes the notification ongoing (Android only)
            //icon: 'res://heart',
            //image: 'https://cdn-images-1.medium.com/max/1200/1*c3cQvYJrVezv_Az0CoDcbA.jpeg',
            thumbnail: true,
            //interval: 'minute',
            channel: 'My Channel', // default: 'Channel'
            //sound: 'customsound-ios.wav', // falls back to the default sound on Android
            at: new Date(new Date().getTime() + 10 * 1000), // 10 seconds from now
        },
    ]).then(
        (scheduledIds) => {
            console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds));
        },
        (error) => {
            console.log('scheduling error: ' + error);
        }
    );
}

LocalNotifications.addOnMessageReceivedCallback((notification) => {
    //console.log('ID: ' + notification.id);
    //console.log('Title: ' + notification.title);
    //console.log('Body: ' + notification.body);
    const IDKey = parseInt(notification.id.toString().charAt(0))
    switch (IDKey) {
        case 0:
            console.log("appointment notification has been clicked")
            break;
    
        default:
            break;
    }
}).then(() => {
    console.log('Listener added');
});