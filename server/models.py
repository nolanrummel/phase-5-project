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
    name = db.Column(db.String, nullable = False)
    user_name = db.Column(db.String, nullable = False)
    profile_pic = db.Column(db.String)
    _password_hash = db.Column(db.String, nullable = False)
    #favorite_places = db.Column(ARRAY(db.String))

    #RELATIONSHIPS
    rides = db.relationship('Ride', back_populates = 'user', cascade = "all, delete-orphan")
    routes = association_proxy('rides', 'user')

    serialize_rules = ('-rides.user',)

    @validates('name')
    def validate_name(self, key, new_name):
        if type(new_name) is str and len(new_name) >= 2:
            return new_name
        else:
            raise ValueError("Name must be at least 2 characters")

    @validates('user_name')
    def validate_user_name(self, key, new_username):
        if type(new_username) is str and len(new_username) >= 3:
            return new_username
        else:
            raise ValueError("Username must be at least 3 characters")
    
    # @validates('profile_pic')
    # def 

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_password):
        if type(new_password) is str and len(new_password) >= 6:
            enc_new_password = new_password.encode('utf-8')
            encrypted_hash = bcrypt.generate_password_hash(enc_new_password)
            hash_password_str = encrypted_hash.decode('utf-8')
            self._password_hash = hash_password_str
        else:
            raise ValueError("Password must at least 6 characters")

    def authenticate(self, password):
        enc_password = password.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, enc_password)
    
class Route(db.Model, SerializerMixin):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    distance = db.Column(db.Integer)
    origin = db.Column(db.String)
    destination = db.Column(db.String)
    created_by = db.Column(db.Integer) #SEE IF THIS NEEDS TO BE NULLABLE - IF SOMEONE DELETES THE USER, THIS WOULD RETURN NULL
    #waypoints = db.Column(db.PickleType)
    #elevation = db.Column(db.Integer)

    #RELATIONSHIPS
    rides = db.relationship('Ride', back_populates = 'route')
    users = association_proxy('rides', 'route')

    serialize_rules = ('-rides.route',)

    @validates('name')
    def validate_name(self, key, new_name):
        if type(new_name) is str and len(new_name) <= 50:
            return new_name
        else:
            raise ValueError("Name cannot be more than 50 characters")
    
    # @validates('distance')
    # def validate_distance(self, key, new_distance):
    #     if type(new_distance) is int and new_distance < 0:
    #         return new_distance
    #     else:
    #         raise ValueError("Must have a valid Distance")
    # User can't set this info, so might not be necessary to validate
        
    @validates('origin')
    def validate_origin(self, key, new_origin):
        if type(new_origin) is str and len(new_origin) >= 1:
            return new_origin
        else:
            raise ValueError("Must have a valid Origin Address")
        
    @validates('destination')
    def validate_destination(self, key, new_destination):
        if type(new_destination) is str and len(new_destination) >= 1:
            return new_destination
        else:
            raise ValueError("Must have a valid Destination Address")
        
class Ride(db.Model, SerializerMixin):
    __tablename__ = 'rides'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    date = db.Column(db.DateTime, server_default = db.func.now())
    # date = db.Column(db.DateTime, server_default = db.func.now())
    rating = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))

    #RELATIONSHIPS
    user = db.relationship('User', back_populates = 'rides')
    route = db.relationship('Route', back_populates = 'rides')

    serialize_rules = ('-route.rides', '-user.rides')

    @validates('origin')
    def validate_origin(self, key, new_origin):
        if type(new_origin) is str and len(new_origin) >= 1:
            return new_origin
        else:
            raise ValueError("Name cannot be more than 50 characters")
