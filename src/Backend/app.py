from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/TareasDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Modelo de Usuarios
class Usuarios(db.Model):  
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), nullable=False, unique=True)
    contraseña = db.Column(db.String(200), nullable=False)

    def __init__(self, nombre, correo, contraseña):
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña

# Modelo de Tareas con relación a Usuarios
class Tareas(db.Model):  
    __tablename__ = 'tareas'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(100), nullable=False, unique=True)
    estado = db.Column(db.String(200), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    def __init__(self, titulo, descripcion, estado, usuario_id):
        self.titulo = titulo
        self.descripcion = descripcion
        self.estado = estado
        self.usuario_id = usuario_id

# Resetear base de datos (drop y create)
with app.app_context():
    db.drop_all()
    db.create_all()

# Ruta para registrar un nuevo usuario
@app.route('/registro', methods=['POST'])
def nuevo_usuario():
    data = request.json

    if not data.get('nombre') or not data.get('correo') or not data.get('contraseña'):
        return jsonify({'message': 'Faltan datos necesarios.'}), 400

    if Usuarios.query.filter_by(correo=data['correo']).first():
        return jsonify({'message': 'El correo electrónico ya está registrado.'}), 400

    usuario = Usuarios(
        nombre=data['nombre'],
        correo=data['correo'],
        contraseña=data['contraseña']
    )

    db.session.add(usuario)
    db.session.commit()

    return jsonify({
        'message': 'Usuario registrado con éxito',
        'usuario': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'correo': usuario.correo
        }
    }), 201

# Ruta para agregar una tarea a un usuario
@app.route('/tarea', methods=['POST'])
def nueva_tarea():
    data = request.json

    if not data.get('titulo') or not data.get('descripcion') or not data.get('estado') or not data.get('usuario_id'):
        return jsonify({'message': 'Faltan datos para crear la tarea.'}), 400

    tarea = Tareas(
        titulo=data['titulo'],
        descripcion=data['descripcion'],
        estado=data['estado'],
        usuario_id=data['usuario_id']
    )

    db.session.add(tarea)
    db.session.commit()

    return jsonify({
        'message': 'Tarea creada con éxito',
        'tarea': {
            'id': tarea.id,
            'titulo': tarea.titulo,
            'descripcion': tarea.descripcion,
            'estado': tarea.estado,
            'usuario_id': tarea.usuario_id
        }
    }), 201

@app.route('/tareas', methods=['GET'])
def obtener_tareas():
    tareas = Tareas.query.all()
    lista_tareas = []

    for tarea in tareas:
        lista_tareas.append({
            'id': tarea.id,
            'titulo': tarea.titulo,
            'descripcion': tarea.descripcion,
            'estado': tarea.estado,
            'usuario_id':tarea.usuario_id
        })

    return jsonify(lista_tareas), 200


@app.route('/tarea/<int:id>', methods=['PUT'])
def actualizar_tarea(id):
    tarea = Tareas.query.get(id)

    if not tarea:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    data = request.json

   
    if 'titulo' in data:
        tarea.titulo = data['titulo']
    if 'descripcion' in data:
        tarea.descripcion = data['descripcion']
    if 'estado' in data:
        tarea.estado = data['estado']
    if 'usuario_id' in data:
        tarea.usuario_id = data['usuario_id']

    db.session.commit()

    return jsonify({
        'mensaje': 'Tarea actualizada correctamente',
        'tarea': {
            'id': tarea.id,
            'titulo': tarea.titulo,
            'descripcion': tarea.descripcion,
            'estado': tarea.estado,
            'usuario_id': tarea.usuario_id
        }
    }), 200

@app.route('/tarea/<int:id>', methods=['DELETE'])
def eliminar_tarea(id):
    tarea = Tareas.query.get(id)
    
    if not tarea:
        return jsonify({"error": "No se encontró el ID de la tarea"}), 404

    # Guardamos los datos antes de eliminar
    tarea_eliminada = {
        "id": tarea.id,
        "titulo": tarea.titulo,
        "descripcion": tarea.descripcion,
        "estado": tarea.estado,
        "usuario_id": tarea.usuario_id
    }

    db.session.delete(tarea)
    db.session.commit()

    return jsonify(tarea_eliminada), 200


if __name__ == '__main__':
    app.run(debug=True)
