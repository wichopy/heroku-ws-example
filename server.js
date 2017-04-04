'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', (data) => {
    data = JSON.parse(data)
      // wss.broadcast(event);
      // debugger;
    console.log(data);
    switch (data.type) {
      case 'auth0-login':
        login(data)
        break;

      case "eventCreation-newProject":
        eventCreation_newProject(data, ws);
        break;

      case 'start-time-for-contractor-tasks':
        startTimeForContractorTasks(data);
        clickedStartButton(data, ws);
        updatingProgressBar(data);
        break;

      case 'end-time-for-contractor-tasks-and-updating-progress-bar':
        endTimeForContractorTasks(data);
        sendDonutGraphInfo(data, ws);
        clickedEndButton(data, ws);
        updatingProgressBar(data);
        break;

      case 'request-tasks-and-users':
        getTasksAndUsers(data, ws);
        break;

      case 'request-tasks':
        // getTasks(data, ws);
        console.log('inside my switch case!')
        break;

      case 'add-contractor-to-progress-bar':
        addContractorToProgressBar(data);
        break;

      case 'askingForNewsfeedUpdate':
        updateNewsfeed(data);
        break;

      case 'server-state-store':
        setProgressBarState(data, ws);
        break;

      case 'getProjectListforManager':
        console.log('inside my switch case for get manager name!')
        console.log(`profile email: ${data.email}`)
          // getProjectListforManager(data.email, ws);
        break;

      case 'counter':
        // counter(data, ws);
        console.log('inside my switch case for counter!')
        break;

      default:
        throw new Error("Unknown event type " + data.type)
    }
    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', (event) => {
      console.log('Client disconnected');
    });
  });
});


setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);