import { Component, OnInit } from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Human } from '../human';
import { HumanService } from '../human.service';

@Component({
  selector: 'app-human-search',
  templateUrl: './human-search.component.html',
  styleUrls: [ './human-search.component.css' ]
})
export class HumanSearchComponent implements OnInit {
  humans$: Observable<Human[]>;
  private searchTerms = new Subject<string>();
/**A Subject is both a source of observable values and an Observable itself.
 * You can subscribe to a Subject as you would any Observable.
 * You can also push values into that Observable by calling its next(value) method
 * as the search() method does.*/
  constructor(private humanService: HumanService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n =>
      console.log(`It's been ${n} seconds since subscribing!`));


    this.humans$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.humanService.searchHumans(term)),
    );
  }
}
//Remember that the component class does not subscribe to the humans$ observable.
// That's the job of the AsyncPipe in the template.
