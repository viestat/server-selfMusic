#How to use
1. Fork and clone the repo.

2. go to the "server-selfMusic" directory and run:
  
  `npm install`
  
  create a folder named "config" and inside that folder a file named "api.config.json"

3. inside of "api.config.json" copy and fill with your own keys:
    ```javascript
    {
        "Spotify": {
        "client_id": "YOUR-CLIENT-ID",
        "client_secret": "YOUR-CLIENT-SECRET"
      }
    }
    ```
  * To get your own keys go to: [Spotify Developer site](https://developer.spotify.com/my-applications/) and register your app.


4. run:

  `node index.js`
