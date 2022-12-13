// DOM elements

const timeBtn = document.getElementById('timingBtn');
// NavBar functionality

const myNav = document.getElementById('nav-bar'),
      myNavLink = document.querySelectorAll('#navLink'),
      openBtn = document.getElementById('open'),
      closeBtn = document.getElementById('close');

openBtn.addEventListener('click', function () {
  myNav.classList.add('show');
});
closeBtn.addEventListener('click', function () {
  myNav.classList.remove('show');
});
myNavLink.forEach((link) => {
  link.addEventListener('click', function () {
    myNav.classList.remove('show');
  });
});

document.addEventListener('click', function (e) {
  if (e.target.id !== 'open') {
    myNav.classList.remove('show');
  }
})

// get the selected country & city

function selectedCounrty() {
  let countries = document.getElementById('countries');
  let myCountry = countries.options[countries.selectedIndex].value;
  return myCountry;
}

function selectedCity() {
  let myCity = document.getElementById('city').value;
  return myCity;
}

// get the date and time 

function getDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

async function timeZone() {
  let response = await fetch(
    `https://timezone.abstractapi.com/v1/current_time/?api_key=5f566a7df0744237a387ab66482bccd5&location=${selectedCity()}, ${selectedCounrty()}`
  );
  let Data = await response.json();
  return Data;
}

// get the prayer times

async function getPrayerTimes() {
  let response = await fetch(
    `https://api.aladhan.com/v1/timingsByAddress/${getDate()}?address=${selectedCity()},${selectedCounrty()}`
  );
  let myData = await response.json();
  let timings = myData.data.timings;

  return {
    Fajr: timings.Fajr,
    Sunrise: timings.Sunrise,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
  };
}


// Remaining time

function timeDiff(currTime) {
  // prayertime DOM elements
  let tmArr = [];
  const nextPrayer = document.getElementById('nxtPrayerTiming'),
        nextPLabel = document.getElementById('nxtPLabel'),
        prayerIcons = document.querySelectorAll('#nextPrayer');

  // get the next prayer timing
  getPrayerTimes().then((obj) => {
    for (const key in obj) {
      if (obj[key] >= currTime) {
        tmArr.push(key);
      }
    }

    // if we pass the last prayer in the day we should return to first prayer
    if (tmArr.length == 0) {
      tmArr = ['Fajr'];
    }

    let nxtP = tmArr[0];
    let nextPrayerTime = obj[nxtP];

    // put the prayer name in place
    nextPLabel.innerHTML = nxtP;

    // icons for the next prayer
    prayerIcons.forEach(function (prayer) {
      let prayerId = prayer.dataset.prayer;

      if (prayerId === nxtP) {
        prayer.innerHTML = `<img class="nxt-prayer-icon" src="../images/next prayer.png" alt="next prayer image">`;
      } else {
        prayer.innerHTML = `<img class="nxt-prayer-icon" src="../images/not next prayer.png" alt="not next prayer image">`;
      }
    });

    // calculate the remainig time for the next prayer

    let nxtPrayerTimeInMinutes =
      Number(nextPrayerTime.split(':')[0]) * 60 +
      Number(nextPrayerTime.split(':')[1]);
    let currentTimeInMinutes =
      Number(currTime.split(':')[0]) * 60 + Number(currTime.split(':')[1]);

    // converting time in minutes to hours and minutes
    let remainingTimeInHours;
    if (nxtPrayerTimeInMinutes == currentTimeInMinutes) {
      document.getElementById(
        'remainingTmContainer'
      ).innerHTML = `It's ${nxtP} prayer time`;
    }
    if (nxtPrayerTimeInMinutes < currentTimeInMinutes) {
      remainingTimeInHours =
        (currentTimeInMinutes - nxtPrayerTimeInMinutes) / 60;
    } else {
      remainingTimeInHours =
        (nxtPrayerTimeInMinutes - currentTimeInMinutes) / 60;
    }
    
    let rHours = Math.floor(remainingTimeInHours);
    let minutes = Math.round((remainingTimeInHours - rHours) * 60);
    let secondes = '00';

    if (rHours < 10) {
      rHours = `0${rHours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    let remaideringTime = `${rHours}:${minutes}:${secondes}`;
    nextPrayer.innerHTML = remaideringTime;
  });
}


// DISPLAYING TIMES

function dateTimeDisplay() {
  const currentTime = document.getElementById('currentTime');
  const currentDate = document.getElementById('date');
  timeZone().then((obj) => {
    let DateTime = obj.datetime;
    let arr = DateTime.split(' ');
    let currTime = arr[1].slice(0, 5);
    currentDate.innerHTML = `Date : ${arr[0]}`;
    currentTime.innerHTML = `Locale time : ${currTime}`;
    timeDiff(currTime);
  });
}

function prayerTimeDisplay() {
  const location = document.getElementById('location');
  let prayerTimes = document.querySelectorAll('.prayer-time');
  getPrayerTimes().then((obj) => {
    prayerTimes.forEach(function (time) {
      let timeId = time.dataset.id;
      for (let key in obj) {
        if (key == timeId) {
          time.innerHTML = obj[key];
        }
      }
    });
  });
  location.innerHTML = `${selectedCounrty()} ,${selectedCity()}`;
}

timeBtn.addEventListener('click', function () {
  dateTimeDisplay();
  prayerTimeDisplay();
});
