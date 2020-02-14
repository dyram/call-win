/**
 * @name handleFail
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err) {
  console.log("Error : ", err);
};

// Queries the container in which the remote feeds belong
let remoteContainer = document.getElementById("remote-container");
let canvasContainer = document.getElementById("canvas-container");
/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */
function addVideoStream(streamId) {
  let streamDiv = document.createElement("div"); // Create a new div for every stream
  streamDiv.id = streamId; // Assigning id to div
  streamDiv.style.transform = "rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
  remoteContainer.appendChild(streamDiv); // Add new div to container
}
/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to remove the video stream from "remote-container"
 */
function removeVideoStream(evt) {
  let stream = evt.stream;
  stream.stop();
  let remDiv = document.getElementById(stream.getId());
  remDiv.parentNode.removeChild(remDiv);
  console.log("Remote stream is removed " + stream.getId());
}

// Client Setup
// Defines a client for RTC
let client = AgoraRTC.createClient({
  mode: "live",
  codec: "h264"
});

// Client Setup
// Defines a client for Real Time Communication
client.init(
  "fa04cfb20f564d6284e84ccedea717a0",
  () => console.log("AgoraRTC client initialized"),
  handleFail
);

//Stream name
const streamName = "dyram-call";

// The client joins the channel
client.join(
  null,
  streamName,
  null,
  uid => {
    // Stream object associated with your web cam is initialized
    let localStream = AgoraRTC.createStream({
      streamID: uid,
      audio: false,
      video: true,
      screen: false
    });

    // Associates the stream to the client
    localStream.init(function() {
      //Plays the localVideo
      localStream.play("me");

      //Publishes the stream to the channel
      client.publish(localStream, handleFail);
    }, handleFail);

    //When a stream is added to a channel
    client.on("stream-added", function(evt) {
      client.subscribe(evt.stream, handleFail);
    });
    //When you subscribe to a stream
    client.on("stream-subscribed", function(evt) {
      let stream = evt.stream;
      addVideoStream(stream.getId());
      stream.play(stream.getId());
      //   addCanvas(stream.getId());
    });
    //When a person is removed from the stream
    client.on("stream-removed", removeVideoStream);
    client.on("peer-leave", removeVideoStream);
  },
  handleFail
);

/*Handle call cut */
function callCut() {
  console.log("Call cut");
  close();
  return false;
}
function enterCall() {
  console.log("Call entered");
  window.open(
    "file:///home/system12/gitDemos/Agora-demo-web-master/index.html"
  );
}

function welcome() {
  alert("Welcome to your stream...\nYour Stream Name is " + streamName);
}