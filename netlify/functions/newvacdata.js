let sendNotification = data => {
    return new Promise(function(resolve, reject) {
        var headers = {
                "content-type": "application/json; charset=utf-8",
                "authorization": "basic " + process.env.ONESIGNAL_SECRET
        };

        var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "post",
                headers: headers
        };

        var https = require('https');
        var req = https.request(options, function(res) {
            res.on('data', function(data) {
                console.log("response:");
                console.log(JSON.parse(data));
                resolve();
            });
        });

        req.on('error', function(e) {
                console.log("error:");
                console.log(e);
                reject();
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

exports.handler = async function(event, context) {
    console.log("Received New Vac Data Trigger from API");

    var message = { 
        app_id: process.env.ONESIGNAL_APP_ID,
        contents: {"en": "Vew vaccination data available!"},
        headings: {"en": "German Covid Vaccinations"},
        included_segments: ["Subscribed Users"]
    };

    await sendNotification(message);

    return {
        statusCode: 200,
    	body: JSON.stringify({message: "Request received, details logged to Netlify"})
    };
}
