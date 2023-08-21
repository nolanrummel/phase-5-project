from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
# from app import db
from config import bcrypt

# from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_name = db.Column(db.String)
    _password_hash = db.Column(db.String, nullable = False)
    #favorite_places = db.Column(ARRAY(db.String))

    #RELATIONSHIPS
    rides = db.relationship('Ride', back_populates = 'user')
    routes = association_proxy('rides', 'user')

    serialize_rules = ('-rides.user',)

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_password):
        enc_new_password = new_password.encode('utf-8')
        encrypted_hash = bcrypt.generate_password_hash(enc_new_password)
        hash_password_str = encrypted_hash.decode('utf-8')
        self._password_hash = hash_password_str

    def authenticate(self, password):
        enc_password = password.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, enc_password)

class Route(db.Model, SerializerMixin):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    distance = db.Column(db.Integer)
    #elevation = db.Column(db.Integer)
    #directions = db.Column(ARRAY(db.String))

    #RELATIONSHIPS
    rides = db.relationship('Ride', back_populates = 'route')
    users = association_proxy('rides', 'route')

    serialize_rules = ('-rides.route',)

class Ride(db.Model, SerializerMixin):
    __tablename__ = 'rides'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    date = db.Column(db.DateTime, server_default = db.func.now())
    rating = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))

    #RELATIONSHIPS
    user = db.relationship('User', back_populates = 'rides')
    route = db.relationship('Route', back_populates = 'rides')

    serialize_rules = ('-route.rides', '-user.rides')
