import pandas as pd
import numpy as np
from collections import Counter

import os
import requests
import sys
import urllib
import json
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode

import re

from nltk.tokenize import word_tokenize
from nltk import FreqDist

from setting import APP_STATIC



import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import MetaData,Table,inspect,desc,Column,Integer
from sqlalchemy.sql import func


import psycopg2
from flask import send_from_directory     

from flask import Flask, jsonify, render_template,url_for
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)


#################################################
# Yelp Fushio API Setup
#################################################


# Yelp Fusion no longer uses OAuth as of December 7, 2017.
# You no longer need to provide Client ID to fetch Data
# It now uses private keys to authenticate requests (API Key)
# You can find it on
# https://www.yelp.com/developers/v3/manage_app
API_KEY= api_key

# API constants, you shouldn't have to change these.
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
BUSINESS_PATH = '/v3/businesses/'  # Business ID will come after slash.


# Default values.
DEFAULT_TERM = 'bars'
DEFAULT_LOCATION = 'Toronto'
SEARCH_LIMIT = 5


def request(host, path, api_key, url_params=None):
    """Given your API_KEY, send a GET request to the API.

    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.

    Returns:
        dict: The JSON response from the request.

    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    print(u'Querying {0} ...'.format(url))
    
    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()


def search(api_key, term, location):
    """Query the Search API by a search term and location.

    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.

    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        'term': term.replace(' ', '+'),
        'location': location.replace(' ', '+'),
        'limit':50
           }
    print(url_params)
    return request(API_HOST, SEARCH_PATH, api_key, url_params=url_params)


def get_business(api_key, business_id):
    """Query the Business API by a business ID.

    Args:
        business_id (str): The ID of the business to query.

    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return request(API_HOST, business_path, api_key)








#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "postgres://postgres:postgres@@127.0.0.1/yelp_data"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# os.environ.get('DATABASE_URL', '')
#"postgres://postgres:postgres@@127.0.0.1/yelp_data"
db = SQLAlchemy(app)


metadata = MetaData(bind=db.engine) 
Base = automap_base()


yelp_on_basic_data = Table('yelp_on_basic_data', metadata, autoload_with=db.engine) 
   

#session = Session(db.engine)
# reflect an existing database into a new model
# reflect the tables
Base.prepare(db.engine, reflect=True)

session = Session(db.engine)


# Save references to each table
Basic_data_model = Base.classes.yelp_on_full_data

Base.classes.keys()

# Select All
# Columns:['business_id', 'latitude', 'longitude', 'name', 'address', 'city','state', 
#             'postal_code', 'categories', 'is_open', 'review_count','stars']

sel_all = [ 
        Basic_data_model.business_id,
        Basic_data_model.latitude,
        Basic_data_model.longitude,
        Basic_data_model.name,
        Basic_data_model.address,
        Basic_data_model.city,
        Basic_data_model.state,
        Basic_data_model.postal_code,
        Basic_data_model.categories,
        Basic_data_model.is_open,
        Basic_data_model.review_count,
        Basic_data_model.stars,
        ]
#columns = ["index","name","address","city","postal_code","categories","review_count","stars"];

sel_rec_all = [ 
        Basic_data_model.index,
        Basic_data_model.name,
        Basic_data_model.address,
        Basic_data_model.city,
        Basic_data_model.postal_code,
        Basic_data_model.categories,
        Basic_data_model.review_count,
        Basic_data_model.stars,
        ]

def build_rec_metadata_list(yelp_jsondata_list,results):
    
    yelp_jsondata={}
    for result in results:
        yelp_jsondata['index'] = result[0]
        yelp_jsondata['name'] = result[1]
        yelp_jsondata['address'] = result[2]
        yelp_jsondata['city'] = result[3]
        yelp_jsondata['postal_code'] = result[4]
        yelp_jsondata['categories'] = result[5]
        yelp_jsondata['review_count'] = result[6]
        yelp_jsondata['stars'] = result[7]
       
        yelp_jsondata_list.append(yelp_jsondata)
        yelp_jsondata={}
    return yelp_jsondata_list

def build_metadata_list(yelp_jsondata_list,results):
    
    yelp_jsondata={}
    for result in results:
        yelp_jsondata['business_id'] = result[0]
        yelp_jsondata['latitude'] = result[1]
        yelp_jsondata['longitude'] = result[2]
        yelp_jsondata['name'] = result[3]
        yelp_jsondata['address'] = result[4]
        yelp_jsondata['city'] = result[5]
        yelp_jsondata['state'] = result[6]
        yelp_jsondata['postal_code'] = result[7]
        yelp_jsondata['categories'] = result[8]
        yelp_jsondata['is_open'] = result[9]
        yelp_jsondata['review_count'] = result[10]
        yelp_jsondata['stars'] = result[11]
       
        yelp_jsondata_list.append(yelp_jsondata)
        yelp_jsondata={}
    return yelp_jsondata_list

def build_api_metadata_list(results,yelp_api_jsondata_list):
    yelp_api_jsondata={}
    for result in results:
        yelp_api_jsondata['business_id'] = result['id']
        yelp_api_jsondata['latitude'] = result['coordinates']['latitude']
        yelp_api_jsondata['longitude'] = result['coordinates']['longitude']
        yelp_api_jsondata['name'] = result['name']
        yelp_api_jsondata['address'] = result['location']['address1']
        yelp_api_jsondata['city'] = result['location']['city']
        yelp_api_jsondata['state'] = result['location']['state']
        yelp_api_jsondata['postal_code'] = result['location']['zip_code']
        yelp_api_jsondata['categories'] = result['categories'][0]['title']
        yelp_api_jsondata['is_open'] =  not result['is_closed']
        yelp_api_jsondata['review_count'] = result['review_count']
        yelp_api_jsondata['stars'] = result['rating']
        yelp_api_jsondata['phone'] = result['phone']
        yelp_api_jsondata['img_url'] = result['image_url']
        
        yelp_api_jsondata_list.append(yelp_api_jsondata)
        yelp_api_jsondata = {}
    
    return yelp_api_jsondata_list
    



def build_filter_list(results,filter_name):
    filter_list = []
    if filter_name == 'business_id' :
        col = 0
    if filter_name == 'city' :
        col = 5
    if filter_name == 'categories' :
        col = 8
    if filter_name == 'stars' :
        col = 11
    for result in results:
        if result[col] != None:
            filter_list.append(result[col])

    filter_list = list(dict.fromkeys(filter_list))
    
    return filter_list

def category_feature_extraction(categories_list,get_top_num,no_count_flag):
    
    categories_list_rep = []
    for i in range(len(categories_list)):
        if categories_list[i] !=None:
            temp = re.sub('[&/\(),]', ' ', categories_list[i])
            categories_list_rep.append(temp)
        
    # tokenized 
    
    tokenized_category = [word_tokenize(word) for word in categories_list_rep]

    #into the single word
    all_categroy_words = []
    for word_list in tokenized_category:
        for word in word_list:
            all_categroy_words.append(word)
    #Words Frenqucies
    freq_list = FreqDist(all_categroy_words)

    #into the pandas dataframe
    category_df = pd.DataFrame.from_dict(freq_list, orient='index').reset_index()
    category_df = category_df.rename(columns={'index':'keyword', 0:'count'})
    
    #sort the words frequcies
    category_df_sort = category_df.sort_values('count',ascending=False )

    #return top_word_num
    top_df = category_df_sort[:get_top_num]
    if no_count_flag:
        top_list = top_df['keyword'].tolist()
        return top_list
    else:
        top_count_list=[]
        top_list = top_df['keyword'].tolist()
        count_list = top_df['count'].tolist()
        for i in [top_list,count_list]:
            top_count_list +=i
        return top_count_list




   




@app.route("/")
def index():
    return render_template("index.html")


@app.route("/category_charts")
def category_charts():
    return render_template("category_charts.html")



@app.route("/profiles")
def profiles():
    return render_template("profiles.html")


@app.route("/map_full")
def map_full():
    return render_template("map_full.html")

@app.route("/map_full_rev")
def map_full_rev():
    return render_template("map_full_rev.html")


@app.route("/map_geo")
def map_geo():
    return render_template("map_geo.html")

@app.route("/recsys")
def recsys():
    return render_template("recsys.html")

@app.route("/rating")
def rating():
    return render_template("rating.html")
   


@app.route("/yelp_metadata")
def yelp_metadata():

# Use Pandas to perform the sql query
    results = session.query(*sel_all).all()
    yelp_jsondata_list = []
    results_list = build_metadata_list(yelp_jsondata_list,results)
    
    return jsonify(results_list)

@app.route("/yelp_metadata/<filter_name>")
def inc_metadata_industry_names(filter_name):

# Use Pandas to perform the sql query
    results = session.query(*sel_all).all()
    results_list = build_filter_list(results,filter_name)
    
    return jsonify(results_list)


@app.route("/city/<city_name>")
def city_query(city_name):
    """Return a list of business Information based on queried city."""
    
    results = session.query(*sel_all).filter(Basic_data_model.city.ilike('%'+city_name+'%')).all() 
    jsondata_list = []

    results_list = build_metadata_list(jsondata_list,results)
    
    return jsonify(results_list)

@app.route("/stars/<stars_>")
def stars_query(stars_):
    """Return a list of business Information based on queried city."""
    
    results = session.query(*sel_all).filter(Basic_data_model.stars==float(stars_)).all() 
    jsondata_list = []

    results_list = build_metadata_list(jsondata_list,results)
    
    return jsonify(results_list)

@app.route("/yelp_metadata/pages/<num>")
def metadata_bypage(num):

# Use Pandas to perform the sql query
    table_list_num = int(num)*10
    results = session.query(*sel_all).limit(table_list_num).all()
    jsondata_list = []
    results_list = build_metadata_list(jsondata_list,results)
    
    return jsonify(results_list[(table_list_num-10):])

@app.route("/city/<city>/<page_num>")
def city_query_pg(city,page_num):
    """Return a list of Ranking # Company Information."""

    page_num = int(page_num)
    if page_num == 0:
        results = session.query(*sel_all).filter(Basic_data_model.city == city).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list)
    else:
        table_list_num = int(page_num)*10
        results = session.query(*sel_all).filter(Basic_data_model.city == city).limit(table_list_num).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list[(table_list_num-10):])

@app.route("/stars/<stars_>/<page_num>")
def stars_query_pg(stars_,page_num):
    
    page_num = int(page_num)
    if page_num == 0:
        results = session.query(*sel_all).filter(Basic_data_model.stars == float(stars_)).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list)
    else:
        table_list_num = int(page_num)*10
        results = session.query(*sel_all).filter(Basic_data_model.stars == float(stars_)).limit(table_list_num).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list[(table_list_num-10):])


   
@app.route("/apiquery/<term>/<location>")
def api_query(term,location):
    response = search(API_KEY, term, location)
    yelp_api_jsondata_list = []
    results_list = build_api_metadata_list(response['businesses'],yelp_api_jsondata_list)

    return jsonify(results_list)

@app.route("/category_feature/<num>")
def get_category_feature(num):
    sel_cate = [Basic_data_model.categories]
    categories = session.query(*sel_cate).all()
    # sql return data type is tuple
    # tuple convert into list
    categories_list = []
    single_categories_list = []
    for category in categories:
        categories_list.append(list(category))
    # merge the sub-list into one list
    for i in categories_list:
        single_categories_list +=i

    top_num_feature_words = category_feature_extraction(single_categories_list,int(num),True)
    return jsonify(top_num_feature_words)

@app.route("/category_feature_count/<num>")
def get_category_feature_count(num):
    sel_cate = [Basic_data_model.categories]
    categories = session.query(*sel_cate).all()
    # sql return data type is tuple
    # tuple convert into list
    categories_list = []
    single_categories_list = []
    for category in categories:
        categories_list.append(list(category))
    # merge the sub-list into one list
    for i in categories_list:
        single_categories_list +=i

    top_num_feature_words = category_feature_extraction(single_categories_list,int(num),False)
    return jsonify(top_num_feature_words)


    
@app.route("/category_feature/keyword/<keyword>")
def cate_query(keyword):
    """Return a list of business Information based on categorical keywords."""
    
    results = session.query(*sel_all).filter(Basic_data_model.categories.ilike('%'+keyword+'%')).all() 
    jsondata_list = []

    results_list = build_metadata_list(jsondata_list,results)
    
    return jsonify(results_list)

@app.route("/category_feature/keyword/<keyword>/<page_num>")
def cate_query_num(keyword,page_num):
    """Return a list of business Information based on categorical keywords."""
    
    page_num = int(page_num)
    if page_num == 0:
        results = session.query(*sel_all).filter(Basic_data_model.categories.ilike('%'+keyword+'%')).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list)
    else:
        table_list_num = int(page_num)*10
        results = session.query(*sel_all).filter(Basic_data_model.categories.ilike('%'+keyword+'%')).limit(table_list_num).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        return jsonify(results_list[(table_list_num-10):])

############### Recsys
np_filename = os.path.join(APP_STATIC, 'sim_features_file.npy')
df_filename = os.path.join(APP_STATIC, 'basic_rec_df.csv')
sim_features_fromfile = np.load(np_filename)
basic_rec_df = pd.read_csv(df_filename)
basic_rec_df.drop(['Unnamed: 0'],inplace=True, axis=1)
    

from sklearn.metrics.pairwise import cosine_similarity


def collab_filter(features_matrix, index, top_n):
                
    item_similarities = 1 - cosine_similarity(features_matrix[index:index+1], features_matrix).flatten() 
    related_indices = [i for i in item_similarities.argsort()[::-1] if i != index]

    return [(index, item_similarities[index]) for index in related_indices][0:top_n]

def yelp_recommender(items_df, biz_index, top_n):   
    print(basic_rec_df.index)
    rec_jsondata={}
    rec_jsondata_list=[]
        
    if biz_index in basic_rec_df.index:


        rec_jsondata['index'] = basic_rec_df.loc[biz_index].name
        rec_jsondata['Similarity_score'] = 'Original'
        rec_jsondata['business_id'] = basic_rec_df.loc[biz_index]['business_id']
        rec_jsondata['tokenized_category'] = basic_rec_df.loc[biz_index]['tokenized_category']
        rec_jsondata['Rating'] = basic_rec_df.loc[biz_index]['stars']
        
        rec_jsondata_list.append(rec_jsondata)
       
        
        # define the location index for the DataFrame index requested
        array_ix = basic_rec_df.index.get_loc(biz_index)

        top_results = collab_filter(items_df, array_ix, top_n)
        
        print('\nTop',top_n,'results: ') 
        rec_jsondata = {}
        
        order = 1
        for i in range(len(top_results)):
            rec_jsondata['index'] = basic_rec_df.iloc[top_results[i][0]].name
            rec_jsondata['Similarity_score'] = top_results[i][1]
            rec_jsondata['business_id'] = basic_rec_df.iloc[top_results[i][0]]['business_id']
            rec_jsondata['tokenized_category'] = basic_rec_df.iloc[top_results[i][0]]['tokenized_category']
            rec_jsondata['Rating'] = basic_rec_df.iloc[top_results[i][0]]['stars']
            if order < top_n: order += 1
            rec_jsondata_list.append(rec_jsondata)
            rec_jsondata = {}
    
    
    else:
        print('Whoops! Choose another. Try something from here: \n', basic_rec_df.index[100:200])
    
    return rec_jsondata_list




@app.route("/recsys/<biz_index>/<top_n>")
def recsys_query(biz_index,top_n):
    rec_list = yelp_recommender(sim_features_fromfile,int(biz_index),int(top_n))
    full_rec_list = []
    for rec in rec_list:
        biz_id = rec['business_id']
        """Return a list of business Information based on queried city."""
    
        results = session.query(*sel_all).filter(Basic_data_model.business_id==biz_id).all() 
        jsondata_list = []
        results_list = build_metadata_list(jsondata_list,results)
        full_rec_list.append(results_list)



    return jsonify(full_rec_list)


#columns = ["index","name","address","city","postal_code","categories","review_count","stars"];

@app.route("/yelp_rec_metadata/pages/<num>")
def rec_metadata_bypage(num):

# Use Pandas to perform the sql query
    table_list_num = int(num)*5
    results = session.query(*sel_rec_all).limit(table_list_num).all()
    jsondata_list = []
    results_list = build_rec_metadata_list(jsondata_list,results)
    
    return jsonify(results_list[(table_list_num-5):])

@app.route("/yelp_rec_metadata")
def yelp_rec_metadata():

# Use Pandas to perform the sql query
    results = session.query(*sel_rec_all).all()
    yelp_jsondata_list = []
    results_list = build_rec_metadata_list(yelp_jsondata_list,results)
    
    return jsonify(results_list)



@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

###############################################################
    
if __name__ == "__main__":
    app.run(debug=True)
