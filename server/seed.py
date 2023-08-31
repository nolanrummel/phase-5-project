#!/usr/bin/env python3

# Standard library imports
from random import random, randint, choice as rc
import re

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Ride, Route
import datetime

fake = Faker()

def generate_image_url(image_types=['profile-pic'], width=500, height=500):
    image_id = fake.random_int(min=1, max=100)
    selected_type = fake.random_element(image_types)
    return f"https://picsum.photos/{width}/{height}?image={image_id}&type={selected_type}"

def create_users():
    users = []
    for _ in range(10):
        while True:
            new_name=fake.first_name()
            if len(new_name) >= 2:
                break
        while True:
            new_user_name=fake.user_name()
            if len(new_user_name) >= 3:
                break
        u = User(
            name=new_name,
            user_name=new_user_name,
            _password_hash='$2b$12$KeFZ20GaKQr9TaGvxc8tJ.jjVaMB.zx5OZO8oZt8QJnmvt6AxBa3.',
            profile_pic=generate_image_url(image_types=['profile-pic'])
        )
        users.append(u)
    return users

def create_routes():
    routes = []
    for _ in range(20):
        import random
        random_float = random.uniform(5, 50)
        random_miles = round(random_float, 2)

        origin_full_address = fake.address()
        origin_lines = origin_full_address.split('\n')
        origin_first_line = re.sub(r'(Apt\.?|Suite|Ste)\s*\d+.*$', '', origin_lines[0]).strip()

        dest_full_address = fake.address()
        dest_lines = dest_full_address.split('\n')
        dest_first_line = re.sub(r'(Apt\.?|Suite|Ste)\s*\d+.*$', '', dest_lines[0]).strip()

        short_name = re.sub(r'^\d+', '', origin_first_line)
        endings = ['Loop', 'Sprint', 'Race', 'Run', 'Tempo', 'Stroll', 'Ride', 'Training', 'Intervals', 'Pedal', 'Series', 'Attempt', 'Hike', 'Rip']
        random_ending = random.choice(endings)
        name = f'{short_name} {random_ending}'

        map_previews = [
            '/images/map-example.png',
            '/images/map-example-2.png',
            '/images/map-example-3.png',
            '/images/map-example-4.png',
            '/images/map-example-5.png',
            '/images/map-example-6.png'
        ]


        r = Route(
            name=name,
            distance=random_miles,
            origin=(origin_first_line + " | " + origin_lines[1]),
            destination=(dest_first_line + " | " + dest_lines[1]),
            created_by=randint(1, 10),
            map_preview=random.choice(map_previews)
        )
        routes.append(r)
    return routes

def create_rides():
    rides = []
    for _ in range(500):
        rating = None
        ride_date = fake.date_time_between(start_date='-9w', end_date='+1w')
        current_date = datetime.datetime.now()
        # formatted_ride_date = ride_date.strftime('%Y-%m-%d %H:%M:%S')
        # formatted_current_date = current_date.toUTCString()
        if (current_date > ride_date):
            rating = randint(1, 5)
        else:
            rating = None
        r = Ride(
            name=fake.sentence(nb_words=4),
            user_id=randint(1, 10),
            route_id=randint(1, 20),
            rating=rating,
            # date=formatted_ride_date,
            date=ride_date,
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
