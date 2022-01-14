import { Injectable } from '@angular/core';

import { gql, Apollo } from 'apollo-angular';

import { BehaviorSubject } from 'rxjs';
import { pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';
import { LocalstorageService } from './localstorage.service';

const QUERY = gql`
  {
    episodes {
      results {
        name
        episode
      }
    }
    characters {
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private episodeSubject = new BehaviorSubject<Episode[]>([]);
  episodes$ = this.episodeSubject.asObservable();

  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$ = this.charactersSubject.asObservable();

  getCharacterByPage(pageNum:number):any{
    const QUERY_BY_PAGE = gql`
      {
        characters(page: ${pageNum}){
          results {
            id
            name
            status
            species
            gender
            image
          }
        }
      }
    `;
    this.apollo.watchQuery<any>({
      query: QUERY_BY_PAGE
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      withLatestFrom(this.characters$),
      tap(([apiResponse, characters]) => {
        this.parseCharactersData([...characters,...apiResponse.results]);
      })
    ).subscribe();
  }

  private getDataAPI(): void {
    this.apollo
      .watchQuery<DataResponse>({
        query: QUERY,
      })
      .valueChanges.pipe( /* El método pipe te permite aplicar varios operadores sobre el flujo de datos de forma secuencial. */
        take(1),/* Emite sólo los primeros valores emitidos por la fuente Observable.count */
        tap(({data}) => { /* Se utiliza para realizar efectos secundarios para notificaciones de la fuente observable */
          const { episodes, characters } = data;
          this.episodeSubject.next(episodes.results);
          this.charactersSubject.next(characters.results);
          this.parseCharactersData(characters.results);
        })
      ).subscribe();
  }

  constructor(private apollo: Apollo, private localStorageSvc: LocalstorageService) {
    this.getDataAPI();
  }

  private parseCharactersData(characters:Character[]):void{
    const currentFav =  this.localStorageSvc.getFavoritesCharacters();
    const newData= characters.map((character:Character) => {
      const { id } = character;
      const found = !!currentFav.find((fav: Character) => fav.id === id);
      return {...character, isFavorite: found};
    });
    this.charactersSubject.next(newData);
  }
}
