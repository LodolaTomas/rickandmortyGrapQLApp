import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../interfaces/data.interface';

const MY_FAVORITES: string = 'myFavorites';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private chractersFavSubject = new BehaviorSubject<Character[]>([]);
  charactersFav$ = this.chractersFavSubject.asObservable();

  constructor() {
    this.initialStorage();
  }

  addOrRemoveFavorite(character: Character): void {
    const { id } = character;
    const currentsFav = this.getFavoritesCharacters();
    const found = !!currentsFav.find((fav: Character) => fav.id === id);

    found ? this.removeFromFavorite(id) : this.addToFavorite(character);
  }

  private addToFavorite(character: Character): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentsFav, character]));
      this.chractersFavSubject.next([...currentsFav, character]);
    } catch (error) {
      console.error('Error saving localStorage', error);
    }
  }

  private removeFromFavorite(id: number): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      const characters = currentsFav.filter((item: { id: number; }) => item.id !== id);
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.chractersFavSubject.next([...characters]);
    } catch (error) {
      console.error('Error removing localStorage', error);
    }
  }

  getFavoritesCharacters(): any {
    try {
      const localstorage: any = localStorage.getItem(MY_FAVORITES);
      const charactersFav = JSON.parse(localstorage);
      this.chractersFavSubject.next(charactersFav);
      return charactersFav;
    } catch (error) {
      console.error('Error getting favorites from localStorage', error);
    }
  }

  private initialStorage(): void {
    const localstorage: any = localStorage.getItem(MY_FAVORITES);
    const currents = JSON.parse(localstorage);
    if (!currents) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
