// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/Tablaventas';// Importa el componente de tabla
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/busquedas';

// Declaración del componente Ventas
const Ventas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaVentas, setListaVentas] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);     // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null); // Maneja errores de la petición
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");


  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas'); // Ruta ajustada al controlador
        if (!respuesta.ok) {
          throw new Error('Error al cargar las ventas');
        }
        const datos = await respuesta.json();
        setListaVentas(datos);    // Actualiza el estado con los datos
        setVentasFiltradas(datos);
        setCargando(false);       // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);       // Termina la carga aunque haya error
      }
    };
    obtenerVentas();            // Ejecuta la función al montar el componente
  }, []);                       // Array vacío para que solo se ejecute una vez
  //metodo para mejorar cambio de valores dentro del cuadro de busqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtradas = listaVentas.filter(
      (ventas) =>
        ventas.nombre_ventas.toLowerCase().includes(texto) ||
        ventas.descripcion_ventas.toLowerCase().includes(texto)
    );
    setVentasFiltradas(filtradas);
  };

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Ventas con Detalles</h4>
        <Row>
    <Col lg={2} md={4} sm={4} xs={5}>
      <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
        Nueva venta
      </Button>
    </Col>
    <Col lg={5} md={8} sm={8} xs={7}>
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />
    </Col>
  </Row>

        {/* Pasa los estados como props al componente TablaVentas */}
        <TablaVentas 
    ventas={ventasFiltradas} 
    cargando={cargando} 
    error={errorCarga} 
  />
      </Container>
    </>
  );
};

// Exportación del componente
export default Ventas;
