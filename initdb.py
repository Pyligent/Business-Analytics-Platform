import os
import pandas as pd
import numpy as np
import psycopg2
from sqlalchemy import create_engine

#SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
#engine = create_engine(SQLALCHEMY_DATABASE_URI)
engine = create_engine('postgresql+psycopg2://postgres:postgres@@127.0.0.1/yelp_data')

# 1. Load Ontario Yelp Basic Data Model into the PostgreSQL Database

df = pd.read_csv('yelp_dataset/basic_model.csv', sep=',').replace(to_replace='null', value=np.NaN)

df.columns = ['business_id', 'latitude', 'longitude', 'name', 'address', 'city','state', 
              'postal_code', 'categories', 'is_open', 'review_count','stars']

df.to_sql('yelp_on_basic_data',  con=engine)

#2. Load Ontario Yelp Full Data Model into the PostgreSQL Database

full_dataset_df = pd.read_csv('yelp_dataset/ontaro_biz_data.csv', sep=',',encoding = 'unicode_escape').replace(to_replace='null', value=np.NaN)

full_dataset_df.columns = ['address', 'attributes.AcceptsInsurance', 'attributes.AgesAllowed',
       'attributes.Alcohol', 'attributes.Ambience', 'attributes.BYOB',
       'attributes.BYOBCorkage', 'attributes.BestNights',
       'attributes.BikeParking', 'attributes.BusinessAcceptsBitcoin',
       'attributes.BusinessAcceptsCreditCards', 'attributes.BusinessParking',
       'attributes.ByAppointmentOnly', 'attributes.Caters',
       'attributes.CoatCheck', 'attributes.Corkage',
       'attributes.DietaryRestrictions', 'attributes.DogsAllowed',
       'attributes.DriveThru', 'attributes.GoodForDancing',
       'attributes.GoodForKids', 'attributes.GoodForMeal',
       'attributes.HairSpecializesIn', 'attributes.HappyHour',
       'attributes.HasTV', 'attributes.Music', 'attributes.NoiseLevel',
       'attributes.Open24Hours', 'attributes.OutdoorSeating',
       'attributes.RestaurantsAttire', 'attributes.RestaurantsCounterService',
       'attributes.RestaurantsDelivery', 'attributes.RestaurantsGoodForGroups',
       'attributes.RestaurantsPriceRange2',
       'attributes.RestaurantsReservations',
       'attributes.RestaurantsTableService', 'attributes.RestaurantsTakeOut',
       'attributes.Smoking', 'attributes.WheelchairAccessible',
       'attributes.WiFi', 'business_id', 'categories', 'city', 'hours.Friday',
       'hours.Monday', 'hours.Saturday', 'hours.Sunday', 'hours.Thursday',
       'hours.Tuesday', 'hours.Wednesday', 'is_open', 'latitude', 'longitude',
       'name', 'postal_code', 'review_count', 'stars', 'state', 'checkin_date',
       'user_id', 'tip_text', 'tip_compliment_count', 'tip_date', 'photo_id',
       'label', 'caption']

full_dataset_df.to_sql('yelp_on_full_data',  con=engine)

