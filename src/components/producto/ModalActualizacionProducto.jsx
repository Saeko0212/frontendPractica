import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditado,
  manejarCambioInputEdicion,
  actualizarProducto,
  errorCarga,
  categorias,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditado?.nombre_producto || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
            
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenProducto">
  <Form.Label>Imagen</Form.Label>
  {productoEditado?.imagen && (
    <div>
      <img
        src={`data:image/png;base64,${productoEditado.imagen}`}
        alt="Imagen actual"
        style={{ maxWidth: '100px', marginBottom: '10px' }}
      />
    </div>
  )}
  <Form.Control
    type="file"
    name="imagen"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          manejarCambioInputEdicion({
            target: { name: 'imagen', value: reader.result.split(',')[1] }
          });
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</Form.Group>

          <Form.Group className="mb-3" controlId="formDescripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_producto"
              value={productoEditado?.descripcion_producto || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa la descripción (máx. 100 caracteres)"
              maxLength={100}
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarProducto}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;