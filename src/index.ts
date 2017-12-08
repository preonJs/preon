import koa from 'koa';
import AppCore, { AppOptions } from './lib/core';

export default class App extends AppCore {
  /**
   * init application
   * @param {AppOptions} options
   */
  public constructor(options: AppOptions) {
    super(options);
  }


}
