import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { IF_galeriaCarrusel } from 'src/app/interfaces/juegoGaleriaData';
import { IF_categorias } from 'src/app/interfaces/JuegoData';

@Component({
  selector: 'app-add-producto',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-producto.component.html',
  styleUrl: './add-producto.component.css'
})
export class AddProductoComponent {

  constructor(

    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,

    // Cambiar de funcionalidad del formulario | REGISTRAR / EDITAR
    private route: ActivatedRoute,
    private sv_juego: JuegosService,

  ) {

  }

  private API_URL = environment.apiRest; //http://localhost:8000/api/
  private STORAGE_URL = environment.apiStorage; //http://localhost:8000/storage/

  juegoForm!: FormGroup;
  portadaFile!: File;
  logoFile!: File;
  galeriaFiles: File[] = [];


  previewPortada: string | ArrayBuffer | null = null;
  // previewGaleria: string[] = [];

  previewGaleria: any[] = [];

  previewLogo: string | ArrayBuffer | null = null;


  // Cambiar de funcionalidad del formulario | REGISTRAR / EDITAR
  modoEdicion: boolean = false;
  idJuego: any;

  api_imagenes: IF_galeriaCarrusel[] = [];

  categorias: IF_categorias[] = [];
  categoriaSeleccionada: number | null = null;

  tiposJuego = [
    { id: 0, nombre: 'JUEGO BASE' },
    { id: 1, nombre: 'DLC' }
  ];

  // Colores
  colores: string[] = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#f1c40f',
    '#9b59b6',
    '#e67e22',
    '#082D31',
    '#000000',
    '#456F19',
    '#121313',
    // '',
    // '',
  ];

  colorSeleccionado: string = '';



  ngOnInit() {


    this.juegoForm = this.fb.group({

      titulo: ['', Validators.required],
      categoria_id: ['', Validators.required],
      precio: ['', Validators.required],
      descuento: [''],
      versionJuego: [''],
      inicio_descuento: [''],
      fin_descuento: [''],
      Descripcion: [''],
      colorFondo: [''],
    });

    this.getCategorias();

    this.route.params.subscribe(params => {

      this.idJuego = params['id'];

      if (this.idJuego) {
        this.modoEdicion = true;

        console.log("ID recibido:", this.idJuego); // DEBUG
        console.log("Cargando Juego ... ");

        this.cargarJuego();
        this.getGaleriaJuego(this.idJuego);

      } else {
        this.modoEdicion = false;
      }

    });


  }


  // Cargar y visualizar la imagen
  onFileChange(event: any, tipo: string) {

    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'portada') {
      // para guardar el archivo en la variable "portadaFile"
      this.portadaFile = file;

      // para mostrar la imagen en el formulario
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPortada = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  // Cargar y visualizar la imagen
  onFileChangeLogo(event: any, tipo: string) {

    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'logo') {
      // para guardar el archivo en la variable "portadaFile"
      this.logoFile = file;

      // para mostrar la imagen en el formulario
      const reader = new FileReader();
      reader.onload = () => {
        this.previewLogo = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onMultipleFileChange(event: any) {

    const files = Array.from(event.target.files);

    files.forEach((file: any) => {

      this.galeriaFiles.push(file);

      const reader = new FileReader();

      // reader.onload = () => {
      //   this.previewGaleria.push(reader.result as string);
      // };

      reader.onload = () => {
        this.previewGaleria.push({
          file: file,
          url: reader.result,
          existente: false
        });
      };


      reader.readAsDataURL(file);

    });

  }

  guardarJuego() {

    if (this.juegoForm.invalid) {
      alert('Formulario incompleto');
      return;
    }

    // 🔥 VALIDACIÓN DE DESCUENTO
    const { descuento, inicio_descuento, fin_descuento } = this.juegoForm.value;

    if (descuento) {
      if (!inicio_descuento || !fin_descuento) {
        Swal.fire("Error", "Debes agregar fechas si hay descuento", "warning");
        return;
      }
    }

    // Despues de validar el formulario - si hay descuento debe existir fecha de inicio y fin, ya se crea el formData

    const formData = new FormData();

    Object.keys(this.juegoForm.value).forEach(key => {
      // formData.append(key, this.juegoForm.value[key]); //antes era solo esto, pero se puso lo de abajo dentro de estas llaves "{}" para impedir que se manden NULL o UNDEFINED

      let value = this.juegoForm.value[key];

      if (value === '' || value === null || value === undefined) {
        value = ''; // Laravel lo convertirá a null automáticamente 🔥
      }

      formData.append(key, value);

    });

    if (this.portadaFile) {
      formData.append('portada', this.portadaFile);
    }

    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

    this.galeriaFiles.forEach(file => {
      formData.append('imagenes[]', file);
    });


    // // 🔥 SOLO enviamos nuevas
    // this.previewGaleria.forEach(img => {
    //   if (!img.existente) {
    //     formData.append('imagenes[]', img.file);
    //   }
    // });


    // Cambiar de funcionalidad del formulario | REGISTRAR / EDITAR

    if (this.modoEdicion) {

      formData.append('_method', 'PUT');

      this.http.post(`${this.API_URL}actualizarJuego/${this.idJuego}`, formData)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El juego fue actualizado', 'success')
              .then(() => this.router.navigate(['/productos']));
          },
          error: () => Swal.fire("Error", "No se pudo actualizar", "error")
        });
    } else {



      this.http.post(`${this.API_URL}registrarJuego`, formData)
        // this.http.post(`http://localhost:8000/api/registrarJuego`, formData)
        .subscribe({
          next: res => {

            // Alerta de Éxito
            // this.juegoForm.reset();
            Swal.fire({
              title: '¡Todo listo!',
              text: 'Tu registro se completó correctamente',
              icon: 'success',
              confirmButtonText: 'Genial',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('Juego registrado', res);
                this.router.navigate(['/juegos']).then(() => {
                  this.juegoForm.reset();
                });

              }
            });

          },
          // error: err => console.error(err)
          error: (err) => {
            // error: err => console.error(err)
            Swal.fire("Error", "No se pudo registrar", "error")
          }
        });

    }



  }


  // eliminarImagen(img: any, index: number) {

  //   if (img.existente) {
  //     // 🔥 eliminar en backend
  //     this.http.delete(`${this.API_URL}imagenes/${img.id}`)
  //       .subscribe(() => {
  //         this.previewGaleria.splice(index, 1);
  //       });

  //   } else {
  //     // 🔥 eliminar local
  //     this.previewGaleria.splice(index, 1);

  //     // quitar también del array de archivos
  //     this.galeriaFiles = this.galeriaFiles.filter(f => f !== img.file);
  //   }

  // }


  eliminarImagen(img: any, index: number) {

    if (img.existente) {

      Swal.fire({
        title: '¿Eliminar imagen?',
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true
      }).then(result => {
        if (result.isConfirmed) {
          // PONER LA ACCIÓN DE QUITAR LA IMAGEN - DESHABILITARLA

          this.http.put(`${this.API_URL}imagenes/desactivarImagenGaleria/${img.id}`, {})
            .subscribe(() => {
              this.previewGaleria.splice(index, 1);
            });

        }
      });



    } else {

      this.previewGaleria.splice(index, 1);
      this.galeriaFiles = this.galeriaFiles.filter(f => f !== img.file);

    }

  }




  // Cambiar de funcionalidad del formulario | REGISTRAR / EDITAR

  cargarJuego() {

    this.http.get(`${this.API_URL}info_Juego/${this.idJuego}`)
      .subscribe((resp: any) => {

        console.log('RESPUESTA COMPLETA: ', resp);

        this.juegoForm.patchValue({
          titulo: resp.titulo,
          categoria_id: resp.categoria_id,
          precio: resp.precio,
          descuento: resp.descuento,
          versionJuego: resp.versionJuego,
          inicio_descuento: resp.inicio_descuento,
          fin_descuento: resp.fin_descuento,
          descripcion: resp.descripcion,
          colorFondo: resp.colorFondo,
        });

        // previews
        // this.previewGaleria = this.STORAGE_URL + resp.
        this.previewPortada = this.STORAGE_URL + resp.portada;
        // this.previewLogo = this.STORAGE_URL + resp.logo;

        this.previewLogo = resp.ruta_logo ? this.STORAGE_URL + resp.ruta_logo : null;
        // porque así y no como el de portada? 
        //  Es un operador ternario, que básicamente dice:
        // 👉 “Si existe ruta_logo, construye la URL. Si no, no hagas nada (null)”


        console.log("Ruta del LOGO: ", this.previewLogo);
      });


  }



  getGaleriaJuego(id: number): void {
    // const STORAGE_URL = 'https://tu-servidor.com/';
    this.sv_juego.getJuego_Galeria(id).subscribe((respo) => {
      this.api_imagenes = respo.map((img: any) => ({
        ...img, //esto hace que no sea necesario especificar todos los elementos de la interfaz
        // id: img.id,
        ruta_img: `${this.STORAGE_URL}${img.ruta_img}`
      }));

      // Para mostrar las imágenes
      // this.previewGaleria = this.api_imagenes.map(img => img.ruta_img);
      this.previewGaleria = this.api_imagenes.map(img => ({
        id: img.id,
        url: img.ruta_img,
        existente: true
      }));



      console.log("Imágenes con ruta completa:", this.api_imagenes);
    });
  }


  eliminarImagenExistente(img: any, index: number) {

    // this.http.delete(`${this.API_URL}imagenes/${img.id}`)
    //   .subscribe(() => {
    //     this.api_imagenes.splice(index, 1);
    //   });



    Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción se puede revertir',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.http.put(`${this.API_URL}imagenes/desactivarImagenGaleria/${img.id}`, {})
      }
    });


  }


  getCategorias(): void {
    this.sv_juego.getCategorias().subscribe({

      next: (resp) => this.categorias = resp,
      error: (err) => console.error(err),

    });

  }


  seleccionarColor(color: string) {
    this.colorSeleccionado = color;
    this.juegoForm.patchValue({ colorFondo: color });
  }










}
