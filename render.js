// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer

// const asyncMsgBtn = document.getElementById('async-msg')
// asyncMsgBtn.addEventListener('click', function () {
//   ipc.send('asynchronous-message', 'ping')
// })

// ipc.on('asynchronous-reply', function (event, arg) {
//   const message = `Asynchronous message reply: ${arg}`
//   document.getElementById('async-reply').innerHTML = message
// })

ipc.on('ping', (event, message) => {
  console.log(message);
})

const notification = {
  title: 'Basic Notification',
  body: 'Short message part'
}
const notificationButton = document.body;

notificationButton.addEventListener('click', function () {
  const myNotification = new window.Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
})