import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    // Los nombres 'correo' y 'contrasena' coinciden con los campos de tu base de datos y modelo en Spring
    const credentials = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        alert('¡Bienvenido a CinemaPlus!');
        // Aquí puedes redirigir a la pantalla principal de tu app
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Correo o contraseña incorrectos.');
      }
    });
  }
}
