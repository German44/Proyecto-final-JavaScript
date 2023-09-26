//* variables
//& Array Auxiliar para evitar descargar 2 veces el api
let listaClientesSucursal = [];



const btn = document.getElementById('btn');
const btnBorrar = document.getElementById('btnBorrar');
const btnSi = document.getElementById('btnSi');
const btnNo = document.getElementById('btnNo');
// const modalContainer = document.getElementById('modalContainer');

class Cliente {
    constructor(nombre, apellido, dni,) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
    }
}

class ClienteController {
    constructor() {
        this.listaClientes = [];
        this.cargarClientesDesdeLocalStorage();
    }
    //& Metodo que almacena local el cliente en JSON
    guardarClientesEnLocalStorage() {
        const clientesJson = JSON.stringify(this.listaClientes);
        localStorage.setItem('Clientes', clientesJson);
    }
    //& Metodo que carga local el cliente
    cargarClientesDesdeLocalStorage() {
        const clientesJson = localStorage.getItem('Clientes');
        if (clientesJson) {
            this.listaClientes = JSON.parse(clientesJson);
        }
    }
    //& Metodo para agregar clientes
    agregar() {
        const inputNombre = document.getElementById('inputNombre').value;
        const inputApellido = document.getElementById('inputApellido').value;
        const inputDni = document.getElementById('inputDni').value;
        //& Condicional para evitar campos vacios y uso de sweetAlert
        if (inputNombre == "" || inputApellido == "" || inputDni == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan datos obligatorios',
                background: '#000',
                backdrop: 'true',
                timer: 1500,
            })
        } else {
            let nuevoCliente = new Cliente(inputNombre, inputApellido, inputDni,);
            this.listaClientes.push(nuevoCliente);
            this.mostrarEnDom();
            this.guardarClientesEnLocalStorage();
        }
        //& Limpiar los campos de entrada
        document.getElementById('inputNombre').value = '';
        document.getElementById('inputApellido').value = '';
        document.getElementById('inputDni').value = '';
    }

    //& Metodo asincronico que trae Clientes de otra Sucursal (Falsa API)
    async agregarSucursal() {
        let clientesSucursalJson = await fetch("clientesSucursal.json");
        let clientesSucursal = await clientesSucursalJson.json();

        clientesSucursal.forEach(clienteSucursal => {
            let nuevoCliente = new Cliente(clienteSucursal.nombre, clienteSucursal.apellido, clienteSucursal.dni);
            this.listaClientes.push(nuevoCliente);
            listaClientesSucursal.push(nuevoCliente);
            this.mostrarEnDom();
            this.guardarClientesEnLocalStorage();
        })
    }

    //& Metodo para eliminar cliente de manera individual
    eliminar(clienteAeliminar) {
        const indice = this.listaClientes.findIndex(item => item.dni === clienteAeliminar.dni);
        if (indice !== -1) {
            this.listaClientes.splice(indice, 1);
            this.mostrarEnDom();
            this.guardarClientesEnLocalStorage();
        }
    }

    //& Metodo para renderizar en el DOM
    mostrarEnDom() {
        const contenedorClientes = document.getElementById('contenedorClientes');
        contenedorClientes.innerHTML = '';

        this.listaClientes.forEach(cliente => {
            contenedorClientes.innerHTML +=
                `<ul class="listaCliente">
                <li class="listaItem">${cliente.nombre}</li>
                <li class="listaItem">${cliente.apellido}</li>
                <li class="listaItem">${cliente.dni}</li>
                <button class="btnX" id="btnX${cliente.dni}">X</button>
            </ul>`;
        });
    //& bucle q recorre el arreglo para borrado individual
        this.listaClientes.forEach(cliente => {
            const btnX = document.getElementById(`btnX${cliente.dni}`);
            btnX.addEventListener('click', () => {
                this.eliminar(cliente);
            });
        });
    }
}

let clienteController = new ClienteController();

//* BOTON AGREGAR DATOS DE LOS INPUTS
btn.addEventListener('click', function () {
    clienteController.agregar();
});
//* BOTON AGREGAR DATOS SUCURSAL
btnSucursal.addEventListener('click', function () {
    if (listaClientesSucursal.length > 0) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya se descargaron todos los datos',
            background: '#000',
            backdrop: 'true',
            timer: 1500,
        })
    } else {
        clienteController.agregarSucursal();
    }
});
//* BOTON BORRAR TODOS LOS DATOS
btnBorrar.addEventListener('click', function () {
    if (localStorage.length > 0) {

        Swal.fire({
            title: 'Esta seguro?',
            text: "No podra revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            background: '#000',
            backdrop: 'true',
            confirmButtonText: 'si, Borralos!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                location.reload();
                Swal.fire(
                    'Borrados!',
                    'Su base de datos esta limpia'
                )
            }
        })
    }
});
//& Mostrar clientes al cargar la página
clienteController.mostrarEnDom();
