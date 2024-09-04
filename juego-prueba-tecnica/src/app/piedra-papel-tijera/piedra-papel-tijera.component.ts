import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-piedra-papel-tijera',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './piedra-papel-tijera.component.html',
  styleUrl: './piedra-papel-tijera.component.css'
})
export class PiedraPapelTijeraComponent {
  jugador1Nombre = '';
  jugador2Nombre = '';
  movimientoJugador1 = '';
  movimientoJugador2 = '';
  rondaActual = 1;
  rondaTerminada = false;
  resultadoRonda = '';
  ganador = '';
  juegoIniciado = false;
  private idJugador1 = 0;
  private idJugador2 = 0;
  private idPartida = 0;
  private apiUrl = 'https://localhost:7174/api/PartidaService';

  constructor(private http: HttpClient) {}

  registrarJugadores() {
    const jugadores = [
      { nombre: this.jugador1Nombre },
      { nombre: this.jugador2Nombre }
    ];

    this.http.post(`${this.apiUrl}/IniciarPartida`, jugadores).subscribe((respuestaPartida: any) => {
      this.idPartida = respuestaPartida.partida.idPartida;
      this.idJugador1 = respuestaPartida.jugadores[0].idJugador;
      this.idJugador2 = respuestaPartida.jugadores[1].idJugador;
      this.juegoIniciado = true;
    });
  }

  seleccionarMovimiento(movimiento: string) {
    if (!this.movimientoJugador1) {
      this.movimientoJugador1 = movimiento;
    } else {
      this.movimientoJugador2 = movimiento;
      this.registrarMovimientos();
    }
  }

  registrarMovimientos() {
    const movimiento1 = {
      descripcion: this.movimientoJugador1,
      idJugador: this.idJugador1,
      idPartida: this.idPartida
    };

    const movimiento2 = {
      descripcion: this.movimientoJugador2,
      idJugador: this.idJugador2,
      idPartida: this.idPartida
    };

    this.http.post(`${this.apiUrl}/RegistrarMovimiento`, movimiento1, { responseType: 'text' }).subscribe();
    this.http.post(`${this.apiUrl}/RegistrarMovimiento`, movimiento2, { responseType: 'text' }).subscribe((resultadoRonda: any) => {

      this.rondaTerminada = true;
      this.resultadoRonda = resultadoRonda;
      
      this.http.get(`${this.apiUrl}/VerificarGanador/${this.idPartida}`, {responseType: 'text' }).subscribe((resultado: any) => {
        if(resultado != "Aún no hay un ganador. Continúa jugando."){
          this.ganador = resultado;
        }
      });
    });
  }

  siguienteRonda() {
    this.rondaActual++;
    this.movimientoJugador1 = '';
    this.movimientoJugador2 = '';
    this.rondaTerminada = false;
    this.resultadoRonda = '';
  }

  reiniciarJuego() {
    this.jugador1Nombre = '';
    this.jugador2Nombre = '';
    this.movimientoJugador1 = '';
    this.movimientoJugador2 = '';
    this.rondaActual = 1;
    this.rondaTerminada = false;
    this.resultadoRonda = '';
    this.ganador = '';
    this.juegoIniciado = false;
  }
}
