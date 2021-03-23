let timeMinutes = 480;
let orders = 0;

function orderIntensity (x) {
  if (x >= 8 && x < 15) {
    return Math.sin(0.86*x - 2) + 1;
  }
  else if (x >= 15 && x < 21) {
    return Math.abs(Math.sin(0.5*x + 2));
  }
  else {
    return 0;
  }
}

function timeToFloat (currentMinute) {
  return currentMinute / 60;
}

function printTime (timeMinutes) {
  let string = Math.floor(timeMinutes/60)
  let minute = timeMinutes%60;
  string += ":";
  string += (minute >= 10 ? minute : "0" + minute);
  return string;
}

let timeTrack = setInterval( () => {
  let time = timeToFloat(timeMinutes);
  timeMinutes++;
  orders += orderIntensity(time) / 2;
  if (timeMinutes == 1440) {
    timeMinutes = 0;
  }
  console.log("Time: " + printTime (timeMinutes) + ", Order intensity: " + orderIntensity(time).toFixed(2) + ", orders: " + Math.floor(orders));
}, 50);



/*
sinusværdi * maksimal antal ordre på en dag/2 /60


*/