import { Component, OnInit } from '@angular/core';
import { Productos } from '../../models/productos';
import {ProductosService} from '../../services/productos.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  titulo = 'Listado de empresas';
  productos: Productos[] = [];
  vistas = {
    L: 'Listado de productos',
    A: 'Agregar un producto'
  };
  formRegistroProductos: FormGroup;
  vista = 'L';
  submited = false;
  constructor(
    private productoService: ProductosService,
    public formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.getProductos();
    this.formRegistroProductos = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: [null, [Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      ProductoStock: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ],
      ProductoFechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }
  getProductos() {
    this.productoService.get().subscribe((res: Productos[]) => {
      this.productos = res;
      this.vista = 'L';
    });
  }
  agregar() {
    this.vista = 'A';
    this.submited = false;
    this.formRegistroProductos.reset({ ProductoID: 0 });
    this.formRegistroProductos.markAsUntouched();
  }
  insertar() {
    this.submited = true;
    if (this.formRegistroProductos.invalid) return;
    this.agregarProductos();
  }

  agregarProductos() {
    const copyItem = { ...this.formRegistroProductos.value };
    var arrFecha = copyItem.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha === 3) {
      copyItem.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
    }
    this.productoService
      .post(copyItem)
      .subscribe((res: any) => this.getProductos());
  }
  volver()
  {
    this.vista= 'L'
  }
}
