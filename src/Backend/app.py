from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token,get_jwt_identity,jwt_required,JWTManager

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)
jwt = JWTManager(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/TareasDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "todoList$23ñ12$.SeE"  

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
    
    hashed_password = bcrypt.generate_password_hash(data['contraseña']).decode('utf-8')

    usuario = Usuarios(
        nombre=data['nombre'],
        correo=data['correo'],
        contraseña=hashed_password
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

##RUTA PARA INICIAR SESION

@app.route('/iniciarsesion', methods=['POST'])
def login():
    data = request.json
    usuario = Usuarios.query.filter_by(correo=data['correo']).first()

    if usuario and bcrypt.check_password_hash(usuario.contraseña, data['contraseña']):
       
        access_token = create_access_token(identity=usuario.id)
        return jsonify({
    "access_token": access_token,
    "usuario": {
        "id": usuario.id,
        "correo": usuario.correo,
       
    }
}), 200
    else:
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

# Ruta para agregar una tarea a un usuario
@app.route('/tarea', methods=['POST'])
# @jwt_required()
def nueva_tarea():
    # usuario_id = get_jwt_identity()
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


###RUTA PARA OBTENER TAREAS##

@app.route('/tareas', methods=['GET'])
# @jwt_required()
def obtener_tareas():
    # usuario_id = get_jwt_identity()
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

###RUTA PARA ACTUALIZAR TAREAS#
@app.route('/tarea/<int:id>', methods=['PUT'])
# @jwt_required()
def actualizar_tarea(id):
    # usuario_id = get_jwt_identity()
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

##RUTA PARA ELIMINAR TAREAS##

@app.route('/tarea/<int:id>', methods=['DELETE'])
# # @jwt_required()
def eliminar_tarea(id):
    # usuario_id = get_jwt_identity()
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
