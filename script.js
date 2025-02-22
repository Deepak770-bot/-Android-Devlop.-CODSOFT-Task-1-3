const alarmList = [];
const alarmSound = document.getElementById("alarm-sound");
let ringingAlarmIndex = null;

// Update current time
function updateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    document.getElementById("current-time").innerText = `${formattedTime} - ${formattedDate}`;
    checkAlarms();
}

setInterval(updateTime, 1000);

// Set Alarm
function setAlarm() {
    const alarmDateTime = document.getElementById("alarm-datetime").value;
    if (!alarmDateTime) {
        alert("Please select a valid date and time!");
        return;
    }

    const alarmObj = { time: new Date(alarmDateTime), active: true };
    alarmList.push(alarmObj);
    displayAlarms();
}

// Display Alarms
function displayAlarms() {
    const alarmListElement = document.getElementById("alarm-list");
    alarmListElement.innerHTML = "";

    alarmList.forEach((alarm, index) => {
        const formattedTime = alarm.time.toLocaleString(); //Show in local format
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        ${formattedTime}
        <button class="toggle-btn" onclick="toggleAlarm(${index})">${alarm.active ? "ON" : "OFF"}</button>
        <button class="delete-btn" onclick="deleteAlarm(${index})">Delete</button>
        `;
        alarmListElement.appendChild(listItem);
    });
}

// Toggle Alarm ON/OFF
function toggleAlarm(index) {
    alarmList[index].active = !alarmList[index].active;
    displayAlarms();
}

// Check if an alarm should ring
function checkAlarms() {
    const now = new Date();
    const currentTime = now.getTime(); // Get local time in milliseconds

    alarmList.forEach((alarm, index) => {
        if (alarm.active && alarm.time.getTime() <= currentTime) { // Compare in local time
            try {
                alarmSound.play().catch(err => console.log("Sound error: ", err));
            } catch (error) {
                console.log("Playback error: ", error);
            }

            alert("⏰ Alarm Ringing!"); // Show alert when alarm rings
            alarm.active = false; // Disable alarm after ringing
            ringingAlarmIndex = index;
            displayAlarms();
            showAlarmControls();
        
        }
    });
}

// Show Dismiss & Snooze Buttons
function showAlarmControls() {
    const alarmControls = document.getElementById("alarm-controls");
    if (alarmControls) {
        alarmControls.classList.remove("hidden");
    }
}

// Dismiss Alarm
function dismissAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    const alarmControls = document.getElementById("alarm-controls");
    if (alarmControls) {
        alarmControls.classList.add("hidden");
    }
}

// Snooze Alarm (Adds 5 min)
function snoozeAlarm() {
    if (ringingAlarmIndex !== null) {
        let snoozeTime = new Date(alarmList[ringingAlarmIndex].time);
        snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);

        alarmList[ringingAlarmIndex] = { time: snoozeTime, active: true }; // Update alarm list
        ringingAlarmIndex = null;
        displayAlarms();
        dismissAlarm();
    }
}

// Delete Alarm
function deleteAlarm(index) {
    alarmList.splice(index, 1);
    displayAlarms();
}