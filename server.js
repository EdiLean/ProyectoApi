const express = require('express');
const app = express();

// Puerto que Render asigna automáticamente
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Almacenamiento en memoria (para pruebas)
let productos = [
  { id: 1, nombre: 'Laptop', precio: 999.99, stock: 10 },
  { id: 2, nombre: 'Mouse', precio: 19.99, stock: 50 },
  { id: 3, nombre: 'Teclado', precio: 49.99, stock: 30 }
];

let nextId = 4;

// ============ CRUD DE PRODUCTOS ============

// GET /productos - Obtener todos los productos
app.get('/productos', (req, res) => {
  res.json({
    success: true,
    data: productos,
    total: productos.length
  });
});

// GET /productos/:id - Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  
  if (!producto) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: producto
  });
});

// POST /productos - Crear un nuevo producto
app.post('/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  
  // Validaciones
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'El nombre es requerido y debe ser texto'
    });
  }
  
  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({
      success: false,
      error: 'El precio es requerido y debe ser un número positivo'
    });
  }
  
  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({
      success: false,
      error: 'El stock es requerido y debe ser un número mayor o igual a 0'
    });
  }
  
  const nuevoProducto = {
    id: nextId++,
    nombre: nombre.trim(),
    precio,
    stock
  };
  
  productos.push(nuevoProducto);
  
  res.status(201).json({
    success: true,
    data: nuevoProducto
  });
});

// PUT /productos/:id - Actualizar un producto completo
app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, stock } = req.body;
  const index = productos.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado'
    });
  }
  
  // Validaciones
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'El nombre es requerido y debe ser texto'
    });
  }
  
  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({
      success: false,
      error: 'El precio es requerido y debe ser un número positivo'
    });
  }
  
  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({
      success: false,
      error: 'El stock es requerido y debe ser un número mayor o igual a 0'
    });
  }
  
  productos[index] = {
    id,
    nombre: nombre.trim(),
    precio,
    stock
  };
  
  res.json({
    success: true,
    data: productos[index]
  });
});

// PATCH /productos/:id - Actualización parcial
app.patch('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  
  if (!producto) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado'
    });
  }
  
  const { nombre, precio, stock } = req.body;
  
  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El nombre debe ser texto válido'
      });
    }
    producto.nombre = nombre.trim();
  }
  
  if (precio !== undefined) {
    if (typeof precio !== 'number' || precio <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El precio debe ser un número positivo'
      });
    }
    producto.precio = precio;
  }
  
  if (stock !== undefined) {
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'El stock debe ser un número mayor o igual a 0'
      });
    }
    producto.stock = stock;
  }
  
  res.json({
    success: true,
    data: producto
  });
});

// DELETE /productos/:id - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado'
    });
  }
  
  const productoEliminado = productos[index];
  productos.splice(index, 1);
  
  res.json({
    success: true,
    data: productoEliminado,
    message: 'Producto eliminado correctamente'
  });
});

// ============ ENDPOINTS ADICIONALES ============

// GET / - Ruta raíz (información de la API)
app.get('/', (req, res) => {
  res.json({
    nombre: 'API de Productos',
    version: '1.0.0',
    endpoints: {
      'GET /productos': 'Obtener todos los productos',
      'GET /productos/:id': 'Obtener un producto por ID',
      'POST /productos': 'Crear un nuevo producto',
      'PUT /productos/:id': 'Actualizar un producto completo',
      'PATCH /productos/:id': 'Actualizar un producto parcialmente',
      'DELETE /productos/:id': 'Eliminar un producto'
    },
    ejemplo_producto: {
      nombre: 'Ejemplo',
      precio: 99.99,
      stock: 10
    }
  });
});

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 API de Productos disponible en /productos`);
});