import React, { useState, useEffect } from 'react';
import Tablaproducto from '../components/producto/Tablaproducto'; // Asumiendo que tienes este componente
import ModalRegistroProductos from '../components/producto/ModalRegistroProductos';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalEliminacionProducto from '../components/producto/ModalEliminacionProducto';
import ModalEdicionProducto from '../components/producto/ModalActualizacionProducto';
import CuadroBusquedas from '../components/busquedas/busquedas';

const productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });
 const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  //metodo para eliminar producto seleccionado 
  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
    const respuesta = await
    fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, 
      {method: 'DELETE', });
    if (!respuesta.ok) {
    throw new Error('Error al eliminar el producto');
    }
    await obtenerProductos(); // Refresca la lista
    setMostrarModalEliminacion(false);
    establecerPaginaActual(1); // Regresa a la primera página
    setProductoAEliminar(null);
    setErrorCarga(null);
    } catch (error) {
    setErrorCarga(error.message);
    }
    };
    //metodo para manejar la apertura del modal eliminacion 
    const abrirModalEliminacion = (producto) => {
      setProductoAEliminar(producto);
      setMostrarModalEliminacion(true);
      };
  //metodo para manejar el cambio de valores de los imputs
      const manejarCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setProductoEditado(prev => ({
          ...prev,
          [name]: value
        }));
      };
      //metodo para actualizar los productos
      const actualizarProducto = async () => {
        if (!productoEditado?.nombre_producto || !productoEditado?.descripcion_producto) {
          setErrorCarga("Por favor, completa todos los campos antes de guardar.");
          return;
        }
    
        try {
          const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nombre_producto: productoEditado.nombre_producto,
              descripcion_producto: productoEditado.descripcion_producto,
            }),
          });
    
          if (!respuesta.ok) {
            throw new Error('Error al actualizar el producto');
          }
    
          await obtenerProductos();
          setMostrarModalEdicion(false);
          setProductoEditado(null);
          setErrorCarga(null);
        } catch (error) {
          setErrorCarga(error.message);
        }
      };
//metodo para manejar la apertura del modal
const abrirModalEdicion = (producto) => {
  setProductoEditado(producto);
  setMostrarModalEdicion(true);
};
  // Obtener categorías para el dropdown
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categoria');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria || 
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        descripcion_producto: '',
        id_categoria: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const ProductosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );
  //metodo para el manejo de cambio de valores dentro del cuadro de busqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtrados = listaProductos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion_producto.toLowerCase().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };
  

  return (
    <Container className="mt-5">
      <br />
      <h4>Productos</h4>
      <Row>
    <Col lg={2} md={4} sm={4} xs={5}>
      <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
        Nuevo producto
      </Button>
    </Col>
    <Col lg={5} md={8} sm={8} xs={7}>
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />
    </Col>
  </Row>
      <br/><br/>

      <Tablaproducto
        productos={ProductosPaginados} 
        cargando={cargando} 
        error={errorCarga} 
        totalElementos={listaProductos.length} // Total de elementos
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
          abrirModalEliminacion={abrirModalEliminacion} // Método para abrir modal de eliminación
          abrirModalEdicion={abrirModalEdicion} // Método para abrir modal de edición
          />
        
<ModalEliminacionProducto
mostrarModalEliminacion={mostrarModalEliminacion}
setMostrarModalEliminacion={setMostrarModalEliminacion}
eliminarProducto={eliminarProducto}
/>

    <ModalRegistroProductos
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
    />
       <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorCarga}
        />

      
    </Container>
  );
};

export default productos;