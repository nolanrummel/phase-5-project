#!/usr/bin/env python3

# Standard library imports
from random import random, randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Ride, Route

fake = Faker()

def create_users():
    users = []
    for _ in range(10):
        u = User(
            name=fake.first_name(),
            user_name=fake.user_name(),
            _password_hash='$2b$12$1zeT0udSbh0Qa9QzNZchSeFoaG0TA4Jevy01L8PoM0/jj513Ts.ku'
        )
        users.append(u)
    return users

def create_routes():
    routes = []
    for _ in range(20):
        import random
        random_float = random.uniform(5, 50)
        random_miles = round(random_float, 2)
        r = Route(
            name=fake.color(),
            distance=random_miles
        )
        routes.append(r)
    return routes

def create_rides():
    rides = []
    for _ in range(100):
        r = Ride(
            name=fake.sentence(nb_words=4),
            user_id=randint(1, 10),
            route_id=randint(1, 20)
        )
        rides.append(r)
    return rides

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Route.query.delete()
        Ride.query.delete()

        users = create_users()
        db.session.add_all(users)
        db.session.commit()

        routes = create_routes()
        db.session.add_all(routes)
        db.session.commit()

        rides = create_rides()
        db.session.add_all(rides)
        db.session.commit()