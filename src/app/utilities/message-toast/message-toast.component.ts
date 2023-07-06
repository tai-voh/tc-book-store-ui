import { Component, inject, Inject } from '@angular/core';
import {MatSnackBar, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'message-toast',
  template: '',
  standalone: true,
  imports: [MatSnackBarModule],
})
export class MessageToastComponent {
  constructor() {}

  static showMessage(snackBar: MatSnackBar, message: string) {
    const durationInSeconds = 3;
    snackBar.openFromComponent(InnerMessageToastComponent, {
      data: message,
      duration: durationInSeconds * 1000,
    });
  }
}

@Component({
  selector: 'app-message-toast',
  templateUrl: './message-toast.component.html',
  styleUrls: ['./message-toast.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
})
export class InnerMessageToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
    snackBarRef = inject(MatSnackBarRef);
}
