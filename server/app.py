#!/usr/bin/env python3

# Standard library imports
import ipdb

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Route, Ride

@app.route('/')
def index():
    return '<h1>Phase 5 Project Server</h1>'
class Users(Resource):
    def get(self):
        users = User.query.all()
        serialized_users = [user.to_dict(rules=('-rides','-_password_hash')) for user in users]
        return make_response(serialized_users, 200)

    def post(self):
        data = request.get_json()
        try:
            new_user = User(user_name = data['userName'], password_hash = data['password'], name = data['name'])
        except Exception as e:
            return make_response({'error': str(e)}, 404)
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 200)
        # return make_response(new_user.to_dict(only = ('id', 'user_name')), 200)
    
api.add_resource(Users, '/users')

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error':'User does not exist'}, 404)
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        try:
            user = User.query.filter_by(id = id).first()
        except:
            return make_response({"error": "User does not exist"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
    
    # def patch(self, id):
    #     try:
    #         user = User.query.filter_by(id = id).first()
    #         data = request.get_json()
    #         for attr in data:
    #             setattr(user, attr, data[attr])
    #         db.session.commit()
    #         return make_response(user.to_dict(), 202)
    #     except AttributeError:
    #         return make_response({"error": "User does not Exist!"}, 404)
    #     except ValueError:
    #         return make_response({"errors": ["validation errors"]}, 400)
        
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        data = request.get_json()
        if not user :
            return make_response({"error" : "User does not Exist!"}, 404)
        
        try:
            for attr in data:
                setattr(user, attr, data[attr])
        except Exception as e:
            return make_response({"error" : f"invalid request: {str(e)} "}, 404)

        db.session.commit()
        return make_response(user.to_dict(), 202)
        
api.add_resource(UserById, '/users/<int:id>')

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.user_name == data['userName']).first()
        if not user:
            return make_response({'error': 'Username not found!'}, 404)
        else:
            if user.authenticate(data['password']):
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
            else:
                return make_response({'error': 'Password does not match!'}, 404)

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message':'You have been successfully logged out!'}, 204)
    
api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if not user:
            return make_response({'error': 'User is not authorized to enter!'}, 401)
        else:
            return make_response(user.to_dict(), 200)
        
api.add_resource(CheckSession, '/check_session')

class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_user = User(name = data['name'], username = data['username'], password_hash = data['password'] )
        except Exception as e:
            return make_response({'error': str(e)}, 404)
        db.session.add(new_user)
        db.session.commit()
        session['user_id']=new_user.id
        return make_response(new_user.to_dict(), 201)
    
api.add_resource(Signup, '/signups')

class Routes(Resource):
    def get(self):
        routes = [route.to_dict(rules=('-rides.user._password_hash',)) for route in Route.query.all()]
        return make_response(routes, 200)
    
    def post(self):
        data = request.get_json()
        # ipdb.set_trace()
        try:
            # new_route = Route(name = data['name'], distance = ['distance'], origin = data['origin'], destination = data['destination'], waypoints = data['waypoints'])
            new_route = Route(name = data['name'], distance = ['distance'], origin = data['origin'], destination = data['destination'])
        except Exception as e:
            return make_response({'error': str(e)}, 404)
        db.session.add(new_route)
        db.session.commit()
        return make_response(new_route.to_dict(), 201)
    
api.add_resource(Routes, '/routes')

class Rides(Resource):
    def get(self):
        rides = [ride.to_dict(rules=('-user._password_hash',)) for ride in Ride.query.all()]
        return make_response(rides, 200)
    
api.add_resource(Rides, '/rides')

class RideById(Resource):
    def get(self, id):
        ride = Ride.query.filter_by(id=id).first()
        if not ride:
            return make_response({'error':'Ride does not exist'}, 404)
        return make_response(ride.to_dict(rules=('-user._password_hash',)), 200)
    
    def patch(self, id):
        ride = Ride.query.filter_by(id=id).first()
        data = request.get_json()
        if not ride :
            return make_response({"error" : "no ride exists"}, 404)
        
        try:
            for attr in data:
                setattr(ride, attr, data[attr])
        except Exception as e:
            return make_response({"error" : f"invalid request: {str(e)} "}, 404)

        db.session.commit()
        return make_response(ride.to_dict())

api.add_resource(RideById, '/rides/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

