import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Character } from '@app/shared/interfaces/data.interface';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersCardComponent {
  @Input() character!: Character;
  constructor(private localStorageSvc:LocalstorageService) { }

  toogleFavorite():void{
    const isFavorite = this.character.isFavorite;
    this.getIcon();
    this.character.isFavorite = !isFavorite;
    this.localStorageSvc.addOrRemoveFavorite(this.character);
  }

  getIcon():string{
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }

}
