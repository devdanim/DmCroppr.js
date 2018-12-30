/**
 * Fork from Croppr.js : https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2017 James Ooi. Released under the MIT License.
 *
 * Fork by Adrien du Repaire : https://github.com/devdanim/dnm-croppr
 * 
 * 
 */

import CropprCore from './core';

/**
 * This class is a wrapper for CropprCore that merely implements the main
 * interfaces for the Croppr instance. Look into CropprCore for all the
 * main logic.
 */
export default class Croppr extends CropprCore {
  /**
   * @constructor
   * Calls the CropprCore's constructor.
   */
  constructor(element, options, _deferred = false) {
    super(element, options, _deferred);
  }

  /**
   * Gets the value of the crop region.
   * @param {String} [mode] Which mode of calculation to use: 'real', 'ratio' or
   *      'raw'.
   */
  getValue(mode) {
    return super.getValue(mode);
  }

  /**
   * Changes the image src.
   * @param {String} src
   */
  setImage(src) {
    return super.setImage(src);
  }

  /**
   * Destroys the Croppr instance
   */
  destroy() {
    return super.destroy();
  }

  /**
   * Moves the crop region to a specified coordinate.
   * @param {Number} x
   * @param {Number} y
   */
  moveTo(x, y, constrain = true, mode = "px") {

    if(mode === "%" || mode === "real") {
      let data = this.convertor( {x, y} , mode, "px")
      x = data.x
      y = data.y
    }

    this.box.move(x, y);
    if(constrain === true) this.strictlyConstrain(null, [0,0]);
    
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }
    return this;
  }

  /**
   * Resizes the crop region to a specified width and height.
   * @param {Number} width
   * @param {Number} height
   * @param {Array} origin The origin point to resize from.
   *      Defaults to [0.5, 0.5] (center).
   */
  resizeTo(width, height, origin = null, constrain = true, mode = "px") {

    if(mode === "%" || mode === "real") {
      let data = {
        width: width,
        height: height
      }
      data = this.convertor( data, mode, "px")
      width = data.width
      height = data.height
    }

    if(origin === null) origin = [.5, .5];

    this.box.resize(width, height, origin);
    if(constrain === true) this.strictlyConstrain();

    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }
    return this;
  }

  setValue(data, constrain = true, mode = "%") {
    if(mode === "%" || mode === "real") data = this.convertor(data, mode, "px")
    this.moveTo(data.x, data.y, false)
    this.resizeTo(data.width, data.height, [0,0], constrain)
    return this
  }

  /**
   * Scale the crop region by a factor.
   * @param {Number} factor
   * @param {Array} origin The origin point to resize from.
   *      Defaults to [0.5, 0.5] (center).
   */
  scaleBy(factor, origin = null, constrain = true) {

    if(origin === null) origin = [.5, .5];
    
    this.box.scale(factor, origin);
    if(constrain === true) this.strictlyConstrain();
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }
    return this;
  }

  /**
   * Resets the crop region to the initial settings.
   */
  reset() {
    this.box = this.initializeBox(this.options);
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }
    return this;
  }
}