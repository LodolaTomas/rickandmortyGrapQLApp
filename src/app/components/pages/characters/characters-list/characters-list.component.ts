import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

@Component({
  selector: 'app-characters-list',
  template: ` <section class="character__list"
  infinite-scroll
  (scrolled)="onScrollDown()"  >
    <app-characters-card
      *ngFor="let character of characters$ | async"
      [character]="character"
    ></app-characters-card>
    <button *ngIf="showButton" class="button" (click)="onScrollTop()">⬆</button>
  </section>`,
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent {
  /* cuando son observables se pone un signo $ al final */
  characters$ = this.dataSvc.characters$;

  showButton = false;
  private pageNum=1;
  private scrollHeight = 500;

  constructor(private dataSvc: DataService,
    private localStorageSvc:LocalstorageService,
    @Inject(DOCUMENT) private document: Document
    ) {}


  @HostListener('window:scroll')
  onWindowScroll():void {
    const yOffSet = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;
  }

  onScrollTop(){
    this.document.documentElement.scrollTop = 0;
  }

  onScrollDown():void{
    this.pageNum++;
    this.dataSvc.getCharacterByPage(this.pageNum)
  }
}

