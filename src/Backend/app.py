from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


# Inicialización de la aplicación Flask
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/TareasDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar modificaciones de seguimiento

# Inicialización de SQLAlchemy
db = SQLAlchemy(app)

# Definición del modelo de la base de datos
class Usuarios(db.Model):  
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), nullable=False, unique=True)
    contraseña = db.Column(db.String(200), nullable=False)

    def __init__(self, nombre,correo , contraseña):
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña
        


# Crear las tablas de la base de datos (mejor hacerlo solo una vez)
with app.app_context():
    db.create_all()

# # Endpoint para crear una nueva playera
# @app.route('/playera', methods=['POST'])
# def crear_playera():
#     # Obtener los datos del JSON
#     titulo = request.json['titulo']
#     descripcion = request.json['descripcion']
#     precio = request.json['precio']
#     imagen = request.json['imagen']

#     # Crear una nueva instancia de Playera
#     nueva_playera = Playera(titulo, descripcion, precio, imagen)

#     # Agregar la nueva playera a la base de datos
#     db.session.add(nueva_playera)
#     db.session.commit()

#     # Convertir el objeto Playera a un diccionario y devolverlo
#     return jsonify({
#         'id': nueva_playera.id,
#         'titulo': nueva_playera.titulo,
#         'descripcion': nueva_playera.descripcion,
#         'precio': nueva_playera.precio,
#         'imagen': nueva_playera.imagen
#     }), 201

# # Endpoint para crear un nuevo pedido
# @app.route('/pedido', methods=['POST'])
# def crear_pedido():
#     cliente = request.json['cliente']
#     tipo_prenda = request.json['tipo_prenda']
#     cantidad = request.json['cantidad']
#     fecha_entrega = request.json['fecha_entrega']
#     precio = request.json['precio']
#     estado_pedido = request.json['estado_pedido']

#     nuevo_pedido = Pedidos(cliente, tipo_prenda, cantidad, fecha_entrega, precio, estado_pedido)

#     db.session.add(nuevo_pedido)
#     db.session.commit()

#     return jsonify({
#         'id': nuevo_pedido.id,
#         'cliente': nuevo_pedido.cliente,
#         'tipo_prenda': nuevo_pedido.tipo_prenda,
#         'cantidad': nuevo_pedido.cantidad,
#         'fecha_entrega': nuevo_pedido.fecha_entrega,
#         'precio': nuevo_pedido.precio,
#         'total': nuevo_pedido.total,
#         'estado_pedido': nuevo_pedido.estado_pedido
#     }), 201

# # Endpoint para obtener todos los pedidos
# @app.route('/pedidos', methods=['GET'])
# def obtener_pedidos():
#     pedidos = Pedidos.query.all()

#     # Convertir cada pedido a un diccionario
#     return jsonify([{
#         'id': pedido.id,
#         'cliente': pedido.cliente,
#         'tipo_prenda': pedido.tipo_prenda,
#         'cantidad': pedido.cantidad,
#         'fecha_entrega': pedido.fecha_entrega,
#         'precio': pedido.precio,
#         'total': pedido.total,
#         'estado_pedido': pedido.estado_pedido
#     } for pedido in pedidos]), 200

# # Endpoint para crear un nuevo cliente
# @app.route('/cliente', methods=['POST'])
# def crear_cliente():
#     # Obtener los datos del JSON
#     nombre = request.json['nombre']
#     direccion = request.json['direccion']
#     telefono = request.json['telefono']
    
#     nuevo_cliente = Clientes(nombre, direccion, telefono)

#     db.session.add(nuevo_cliente)
#     db.session.commit()

#     return jsonify({
#         'id': nuevo_cliente.id,
#         'nombre': nuevo_cliente.nombre,
#         'direccion': nuevo_cliente.direccion,
#         'telefono': nuevo_cliente.telefono
#     }), 201

# # Endpoint para obtener todos los clientes
# @app.route('/clientes', methods=['GET'])
# def obtener_clientes():
#     clientes = Clientes.query.all()

#     # Convertir cada cliente a un diccionario
#     return jsonify([{
#         'id': cliente.id,
#         'nombre': cliente.nombre,
#         'direccion': cliente.direccion,
#         'telefono': cliente.telefono
#     } for cliente in clientes]), 200

# Ejecutar la aplicación

@app.route('/registro', methods=['POST'])
def nuevo_usuario():
    data = request.json

    # Validar que los campos necesarios estén presentes
    if not data.get('nombre')  or not data.get('correo') or not data.get('contraseña'):
        return jsonify({'message': 'Faltan datos necesarios.'}), 400

    # Verificar si el correo ya está registrado
    if Usuarios.query.filter_by(correo=data['correo']).first():
        return jsonify({'message': 'El correo electrónico ya está registrado.'}), 400

    # # Hashear la contraseña
    # hashed_password = generate_password_hash(data['password'])

    # Crear el nuevo usuario
    usuario = Usuarios(
        nombre=data['nombre'],
        correo=data['correo'],
        contraseña=data['contraseña'],
        
    )

    # Agregar el nuevo usuario a la base de datos
    db.session.add(usuario)
    db.session.commit()

    # Responder con los datos del usuario creado
    return jsonify({
        'message': 'Usuario registrado con éxito',
        'usuario': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'correo': usuario.correo,
           
        }
    }), 201

if __name__ == '__main__':
    app.run(debug=True)
