var database = JSON.parse(localStorage.getItem("database") || "{}");
var weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

date = new Date();

const start = dateFns.startOfWeek(date, {weekStartsOn: 1});
const end = dateFns.endOfWeek(date, {weekStartsOn: 1});


//clean localStorage at the end of the week

if (Date() === end) {
  window.localStorage.clear();
}


//initializing the chart
var barChart;
Chart.defaults.color = "rgba(0, 0, 0);";
Chart.defaults.font.size = 13;
Chart.defaults.font.family = 'Noto Sans HK';

//run at page load
var array1 = [];
var temp1 = updateWorkData();
var array2 = [];
var temp2 = updateRestData();

for (let week in weeks) {
  week = weeks[week];
  array1.push(temp1[week]);
  array2.push(temp2[week]);
}

var barChart = create_diagram(array1, array2);


//run at button push
function update_diagram() {

  barChart.destroy();

  var arr1 = [];
  var tmp1 = updateWorkData();
  var arr2 = [];
  var tmp2 = updateRestData();

  for (let week in weeks) {
    week = weeks[week];
    arr1.push(tmp1[week]);
    arr2.push(tmp2[week]);
  }

  barChart = create_diagram(arr1, arr2);
}

function create_diagram(arr1, arr2)
{
  
    var dgm = document.getElementById('diagram');  
  
    let xScaleConfig = {
      ticks: {
        maxRotation: 0
      },
      stacked: true
    }

    var config = {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [{
          label: "Rest time",
          data: arr2,
          backgroundColor: 'rgba(255, 26, 104, 1)',
          borderColor: 'rgba(255, 26, 104, 1)',
          borderWidth: 1,        
          categoryPercentage: 0.5
        },{   
          label: "Work time",     
          data: arr1,
          backgroundColor: 'rgba(54, 162, 235, 1)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: xScaleConfig,
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes',
              padding: 0,
              position: 'center'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: "Work statistics",
            font: {
              size: 20,              
              family: 'Noto Sans HK',
              padding: 0   
            }
          },
          legend: {
            display: true            
            }
          }      
        }  
    }
  barChart = new Chart(dgm, config);
  return barChart;


}

function updateWorkData() {
  var dictWorkDays = {};

  const keys1 = Object.keys(dictWorkDays);
  const keys2 = Object.keys(database);  
  
  for (let key in weeks) {
    key = weeks[key];
          
    if (keys2.includes(key)) {

      if (keys1.includes(key)) {
        dictWorkDays[key] += database[key].workTime;
      }
      else {
        dictWorkDays[key] = database[key].workTime;
      }

    }
    else {
      dictWorkDays[key] = 0;
    } 

  }
  return dictWorkDays;
}

function updateRestData() {
  var dictRestDays = {};
  const keys1 = Object.keys(dictRestDays);
  const keys2 = Object.keys(database);
  
  for (let key in weeks) {
    key = weeks[key];
          
    if (keys2.includes(key)) {

      if (keys1.includes(key)) {
        dictRestDays[key] += database[key].restTime;
      }
      else {
        dictRestDays[key] = database[key].restTime;
      }

    }
    else {
      dictRestDays[key] = 0;
    } 

  }
  return dictRestDays;
}

function statistics() {
  const btnToggleStatistics = document.getElementById('feh-toggle-statistics');
  const btnCloseStatistics = document.getElementById('feh-close-statistics');
  const fehBody = document.body;

  function setBodyStatistics() {
    if (fehBody.classList.contains('statistics-active')) {
      fehBody.classList.remove('statistics-active');      
    }
    else {      
      fehBody.classList.add('statistics-active');      
    }
  }
  
  
  function toggleStatistics() {
    if (event.type === 'click') {
        setBodyStatistics();
    }
    else if((event.type === 'keydown' && event.keyCode === 27)) {
        fehBody.classList.remove('statistics-active');
    }
  }
  
  btnToggleStatistics.addEventListener('click', toggleStatistics);
  btnToggleStatistics.addEventListener('click', update_diagram);
  btnCloseStatistics.addEventListener('click', toggleStatistics);
  document.addEventListener('keydown', toggleStatistics);

}      

statistics();