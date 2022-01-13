import { Injectable } from '@angular/core';

import { gql, Apollo } from 'apollo-angular';

import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';

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
        })
      ).subscribe();
  }

  constructor(private apollo: Apollo) {
    this.getDataAPI();
  }
}
