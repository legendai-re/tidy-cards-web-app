import { Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class TcSearchService {

  updateSearchQuery: any;

  constructor() {
    this.updateSearchQuery = new EventEmitter();
  }

  emitUpdateSearchQueryEvent(val) {
    this.updateSearchQuery.emit(val);
  }

  getUpdateSearchQueryEmitter() {
    return this.updateSearchQuery;
  }

}
