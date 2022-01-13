import { Component } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

@Component({
  selector: 'app-characters-list',
  template: ` <section class="character__list">
    <app-characters-card
      *ngFor="let character of characters$ | async"
      [character]="character"
    ></app-characters-card>
  </section>`,
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent {
  /* cuando son observables se pone un signo $ al final */
  characters$ = this.dataSvc.characters$;
  constructor(private dataSvc: DataService,private localStorageSvc:LocalstorageService) {}
}
