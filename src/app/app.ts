import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {GuessService} from './guess-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  namesInput: string = '';
  chosenList: string[] = [];
  remainingList: string[] = [];
  chosenName: string = '';

  constructor(private guessService: GuessService) {}

  // 🎲 Tirer un nom
  draw() {
    const names = this.namesInput
      .split(',')
      .map(n => n.trim())
      .filter(n => n !== '');

    if (names.length === 0) {
      alert('Veuillez saisir au moins un nom.');
      return;
    }

    this.guessService.draw(names).subscribe({
      next: (chosen) => {
        this.chosenName = chosen;
        this.refreshLists();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du tirage.');
      }
    });
  }

  // 🔄 Réinitialiser le jeu
  reset() {
    this.guessService.reset().subscribe(() => {
      this.namesInput = '';
      this.chosenName = '';
      this.chosenList = [];
      this.remainingList = [];
    });
  }

  // 🔄 Rafraîchir les listes
  refreshLists() {
    this.guessService.getChosen().subscribe(data => this.chosenList = data);
    this.guessService.getRemaining().subscribe(data => this.remainingList = data);
  }

  // ➕ Remettre un nom dans les participants
  remove(name: string) {
    this.guessService.remove(name).subscribe(data => {
      this.chosenList = data.chosen;
      this.remainingList = data.remaining;
    });
  }
}
