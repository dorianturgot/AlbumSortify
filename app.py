from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import ssl
import schedule
import time

app = Flask(__name__)
CORS(app)

# MySQL connection setup
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='password',
    database='albumSortify'
)

def perform_connection_check():
    if connection.is_connected():
        console.log("Connection refresh")
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.close()

# Schedule connection check every hour
schedule.every(1).hours.do(perform_connection_check)


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    return response


# GET - get all albums from a list for a user
@app.route('/list/<string:listID>', methods=['GET'])
def get_albums_from_list(listID):
    sort = request.args.get('sort')
    sql = f"SELECT * FROM album WHERE listID = {listID} ORDER BY date_created;"

    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()

    if result is None:
        return jsonify({'error': 'No albums found'}), 404
    # MAKE A LIST OF OJECTS WITH ID, AUTHGOR DATE, COLOR

    final_result = []
    for album in result:
        album_dict = {
            'id': album[0],
            'userID': album[1],
            'name': album[2],
            'date_created': album[3],
            'artist': album[4],
            'picture_url': album[5],
            'url': album[6],
            'releaseDate': album[7],
            'spotifyID': album[8],
            'listID': album[9],
            'total_tracks': album[10]

        }
        final_result.append(album_dict)


    return jsonify(final_result), 200

# GET - get all lists for a user
@app.route('/albumlist/<string:userID>', methods=['GET'])
def get_album_lists(userID):
    sort = request.args.get('sort')
    sql = f"SELECT * FROM albumlist WHERE userID = '{userID}' ORDER BY date_created;"

    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()

    if result is None:
        return jsonify({'error': 'No albums found'}), 404

    # do the same as the previous function according to the ddb file
    final_result = []
    for albumlist in result:
        albumlist_dict = {
            'id': albumlist[0],
            'name': albumlist[1],
            'userID': albumlist[2],
            'date_created': albumlist[3],
            'color': albumlist[4]

        }
        final_result.append(albumlist_dict)

    return jsonify(final_result), 200

# POST - create a new list
@app.route('/albumlist', methods=['POST'])
def create_list():
    data = request.json
    userID = data['userID']
    name = data['name']
    color = data['color']

    query = "INSERT INTO albumlist (userID, name, color) VALUES (%s, %s, %s)"
    values = (userID, name, color)

    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()

    return jsonify(data), 200

# POST - add an album to a list
@app.route('/albums', methods=['POST'])
def add_album():
    data = request.json
    userID = data['userID']
    name = data['name']
    artist = data['artist']
    picture_url = data['picture_url']
    url = data['url']
    releaseDate = data['releaseDate']
    spotifyID = data['spotifyID']
    listID = data['listID']
    total_tracks = data['total_tracks']

    query = "INSERT INTO album (userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    values = (userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks)

    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()

    return jsonify(data), 200

# PUT - update an albumlist name or color
@app.route('/albumlist/<int:listID>', methods=['PUT'])
def update_albumlist(listID):
    data = request.json
    name = data['name']
    color = data['color']

    query = "UPDATE albumlist SET name=%s, color=%s WHERE id=%s"
    values = (name, color, listID)

    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()

    return jsonify({'listID': listID, 'name': name, 'color': color}), 200

# DELETE - delete an album from a list
@app.route('/albums/<int:albumID>', methods=['DELETE'])
def delete_album(albumID):
    sql = f"DELETE FROM album WHERE id = {albumID}"

    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    cursor.close()

    return jsonify({'albumID': albumID}), 200

# DELETE - delete a list
@app.route('/albumlist/<int:listID>', methods=['DELETE'])
def delete_list(listID):
    sql = f"DELETE FROM albumlist WHERE id = {listID}"

    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    cursor.close()

    return jsonify({'listID': listID}), 200

# DELETE - delete all albums from a list
@app.route('/album/<int:listID>', methods=['DELETE'])
def delete_all_albums(listID):
    sql = f"DELETE FROM album WHERE listID = {listID}"

    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    cursor.close()

    return jsonify({'listID': listID}), 200



# Run the Flask app
if __name__ == '__main__':
    schedule.run_continuously()
    app.run()
