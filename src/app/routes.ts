import { Routes } from '@angular/router';

// añadido - nuevo
import { InicioComponent } from './paginas/inicio/inicio.component'
import { DetailsComponent } from './paginas/details/details.component'
import { LibreriasComponent } from './paginas/librerias/librerias.component';
import { VistaPreviaComponent } from './paginas/vista-previa/vista-previa.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { CategoriasComponent } from './paginas/categorias/categorias.component';
import { VistaCategoriaComponent } from './paginas/vista-categoria/vista-categoria.component';
import { NotasPendientesComponent } from './interfaces/notas-pendientes/notas-pendientes.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { CestaModalComponent } from './reutilizables/cesta-modal/cesta-modal.component';
import { CestaComponent } from './paginas/cesta/cesta.component';
import { ListaProductosComponent } from './interno/productos/lista-productos/lista-productos.component';
import { AddProductoComponent } from './interno/productos/add-producto/add-producto.component';
import { EditarProductoComponent } from './interno/productos/editar-producto/editar-producto.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent, title: 'Pagina de inicio' },
  { path: 'detalles', component: DetailsComponent, title: 'Pagina de detalles'  },
  { path: 'librerias', component: LibreriasComponent, title: 'Prueba'  },
  { path: 'preview/:id', component: VistaPreviaComponent, title: 'Previa'},
  { path: 'productos', component: ProductosComponent, title: 'Juegos'},
  { path: 'registro', component: RegistroComponent, title: 'Registrarme'},
  { path: 'login', component: LoginComponent, title: 'Ingresar'},

  { path: 'Pendientes', component: NotasPendientesComponent, title: 'Pendientes'},
  {path: 'miCesta', component: CestaComponent, title: 'MiCesta'},
  
  {path: 'bodega', component:ListaProductosComponent, title: 'list_productos'},
  {path: 'agregar', component: AddProductoComponent, title: 'AgregarProducto'},
  // {path: 'editar', component: EditarProductoComponent, title: 'EditarProducto'},
  {path: 'editar/:id', component: EditarProductoComponent, title: 'EditarProducto'},

  // prueba cesta de compras
  {path: 'cesta_ejemplo', component:CestaModalComponent, title: 'Cesta_Beta :D'},

  { path: 'explorar', component: CategoriasComponent, title: 'Explorar'},
  { path: 'explorando',
    children:[
      {
        path:'categoria/:categoria', component: VistaCategoriaComponent, title:'Explorando Categoría',
        // path:'categoria', component: VistaCategoriaComponent, title:'Explorando Categoría',
      },
      {
        path: 'categoria/:categoria/detalles/:id', component: VistaPreviaComponent, title: 'VistaJuego',
      }
    ]
  },
  {path: 'contacto', component: ContactoComponent, title: 'Contactame :D'},
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' } // Ruta de fallback
];

export default routes;
