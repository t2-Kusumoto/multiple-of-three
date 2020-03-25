{
  'use strict';


  const Elements = {
    grid: document.getElementById('grid'),
    view: document.getElementById('view'),
    time: document.getElementById('time'),
    score: document.getElementById('score'),
    missCount: document.getElementById('miss'),
    button: document.getElementById('button'),
  }


  const Status = {
    flag: false,
    end: false,
    timer: null,
    now: null,
    counter: 0,
    point: 0,
    clear: 0,
    miss: 0,
  }


  class Handler {
    constructor () {
      this.size = 16;
      this.grid_status = this.makeStatus();
      this.boxies = this.makeBoxies();
    }

    makeStatus() {
      let status = [];
      for (let j = 0; j < this.size; j++) {
        status[j] = {};
        status[j].num = j;
        status[j].rock = false;
        status[j].clear = false;
        status[j].adding = false;
      }
      return status
    }

    makeBoxies() {
      for (let i = 0; i < this.size; i++) {
        const box = document.createElement('div');
        box.setAttribute('class', 'box');
        box.setAttribute('id', `no_${i}`);
        box.textContent = i + 1;
        box.style = this.setColor();
        Elements.grid.appendChild(box);
      }
      return document.getElementsByClassName('box');
    }

    setNumber() {
      return Math.floor(Math.random() * 297) + 3;
    }

    makeColorNum() {
      return Math.floor(Math.random()* 144) + 96;
    }

    setColor() {
      return `background:rgb(${this.makeColorNum()},\
                              ${this.makeColorNum()},\
                              ${this.makeColorNum()});`;
    }

    setClearColor() {
      return ' background:rgba(255,255,255,0.3);\
                color:rgba(255,225,225,0.3);\
                border: solid 1px rgba(255,225,225,0.3);';
    }

    changeBox() {
      for (let i = 0; i < this.size; i++) {
        if (this.grid_status[i].rock == false) {
          this.boxies[i].textContent = this.setNumber();
          this.boxies[i].style = this.setColor();
        }
      }
    }

    makeScoreText(point) {
        return point >= 0 ? (" 0000" + point ).slice(-4): "-" + ("0000" + Math.abs(point)).slice(-4);
    }
  } //class end


  window.onload = () => {
    const bgImage = [];
    for (let i = 0; i <= 16; i++) {
      let num = `0${i}`.slice(-2)
      bgImage.push(`img/re_${num}.jpg`)
    }
    let bgimg = bgImage[
      Math.floor(Math.random() * bgImage.length)
    ];
    Elements.grid.style = `background-image: url(${bgimg})`;
  }


  let handler = new Handler();


  function makeLag() {
    Elements.view.style = "display:none;";
    if (Status.end === true) {
      Status.flag = false;
    }
  }

  function showGrid(text) {
    Elements.view.textContent = text;
    Elements.view.style = "display:block;";
    setTimeout(makeLag, 1500);
  }


  function toggleButton() {
    if (Status.end) {
      Elements.button.classList.remove('clear');
      Elements.button.classList.add('replay');
      Elements.button.textContent = "Replay";
    } else {
      Elements.button.classList.remove('start');
      Elements.button.classList.add('clear');
      Elements.button.textContent = "Clear";
    }
  }


  function manageTime() {
    let remining_time = 60  - Math.round(((Date.now() - Status.now) / 1000));
    const timeText = ("0" + remining_time).slice(-2);
    Elements.time.textContent = `Time: ${timeText}`;
    if (remining_time <= 0 || Status.miss >= 12) {
      Status.end = true;
      clearInterval(Status.timer);
      showGrid("END");
      setTimeout(toggleButton, 1200);
    }
    if (Status.counter % 3 === 0) {
      handler.changeBox();
    }
    Status.counter += 1
  }


  function timerRoop() {
    Status.timer = setInterval(manageTime, 1200);
  }


  function clearButtonPused(target) {
    for (elem of handler.grid_status) {
      if (elem.rock === true && elem.clear === false && Status.flag === true) {
        elem.clear = true;
        Status.clear += 1;
        Status.point += parseInt(handler.boxies[elem.num].textContent);
        handler.boxies[elem.num].style = handler.setClearColor();
        if (Status.clear === 16) {
          Status.point += (
            60 - Math.round(((Date.now() - Status.now) / 1000)) + 1) * 30;
            clearInterval(Status.timer);
            Status.end = true;
            showGrid("ALL CLEAR");
            setTimeout(toggleButton, 1000);
          }
          Elements.score.textContent =　`Score: ${handler.makeScoreText(Status.point)}`;
        }
      }
    }


  document.addEventListener('click', (e) => {
    if (e.target.className === 'box' && Status.flag === true) {
      const num = parseInt(e.target.id.slice(3,));
      const get = parseInt(e.target.textContent);
      if (handler.grid_status[num].rock === false && get % 3 !== 0) {
        Status.miss += 1;
        let misscount = `00${Status.miss}`.slice(-2);
        Elements.missCount.textContent = `Miss: ${misscount}`;
        Status.point -=  get;
        Elements.score.textContent = `Score: ${handler.makeScoreText(Status.point)}`;
      }
      if (handler.grid_status[num].rock === false && get % 3 === 0) {
        handler.grid_status[num].rock = true;
        }
      }
  });


  Elements.button.addEventListener('click', () => {
    if (Status.flag === true && Status.end === true) {
      return;
    }
    else if (Status.flag === false && Status.end === true) {
      window.location.reload();
    }
    else if (Status.flag === false && Status.end === false) {
      Status.now = Date.now();
      Status.flag = true;
      showGrid("Start!");
      setTimeout(toggleButton, 1200);
      timerRoop();
    }
    else {
      clearButtonPused();
    }
  });


  Elements.button.addEventListener('mousedown', (e) => {
    e.target.classList.add('push');
  });


  Elements.button.addEventListener('mouseup', (e) => {
    e.target.classList.remove('push');
  });
}