from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# MySQL connection
def connecter():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="albumSortify",
        autocommit=True
    )


@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    return response


@app.route("/list/<int:listID>", methods=["GET"])
def get_albums_from_list(listID):
    sql = "SELECT * FROM album WHERE listID = %s ORDER BY date_created"
    connection = connecter()

    try:
        cursor = connection.cursor()
        cursor.execute(sql, (listID,))
        result = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()

    albums = []
    for album in result:
        albums.append({
            "id": album[0],
            "userID": album[1],
            "name": album[2],
            "date_created": album[3],
            "artist": album[4],
            "picture_url": album[5],
            "url": album[6],
            "releaseDate": album[7],
            "spotifyID": album[8],
            "listID": album[9],
            "total_tracks": album[10]
        })

    return jsonify(albums), 200


@app.route("/albumlist/<string:userID>", methods=["GET"])
def get_album_lists(userID):
    sql = """
        SELECT albumlist.*, MAX(album.date_created) AS latest_date_created
        FROM albumlist
        LEFT JOIN album ON album.listID = albumlist.id
        WHERE albumlist.userID = %s
        GROUP BY albumlist.id
        ORDER BY latest_date_created
    """

    connection = connecter()
    try:
        cursor = connection.cursor()
        cursor.execute(sql, (userID,))
        result = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()

    lists = []
    for row in result:
        lists.append({
            "id": row[0],
            "name": row[1],
            "userID": row[2],
            "date_created": row[3],
            "color": row[4]
        })

    return jsonify(lists), 200


@app.route("/albumlist", methods=["POST"])
def create_list():
    data = request.json
    sql = "INSERT INTO albumlist (userID, name, color) VALUES (%s, %s, %s)"

    connection = connecter()
    try:
        cursor = connection.cursor()
        cursor.execute(sql, (data["userID"], data["name"], data["color"]))
    finally:
        cursor.close()
        connection.close()

    return jsonify(data), 201


@app.route("/albums", methods=["POST"])
def add_album():
    data = request.json
    sql = """
        INSERT INTO album
        (userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        data["userID"], data["name"], data["artist"],
        data["picture_url"], data["url"], data["releaseDate"],
        data["spotif]()
