import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IF_JuegoCarrusel } from 'src/app/interfaces/juegoCarruselData';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [
    NgFor,
    NgIf,

  ],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent {

  constructor(private sv_juegos: JuegosService, private httpClient: HttpClient) { }

  private _juegos!: IF_JuegoCarrusel;

  juegoFormato:any;

  ngOnInit(): void {
    this.consultarJuegos();
  }


  consultarJuegos() {
    this.sv_juegos.getJuegos_carrusel().subscribe( server =>{
      this.juegoFormato = server

      console.log(this.juegoFormato)
    });
  }


}
