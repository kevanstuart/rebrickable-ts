import { ApplicationOptions } from '../types';
import { BaseApiClass } from './base.api';
import { SetApiClass } from './set.api';

export class MainApiClass extends BaseApiClass {
  public set: SetApiClass;

  constructor(options: ApplicationOptions) {
    super(options);

    this.set = new SetApiClass(options);
  }
}
