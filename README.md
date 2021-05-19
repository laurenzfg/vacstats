# Vacstats

[Live version](https://vacstats.laurenzfg.com)

This app displays a quick overview over the vaccination efforts in Germany.
It is to be used in conjunction with Marlon Lückert's
[COVID Numbers API](https://github.com/marlon360/rki-covid-api).

The endpoint of API has to be specified in App.js.

## Push Notifications

The *killer feature* of this vaccination page is Push Messages.
Since RKI is publishing vaccination data on a random time, it is desireable
to be notified as soon as vaccination data is available.

Hence, I developed a patch to Marlon's API which calls a web hook as soon as
a endpoint changes. Note that the vaccination endpoint needs to be called
quite frequently to make sure the API server polls the RKI data often enough.
A nice hack to achieve is to set up an uptime monitor which calls the vaccination
endpoint every minute. In conjunction with the cache of the API, this ensures
that RKI is polled every 15 minutes or so and the web hook is triggered reasonably
fast after update.

This projects contains a serverless function ready to be deployed as a Netlify Function
(tested) or AWS Lambda or some comparable service.
This function serves as the web hook endpoint to the API and itselfs
triggers a One Signal Web push notification to everyone who subscribed in this web app.

If you want to setup push in your own fork of this web app you need to:

- Swap the included One Signal API key for one registered by you
- Save your private One Signal API key as the appropiate environment variables
- Register the URL of the serverless function in the netlify folder as a web hook
    in your instance of Marlon's API (with patched web hook support)

Note that we try to include web hook support in the upstream of Marlon's API.
