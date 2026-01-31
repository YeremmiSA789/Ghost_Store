import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent {

  constructor(
    private sv_juego:JuegosService,
    private rou:ActivatedRoute, //Obtener la info del producto atraves del ID

  ){}

  api_juegoInfo:any;
  api_imagenes:any
  // elementos: ImageItem[] = [];
  private STORAGE_URL = environment.apiStorage; //http://localhost:8000/storage/


  ngOnInit(): void {
    this.rou.params.subscribe( (parametro) => {
      const prod_ID = +parametro['id'];
      this.getJuego(prod_ID);

      this.getGaleriaJuego(prod_ID);
    });    


    
  }

  getJuego(id:number){
    this.sv_juego.getJuego_completo(id).subscribe( resp =>{
      this.api_juegoInfo = resp
      // this.api_juegoInfo = resp[0]; //para cuando la api devuelva [ { ... } ]
      // console.log(this.api_juegoInfo)
      // if(this.api_juegoInfo){
      //   this.colorFondos = this.api_juegoInfo.colorFondo;
      //   this.colorService.changeColor(this.colorFondos); // Cambia el color en el servicio
      // }
    });
  }


  // getGaleriaJuego(id: number):void{
  //   this.sv_juego.getJuego_Galeria(id).subscribe( respo =>{
  //     this.api_imagenes = respo
  //     console.log("imagen respuestaaa");
  //     console.log(this.api_imagenes);
  //   });
  // }

  getGaleriaJuego(id: number): void {
    // const STORAGE_URL = 'https://tu-servidor.com/';
    this.sv_juego.getJuego_Galeria(id).subscribe((respo) => {
      this.api_imagenes = respo.map(img => ({
        // ...img,
        ruta_img: `${this.STORAGE_URL}${img.ruta_img}`
      }));
      console.log("Imágenes con ruta completa:", this.api_imagenes);
    });
  }
  

}
