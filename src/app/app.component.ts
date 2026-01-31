import {Directive, Component, ElementRef, HostListener, NgModule, OnInit, ViewChild, Output, EventEmitter, Renderer2, ChangeDetectorRef  } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';

// Importando componentes para reutilizarlos
import {BuscadorComponent} from './reutilizables/buscador/buscador.component';

//
import { GalleryModule, GalleryItem, ImageItem, GalleryComponent } from 'ng-gallery';
import { ProductoCarouselComponent } from './reutilizables/producto-carousel/producto-carousel.component';
import { CarouselV1Component } from './reutilizables/carousel-v1/carousel-v1.component';
import { FooterComponent } from './reutilizables/footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { CestaModalComponent } from './reutilizables/cesta-modal/cesta-modal.component';
import { HeaderService } from './servicios/dinamicos/header.service';
import { LocalstorageBasicService } from './servicios/localstorage-basic.service';
import { AutenticacionService } from './servicios/autenticacion.service';
import { CestaService } from './servicios/cesta.service';
import { IF_cesta, IF_cestaResponse } from './interfaces/cestaData';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
    BuscadorComponent,
    GalleryModule,
    ProductoCarouselComponent,

    CarouselV1Component, //solo para tener una plantilla v1
    FooterComponent,
    CestaModalComponent,

    NgIf,
    NgClass,
  ],
  templateUrl: './app.component.html',
  // template: `<h1> HOLALALALAL <h1>`, // Para colocar directamente la estructura del html aquí
  // styles: `li { color: red; font-weight: 300; }`,// para colocar directamente los estilos aquí
  styleUrl: './app.component.css',

  template: `
    <gallery></gallery>
  `,

})

export class AppComponent implements OnInit{
  title = 'Ghost_Store';

  menuVisible = false;
  usuarioRegistrado:boolean = false;
  logeado:boolean = false;
  

  //VARIABLES APIS
  userRoles: string[] = [];
  public dataCestaAPI: IF_cesta[] = []; // Aquí se almacenará la información de la cesta
  public dataCostoTotal: number = 0;    // Aquí se almacenará el costo total
  public cestaVacia: boolean = false;   // Indica si la cesta está vacía o no
  
  //VARIABLES ROLES
  user: any; // Cambia a la interfaz que definas para el usuario

  // CESTA VARIABLES
  numerosss:number = 0; //cuenta los productos en la cesta

  dataCestaCantidad: Array<{juego:string, costo:number, loMenos:number, idJuego:number, imagen:string}> = [];
  public cantidadCesta: number = 0;

  // EFECTOS DE SONIDO VARIABLES
  private hoverSound: HTMLAudioElement;
  private isPlaying: boolean = false; // Bandera para controlar la reproducción

  alerta(){
    alert("BOTON DE USUARIO");
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  showAlert(): void {
    alert('Hiciste clic fuera del contenedor nav!');
  }

  
  
  @ViewChild('botonToggle') btntoggle!: ElementRef;
  @ViewChild('navToggle') navTog!: ElementRef;
  
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  mostrarBusquedaComponent: boolean = true; //#1
  constructor(
    private ruta:Router,
    
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef, //para que se recargue el sitio o componente forzadamente
    private headerService:HeaderService,
    private localStorage:LocalstorageBasicService,
    private autenticacionService:AutenticacionService,
    private localstorageService:LocalstorageBasicService,
    private router:Router,
    private sv_cesta:CestaService,
    private sv_autenticacion:AutenticacionService,
    private cdr:ChangeDetectorRef,

  ){  

    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
         this.isMenuOpen=false;
      }
    });

    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.btntoggle.nativeElement && e.target!==this.navTog.nativeElement){
         this.menuVisible=false;
      }
    });


    // Carga el archivo de sonido
    this.hoverSound = new Audio('assets/sonidos/trap-dbd.mp3');
    
  }

  infoLocalStorage = this.localstorageService.consultarUsuario("informacion formulario");

  isMenuOpen = false;

  menus() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  plaHoverSound():void{
    // this.hoverSound.currentTime = 0;
    // this.hoverSound.play().catch(error => console.error("Error al reproducir sonido", error))
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.hoverSound.currentTime = 0;
      this.hoverSound.play()
        .catch(error => console.error('Error al reproducir sonido:', error));
    }
  }
  stopHoverSound(): void {
    this.isPlaying = false; // Resetea la bandera cuando el mouse se mueve fuera del elemento
  }


  // Mostrar u ocultar el componente de busqueda dependiendo el módulo - #1 #2 #3

  @ViewChild(GalleryComponent) gallery!: GalleryComponent;

  items: ImageItem[] = [];

  ngOnInit() {

    this.ruta.events.subscribe(event => { //#3
      if (event instanceof NavigationEnd) {
        this.verif_rutaActual();
        // console.log("Valor de NavigationEnd: ", NavigationEnd);
      }
    });


    

    this.sv_cesta.cantidad$.subscribe((nuevaCantidad) => {
      this.numerosss = nuevaCantidad;
    });

    // this.obtenerCesta(this.sv_autenticacion.id_USUARIO);

    this.sv_cesta.verMiCesta(this.sv_autenticacion.id_USUARIO).subscribe(
      (response: IF_cestaResponse) => {
        this.dataCestaAPI = response['Info de la cesta'];
        this.sv_cesta.actualizarCantidad(this.dataCestaAPI.length);
      },
      (error) => {
        console.error('Error al obtener la cesta', error);
      }
    );
    
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      this.autenticacionService.userSubject.next(user);  // Restaura el usuario si está guardado en localStorage
    }

  }

  // Método que verifica si el usuario tiene un rol
  isUserRole(role: string[]): boolean {
    return this.autenticacionService.hasRole(role);
  }
  // PARA UN SOLO ROL
  // isUserRole(role: string): boolean {
  //   return this.autenticacionService.hasRole(role);
  // }

  checkLocalStorage() {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/');
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }

  
  actualizarEstadoUsuario() {
    this.infoLocalStorage = this.localstorageService.consultarUsuario("informacion formulario");
    this.logeado = this.infoLocalStorage.usuario_logueado;
  }

  verif_rutaActual() { //#2
    const actualURL = this.ruta.url;
    this.mostrarBusquedaComponent = !['/registro','/login','/inicio','/contacto','/editar'].includes(actualURL);
    console.log(actualURL); // esto imprime toda la ruta actual, sin tomar encuenta "localhost:4200 ó el servidor"
  }
  
  isVisible:boolean = false;
  

  cestaComponent(){
    this.router.navigateByUrl('/miCesta')
    

  }

  // obtenerCesta(idUser: number): void {
  //   this.sv_cesta.verMiCesta(idUser).subscribe(
  //     (response: IF_cestaResponse) => {
  //       this.dataCestaAPI = response['Info de la cesta'];
  //       this.cantidadCesta = this.dataCestaAPI.length;  // Actualiza la cantidad de productos en la cesta
  //     },
  //     (error) => {
  //       console.error('Error al obtener la cesta', error);
  //     }
  //   );
  // }


  handleClose() {
    this.isVisible = false; // Asegura que el modal se cierre correctamente
  }

  closeModal(){
    this.isVisible = false;
  }

  onConfirm() {
    // Lógica cuando el usuario confirma
    console.log('Confirmado');
    this.closeModal();
  }

  onCancel() {
    // Lógica cuando el usuario cancela
    console.log('Cancelado');
    this.closeModal();
  }

  salirUsuario(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

@NgModule({
  imports: [
    InicioComponent,
    RouterModule.forRoot([]),
    BrowserModule,

  ],
})

class MyNgModule {}
