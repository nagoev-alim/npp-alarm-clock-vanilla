// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';
import clockIco from './assets/images/alarm-clock-ico.svg';
import sound from './assets/sounds/ringtone.mp3';
import { addZero } from './modules/addZero';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='alarm'>
    <h1>Alarm Clock</h1>

    <div class='alarm__container' data-container=''>
      <img src='${clockIco}' alt='Alarm' data-image=''>
      <p class='h1' data-time=''>00:00:00 PM</p>
      <div>
        <select data-select='hour'>
          <option value='Hour'>Hour</option>
          ${Array.from({ length: 12 }, (_, i) => i + 1).map(i => `<option value='${i < 10 ? `0${i}` : i}'>${i < 10 ? `0${i}` : i}</option>`).join('')}
        </select>
        <select data-select='minute'>
          <option value='Minute'>Minute</option>
          ${Array.from({ length: 60 }, (_, i) => i + 1).map(i => `<option value='${i < 10 ? `0${i}` : i}'>${i < 10 ? `0${i}` : i}</option>`).join('')}
        </select>
        <select data-select='day'>
          <option value='AM/PM'>AM/PM</option>
          ${['AM', 'PM'].map(i => `<option value='${i}'>${i}</option>`).join('')}
        </select>
        <button data-submit=''>Set Alarm</button>
      </div>
    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️ Class App
class App {
  constructor() {
    this.DOM = {
      select: document.querySelectorAll('[data-select]'),
      time: document.querySelector('[data-time]'),
      submit: document.querySelector('[data-submit]'),
      body: document.querySelector('[data-container]'),
      image: document.querySelector('[data-image]'),
    };

    this.PROPS = {
      alarmTime: null,
      isAlarmSet: null,
      ringtone: new Audio(sound),
    };

    this.DOM.submit.addEventListener('click', this.onSetAlarm);
    this.updateTime();
  }

  /**
   * @function updateTime - Update time
   */
  updateTime = () => {
    setInterval(() => {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let ampm = 'AM';

      if (h >= 12) {
        h = h - 12;
        ampm = 'PM';
      }

      h = h === 0 ? 12 : h;
      h = addZero(h);
      m = addZero(m);
      s = addZero(s);

      this.DOM.time.innerText = `${h}:${m}:${s} ${ampm}`;

      if (this.PROPS.alarmTime === `${h}:${m} ${ampm}`) {
        this.PROPS.ringtone.play();
        this.PROPS.ringtone.loop = true;
        this.DOM.image.classList.add('shake');
      }
    });
  };

  /**
   * @function onSetAlarm - Set alarm
   */
  onSetAlarm = () => {
    if (this.PROPS.isAlarmSet) {
      this.PROPS.alarmTime = '';
      this.PROPS.isAlarmSet = false;
      this.PROPS.ringtone.pause();
      this.DOM.body.classList.remove('disabled');
      this.DOM.submit.innerText = 'Set Alarm';
      this.DOM.image.classList.remove('shake');
      this.DOM.select[0].selectedIndex = this.DOM.select[1].selectedIndex = this.DOM.select[2].selectedIndex = 0;
    } else {
      let time = `${this.DOM.select[0].value}:${this.DOM.select[1].value} ${this.DOM.select[2].value}`;
      if (time.includes('Hour') || time.includes('Minute') || time.includes('AM/PM')) {
        showNotification('warning', 'Please, select a valid time to set Alarm!');
        return;
      }
      this.PROPS.alarmTime = time;
      this.PROPS.isAlarmSet = true;
      this.DOM.body.classList.add('disabled');
      this.DOM.submit.innerText = 'Clear Alarm';
    }
  };
}


// ⚡️Class instance
new App();
