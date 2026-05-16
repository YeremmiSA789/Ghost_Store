export interface IF_JuegoCarrusel{
	id:number;
	titulo:string,
	portada:string,
	// versionJuego:string,
	versionJuego:number,
	precio:number,
	descuento:number,
	precioDescontado:number,

	ruta_img:string; //no sé porqué, pero el proyecto pide esta propiedad xd
  }
  
  
  export interface IF_JuegoCompleto extends IF_JuegoCarrusel{
	// tabla juego
	// ...
	inicio_descuento:string,
	fin_descuento:string,
	
	categoria_id:number,
	logoJuego_id:number,
	colorFondo:string,
	plataforma:string,
	lanzamiento:string,
	activo:number,

	// tabla logo
	ruta_logo:string,
	activo_logo:string,

	// galeria
	galeria:string,
	
  }
  