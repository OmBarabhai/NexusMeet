// // import { Server } from "socket.io";

// // let connections = {};
// // let messages = {};
// // let timeOnline = {};

// // export const connectToSocket = (server) => {
// //   const io = new Server(server, {
// //     cors: {
// //       origin: "*",
// //       methods: ["GET", "POST"],
// //       allowedHeaders: ["*"],
// //       credentials:true
// //     }
// //   });

// //   io.on("connection", (socket) => {
    
// //     socket.on("join-call", (path) => {
// //       if (connections[path] === undefined) {
// //         connections[path] = [];
// //       }
// //       connections[path].push(socket.id);
// //       timeOnline[socket.id] = new Date();

// //       // Notify all users in the room
// //       for (let a = 0; a < connections[path].length; a++) {
// //         io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
// //       }

// //       // Send chat history if exists
// //       if (messages[path] !== undefined) {
// //         for (let a = 0; a < messages[path].length; a++) {
// //           io.to(socket.id).emit(
// //             "chat-message",
// //             messages[path][a]["data"],
// //             messages[path][a]["sender"],
// //             messages[path][a]["socketIdSender"]   // ✅ fixed property name
// //           );
// //         }
// //       }
// //     });

// //     socket.on("signal", (toId, message) => {
// //       io.to(toId).emit("signal", socket.id, message);
// //     });

// //     socket.on("chat-message", (data, sender) => {
// //       const [matchingRoom, found] = Object.entries(connections).reduce(
// //         ([room, isFound], [roomKey, roomValue]) => {
// //           if (!isFound && roomValue.includes(socket.id)) {
// //             return [roomKey, true];
// //           }
// //           return [room, isFound];
// //         },
// //         ["", false]
// //       );

// //       if (found === true) {
// //         if (messages[matchingRoom] === undefined) {
// //           messages[matchingRoom] = [];
// //         }

// //         messages[matchingRoom].push({
// //           sender,
// //           data,
// //           socketIdSender: socket.id,  // ✅ consistent
// //         });

// //         console.log("message", matchingRoom, ":", sender, data); // ✅ fixed

// //         // Send to everyone in the room
// //         connections[matchingRoom].forEach((elem) => {
// //           io.to(elem).emit("chat-message", data, sender, socket.id);
// //         });
// //       }
// //     });

// //     socket.on("disconnect", () => {
// //       var diffTime = Math.abs(timeOnline[socket.id] - new Date());

// //       var key;

// //       for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
// //         for (let a = 0; a < v.length; ++a) {
// //           if (v[a] === socket.id) {
// //             key = k;

// //             // Notify others in the room
// //             for (let a = 0; a < connections[key].length; ++a) {
// //               io.to(connections[key][a]).emit("user-left", socket.id);
// //             }

// //             // Remove from room
// //             var index = connections[key].indexOf(socket.id);
// //             connections[key].splice(index, 1);

// //             // Delete room if empty
// //             if (connections[key].length === 0) {
// //               delete connections[key];
// //             }
// //           }
// //         }
// //       }
// //     });
// //   });

// //   return io;
// // };


// import { Server } from "socket.io";

// let connections = {};
// let messages = {};
// let timeOnline = {};
// let socketUsernameMap = {}; // ✅ Added to store socket.id -> username

// export const connectToSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["*"],
//       credentials:true
//     }
//   });

//   io.on("connection", (socket) => {

//     // ----- JOIN CALL (with username) -----
//     socket.on("join-call", (path, username) => {
//       socketUsernameMap[socket.id] = username; // store username

//       if (connections[path] === undefined) {
//         connections[path] = [];
//       }
//       connections[path].push(socket.id);
//       timeOnline[socket.id] = new Date();

//       // Notify all users in the room with username
//       for (let a = 0; a < connections[path].length; a++) {
//         io.to(connections[path][a]).emit(
//           "user-joined",
//           socket.id,
//           connections[path],
//           username
//         );
//       }

//       // Send chat history if exists
//       if (messages[path] !== undefined) {
//         for (let a = 0; a < messages[path].length; a++) {
//           io.to(socket.id).emit(
//             "chat-message",
//             messages[path][a]["data"],
//             messages[path][a]["sender"],
//             messages[path][a]["socketIdSender"]
//           );
//         }
//       }
//     });

//     // ----- SIGNAL (with username) -----
//     socket.on("signal", (toId, message) => {
//       const fromUsername = socketUsernameMap[socket.id] || "Unknown";
//       io.to(toId).emit("signal", socket.id, message, fromUsername);
//     });

//     // ----- CHAT MESSAGE -----
//     socket.on("chat-message", (data, sender) => {
//       const [matchingRoom, found] = Object.entries(connections).reduce(
//         ([room, isFound], [roomKey, roomValue]) => {
//           if (!isFound && roomValue.includes(socket.id)) {
//             return [roomKey, true];
//           }
//           return [room, isFound];
//         },
//         ["", false]
//       );

//       if (found === true) {
//         if (messages[matchingRoom] === undefined) {
//           messages[matchingRoom] = [];
//         }

//         messages[matchingRoom].push({
//           sender,
//           data,
//           socketIdSender: socket.id,
//         });

//         // Send to everyone in the room
//         connections[matchingRoom].forEach((elem) => {
//           io.to(elem).emit("chat-message", data, sender, socket.id);
//         });
//       }
//     });

//     // ----- DISCONNECT -----
//     socket.on("disconnect", () => {
//       delete socketUsernameMap[socket.id]; // remove username mapping
//       var diffTime = Math.abs(timeOnline[socket.id] - new Date());
//       delete timeOnline[socket.id];

//       var key;

//       for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
//         for (let a = 0; a < v.length; ++a) {
//           if (v[a] === socket.id) {
//             key = k;

//             // Notify others in the room
//             for (let a = 0; a < connections[key].length; ++a) {
//               io.to(connections[key][a]).emit("user-left", socket.id);
//             }

//             // Remove from room
//             var index = connections[key].indexOf(socket.id);
//             connections[key].splice(index, 1);

//             // Delete room if empty
//             if (connections[key].length === 0) {
//               delete connections[key];
//             }
//           }
//         }
//       }
//     });
//   });

//   return io;
// };



import { Server } from "socket.io";

let connections = {};      // roomPath => [socketIds]
let messages = {};         // roomPath => [{sender, data, socketIdSender}]
let timeOnline = {};       // socketId => joinTime
let socketUsernameMap = {}; // socketId => username

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // ================= Join Call =================
    socket.on("join-call", (path, username) => {
      socketUsernameMap[socket.id] = username;

      if (!connections[path]) connections[path] = [];
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify all users in the room about the new user
      connections[path].forEach(id => {
        io.to(id).emit("user-joined", socket.id, connections[path], username);
      });

      // Send chat history if exists
      if (messages[path]) {
        messages[path].forEach(msg => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg.socketIdSender
          );
        });
      }
    });

    // ================= Signal Event =================
    socket.on("signal", (toId, message) => {
      const fromUsername = socketUsernameMap[socket.id] || "Unknown";
      io.to(toId).emit("signal", socket.id, message, fromUsername);
    });

    // ================= Chat Message =================
    socket.on("chat-message", (data, sender) => {
      // Find the room of this socket
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) return [roomKey, true];
          return [room, isFound];
        },
        ["", false]
      );

      if (!found) return;

      if (!messages[matchingRoom]) messages[matchingRoom] = [];

      messages[matchingRoom].push({
        sender,
        data,
        socketIdSender: socket.id,
      });

      // Broadcast to all users in room
      connections[matchingRoom].forEach(id => {
        io.to(id).emit("chat-message", data, sender, socket.id);
      });
    });

    // ================= Disconnect =================
    socket.on("disconnect", () => {
      const rooms = Object.entries(connections);

      rooms.forEach(([roomPath, ids]) => {
        if (ids.includes(socket.id)) {
          // Notify others
          ids.forEach(id => io.to(id).emit("user-left", socket.id));

          // Remove from room
          connections[roomPath] = ids.filter(id => id !== socket.id);
          if (connections[roomPath].length === 0) delete connections[roomPath];
        }
      });

      delete socketUsernameMap[socket.id];
      delete timeOnline[socket.id];
    });
  });

  return io;
};
