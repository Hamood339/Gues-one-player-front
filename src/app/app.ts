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
  drawing: boolean = false;       // Indique si le tirage est en cours
  rouletteName: string = '';


  constructor(private guessService: GuessService) {
  }

  draw() {
    const names = this.namesInput.split(',').map(n => n.trim()).filter(n => n !== '');
    if (names.length === 0) {
      alert('Veuillez saisir au moins un nom.');
      return;
    }

    this.drawing = true;   // Cache le champ de saisie
    let index = 0;

    // Roulette qui défile toutes les 100ms
    const interval = setInterval(() => {
      this.rouletteName = names[index % names.length];
      index++;
    }, 100);

    // Après 15 secondes, on arrête la roulette et on tire le nom réel
    setTimeout(() => {
      clearInterval(interval);

      this.guessService.draw(names).subscribe({
        next: (chosen) => {
          this.chosenName = chosen;
          this.refreshLists();
          this.drawing = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors du tirage.');
          this.drawing = false;
        }
      });
    }, 6000);
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
