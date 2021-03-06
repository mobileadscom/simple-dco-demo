/* eslint-disable no-console */
/* global window, XMLHttpRequest */
import Mads from 'mads-custom';
import {getParamsFromJson, processMacrosInParams} from './js/getPropsFromJson';
import getEnvVars from './js/getConditions'

import './main.css';
import json from './config.js';


class AdUnit extends Mads {

  constructor(getLocally) {
    super();
    this.json = null;
    if (getLocally) {
      this.conditions = {};
      const inputs = document.querySelectorAll('input, select');
      for (const input of inputs) {
        const conditionName = input.id;
        this.conditions[conditionName] = input.value;
      }
    }
    else {
      getEnvVars.then(conditions => {
        console.log(conditions);
        this.doInit(conditions)});
    }
  }

  doInit(conditions) {
    const conditionsLowerCase = {};
    for (let i in conditions) {
      conditionsLowerCase[i] = conditions[i].toLowerCase();
    }
    this.params = getParamsFromJson(json, conditionsLowerCase);
    this.params = processMacrosInParams(this.params, conditions);
    this.finalRender();
    this.initForm(conditions);
  }

  initForm(conditions) {
    try {
        for (let i in conditions) { 
          document.getElementById(i).value = conditions[i];
        }
    } catch (e) {}

/*    for (let i in conditions) { 
      if (document.getElementById(i + 'Value')) {
        document.getElementById(i + 'Value').textContent = conditions[i];
      }
      
    }*/
  }

  render() {
    setTimeout(() => {
      this.doInit(this.conditions)
    }, 300);
    return `
      <div id="ad-container"></div>
    `;
  }

  finalRender() {
    const ad = this.params;
    const backgroundNode = ad.creative.type === "image" ?
      `<img id="ad-background" src="${ad.creative.url}" alt=""${ad.creative.style}>`
      :

      `<img id="ad-background" src="img/background.png">
      <img id="product" src="img/product.png">
      <video id="video-bg" muted loop autoplay${ad.creative.style}>
        <source src="${ad.creative.url}">
      </video>`;
    // const backgroundNode = `<img id="ad-background" src="${ad.creative.url}" alt=""${ad.creative.style}>`;

    document.getElementById('ad-container').innerHTML = `
      ${backgroundNode}
    `;

    document.getElementById('ad-container').addEventListener('click', function() {
      alert('User will be redirected');
    });
  }
  

  // todo put styles here
  style() {
    return '';
  }

  events() {};

}

window.ad = new AdUnit(true);


window.AdUnit = AdUnit;
window.loadYoutube = false;