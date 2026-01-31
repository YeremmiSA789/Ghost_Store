import { Component } from '@angular/core';
import { ProductoCarouselComponent } from '../../reutilizables/producto-carousel/producto-carousel.component';
import { CestaService } from 'src/app/servicios/cesta.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    ProductoCarouselComponent
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  // Esto es solo una prueba del contador de productos en cesta:

  cesta: any[] = [];
  constructor(private sv_cesta: CestaService) { }


  ngOnInit(): void {


  }

}
