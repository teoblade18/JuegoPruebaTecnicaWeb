import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-piedra-papel-tijera',
  standalone: true,
  imports: [FormsModule],
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
  private apiUrl = 'http://localhost:5000/api/PartidaService';

  constructor(private http: HttpClient) {}

  registrarJugadores() {
    const jugadores = [
      { nombre: this.jugador1Nombre },
      { nombre: this.jugador2Nombre }
    ];

    this.http.post(`${this.apiUrl}/IniciarPartida`, jugadores).subscribe((partida: any) => {
      this.idPartida = partida.idPartida;
      this.idJugador1 = partida.jugadores[0].idJugador;
      this.idJugador2 = partida.jugadores[1].idJugador;
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

    this.http.post(`${this.apiUrl}/RegistrarMovimiento`, movimiento1).subscribe();
    this.http.post(`${this.apiUrl}/RegistrarMovimiento`, movimiento2).subscribe(() => {
      this.http.get(`${this.apiUrl}/VerificarGanador/${this.idPartida}`).subscribe((resultado: any) => {
        this.resultadoRonda = resultado;
        this.verificarGanador();
        this.rondaTerminada = true;
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

  verificarGanador() {
    if (this.resultadoRonda.includes('ha ganado la partida!')) {
      this.ganador = this.resultadoRonda.split(' ')[1];
    }
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
