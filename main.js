var database = JSON.parse(localStorage.getItem("database") || "{}");
var session = JSON.parse(localStorage.getItem("sessions") || 0);
var weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

(function () {
	// Declaring variables
	
	const fehBody = document.body;
	const workDurationInput = document.getElementById("work-duration");
	const restDurationInput = document.getElementById("rest-duration");
	const circleProgress = document.querySelector(".circle-progress");
	const timerTime = document.getElementById("feh-timer-time");
	
	const btnToggleSettings = document.getElementById('feh-toggle-settings');
	const btnCloseSettings = document.getElementById('feh-close-settings');
	const btnResetStatistics = document.getElementById('reset-btn');

	let workDuration = parseInt(workDurationInput.value) * 60;
	let restDuration = parseInt(restDurationInput.value) * 60;
	let remainingTime = workDuration;
	let isPaused = true;
	let isWorking = true;
	let isrestarted = true;
	let intervalId;
	
	const completedSessionsElement = document.getElementById("feh-completed-sessions");	
		
	
	// Pomodoro overlay screen

	window.addEventListener("load", () => {
		fehBody.classList.add('page-loaded');
		completedSessionsElement.textContent = session;
	});
	
	
	// Toggle settings screen
	
	function setBodySettings() {
		fehBody.classList.contains('settings-active') ? fehBody.classList.remove('settings-active') : fehBody.classList.add('settings-active');		
	}

	function toggleSettings() {
		if (event.type === 'click') {
			setBodySettings();
		}
		else if((event.type === 'keydown' && event.keyCode === 27)) {
			fehBody.classList.remove('settings-active');
		}
	}

	//clean localStorage at button push
	function clear_localStorage() {		
		window.localStorage.clear();		
	}

	btnToggleSettings.addEventListener('click', toggleSettings);
	btnCloseSettings.addEventListener('click', toggleSettings);
	document.addEventListener('keydown', toggleSettings);
	btnResetStatistics.addEventListener('click', clear_localStorage);
			
		
	// Pause button is clicked
	
	const pauseBtn = document.getElementById("pause-btn");
	pauseBtn.addEventListener("click", () => {
		isPaused = true;
		
		//change color pause button
		pauseBtn.style.backgroundColor = "#4d4c4cb8";

		fehBody.classList.remove('timer-running');
		fehBody.classList.add('timer-paused');
		
		// document.title = "Timer Paused";
	});

	const restartBtn = document.getElementById("restart-btn");
	restartBtn.addEventListener("click", () =>{
		window.location.reload();

		//rechange color pause button
		// pauseBtn.style.backgroundColor = "#67d1ad";
	});

	// Play button is clicked + start timer

	const startBtn = document.getElementById("start-btn");
	startBtn.addEventListener("click", () => {
		isPaused = false;
		isrestarted = false;

		//rechange color pause button
		pauseBtn.style.backgroundColor = "#67d1ad";

		fehBody.classList.add('timer-running');

		// Is work timer

		if (isWorking) {
			fehBody.classList.remove('timer-paused');
		}
		
		// rest timer

		else {
			fehBody.classList.add('rest-mode');
			fehBody.classList.remove('timer-paused');
			
		}

		if (!intervalId) {
			intervalId = setInterval(updateTimer, 1000);
		}
	});
	
	
	// Get work / rest times from settings

	workDurationInput.addEventListener("change", () => {
		workDuration = parseInt(workDurationInput.value) * 60;
		if (isWorking) {
			remainingTime = workDuration;
			updateProgress();
		}
	});

	restDurationInput.addEventListener("change", () => {
		restDuration = parseInt(restDurationInput.value) * 60;
		if (!isWorking) {
			remainingTime = restDuration;
			updateProgress();
		}
	});
	
	
	// Timer

	function updateTimer() {

		const workFinished = new Audio("/music/timeToRest.mp3");
		const restFinished = new Audio("/music/timeToWork.mp3");
		
		if (!isPaused) {
			
			remainingTime -= 1;

			// When timer stops running

			if (remainingTime <= 0) {
				isWorking = !isWorking;
				remainingTime = isWorking ? workDuration : restDuration;

				// Check what timer (work/rest) has just finished

				if(!isWorking) {
					
					// Increment the completed sessions counter and update the display

					fehBody.classList.add('rest-mode');
					fehBody.classList.remove('timer-running');
							
					session++;
					localStorage.setItem("sessions", session);

					completedSessionsElement.textContent = session;

					//save the prev time
					workDurationInput.value = workDuration / 60;


				}

				else {
					fehBody.classList.remove('rest-mode');
					fehBody.classList.remove('timer-running'); 

					//save the prev time
					restDurationInput.value = restDuration / 60;

					//for diagram data
					var date = new Date();
					var week = date.getDay();
					week = weeks.at(week-1);

					var time = {workTime: workDuration / 60, restTime: restDuration / 60};
					const keys = Object.keys(database);
					
					if (!keys.includes(week)){
						database[week] = time;
					}
					else {
						database[week].workTime += time.workTime
						database[week].restTime += time.restTime
					}

					

					localStorage.setItem("database", JSON.stringify(database));					
				}
								
				//Switch alarm depending on pomodoro or rest period

				playAlarm = isWorking ? restFinished : workFinished;
				playAlarm.play();
				
				
				// Timer has finished			
				isPaused = true;				
			}

			document.title = timerTime.textContent = formatTime(remainingTime);

			updateProgress();

		}		
	}
	
	
	// Update circle progress

	function updateProgress() {

		const radius = 45;
		const circumference = 2 * Math.PI * radius;

		const totalDuration = isWorking ? workDuration : restDuration;
		const dashOffset = circumference * remainingTime / totalDuration;
		circleProgress.style.strokeDashoffset = dashOffset;
		timerTime.textContent = formatTime(remainingTime);
	}

	// Format time

	function formatTime(seconds) {
		let minutes = Math.floor(seconds / 60);
		let remainingSeconds = seconds % 60;		

		if (minutes < 0 || minutes > 240 || isNaN(minutes)) {			
			minutes = 0;
			remainingSeconds = 0;
		}

		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;			
	}
	
	updateProgress();

	// window.localStorage.clear();

})();