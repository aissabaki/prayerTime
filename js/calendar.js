// Dom elements

const prev = document.getElementById('prev');
const next = document.getElementById('next');

// get the month and year

let date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// Increasing and decreaing the dates

prev.addEventListener('click', decrease);
next.addEventListener('click', increase);

function increase() {
  month++;
  if (month >= 12) {
    month = 0;
    year++;
  }

    displayDate(month, year);
    displayDays(month, year)
}

function decrease() {
  month--;
  if (month <= 0) {
    month = 12;
    year--;
  }

    displayDate(month, year);
    displayDays(month, year)
}

// get the hijri date based on gregorian date

async function getDate(month, year) {
  let response = await fetch(
    `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
  );
  let date = await response.json();
  let myData = date.data;

    
  return myData;
}

function displayDate(month, year) {
  const hijri = document.getElementById('hijriDate');
  const gregorian = document.getElementById('gregorianDate');
  getDate(month, year).then((obj) => {
    let hijriDate = obj[0].hijri;
    let gregorianDate = obj[0].gregorian;

    hijri.innerHTML = `
        <span>${hijriDate.month.ar}</span>
              <span style="font-size: 18px" id="hYear">${hijriDate.year}</span></li>
        `;
    gregorian.innerHTML = `
        <span>${gregorianDate.month.en}</span>
              <span style="font-size: 18px" id="hYear">${gregorianDate.year}</span></li>
        `;
  });
}

 function displayDays(month, year) {
    const monthDays = document.getElementById('monthDays');

    getDate(month, year).then((hijriMonth) => {
        let str = '';

        hijriMonth.forEach((obj) => {
            
            let holidays = obj.hijri.holidays
            
          if (holidays.length > 0) {
              
                str += `
                    <li class="day active">
                    <span>${obj.gregorian.weekday.en}</span>
                    <span>${obj.gregorian.day}</span>
                    <span>${obj.hijri.weekday.ar}</span>
                    <span>${holidays[0]}</span>
                    </li>
          `;
            }
            else {
                 str += `
                    <li class="day">
                    <span>${obj.gregorian.weekday.en}</span>
                    <span>${obj.gregorian.day}</span>
                    <span>${obj.hijri.weekday.ar}</span>
                    </li>
          `;
            }
                
          
        });
      
        monthDays.innerHTML = str;

    })
} 


displayDays(month, year);  
displayDate();




