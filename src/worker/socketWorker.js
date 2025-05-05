importScripts('https://cdn.socket.io/4.7.4/socket.io.min.js');

const sockets = [];
for (let i = 0; i < 6; i++) {
  const socket = io('your-socket-url');
  sockets.push(socket);
}

onmessage = (e) => {
  const offscreen = e.data;
  const canvas = new OffscreenCanvas(offscreen.width, offscreen.height);
  const context = canvas.getContext('2d');

  setInterval(() => {
    context.drawImage(offscreen, 0, 0);
    const frame = canvas.convertToBlob({ type: 'image/jpg' });

    frame.then((blob) => {
      sockets.forEach((socket) => {
        socket.emit('message', blob);
      });
    });
  }, 100);
};


