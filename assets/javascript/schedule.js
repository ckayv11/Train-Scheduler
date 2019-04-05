// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAkhyrxjiZHfTo7WO1hlzda7L6VL4nlXGk",
    authDomain: "my-firebase-project-477f7.firebaseapp.com",
    databaseURL: "https://my-firebase-project-477f7.firebaseio.com",
    projectId: "my-firebase-project-477f7",
    storageBucket: "my-firebase-project-477f7.appspot.com",
    messagingSenderId: "1092794997003"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();

  //Initial Values
  var trainName = "";
  var trainDestination = "";
  var trainTime = "";
  var trainFrequency = 0;

// 2. Capture button click
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grab User Input from form
    trainName = $("#train-name-input").val().trim();
    trainDestination = $("#destination-input").val().trim();
    trainTime = $("#time-input").val().trim();
    trainFrequency = $("#frequency-input").val().trim();

    // Push input values to the database
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    //Clear all the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database
database.ref().on("child_added", function(childSnapshot) {
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var trainTime = childSnapshot.val().time;
    
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    // Moment.js calculations

    // First Time (pushed back 1 year to make sure it comes before current time)
    var convertedTime = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(convertedTime);

    // Current Time
    var currentTime = moment();
    console.log("Current time: " + moment(currentTime).format("hh:mm"));

    // Difference between times
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    console.log("Difference in Time: " + diffTime);

    // Time apart (remainder)
    var timeRemainder = diffTime % trainFrequency;
    console.log(timeRemainder);

    // Calculate minutes away from next train
    var minutesAway = trainFrequency - timeRemainder;
    console.log("Minutes Away: " + minutesAway);

    // Calculate when the next train will arrive
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("Next Arrival: " + moment(nextArrival).format("hh:mm"));

    // Create row in the html when a user adds an entry
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(nextArrival).format("hh:mm A")),
        $("<td>").text(minutesAway)
    );
    $("#schedule-table > tbody").append(newRow);

});


