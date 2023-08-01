*Made with Vite + Flask*

https://albumsortify.fr

# If you want to host your own version :
## To install :
  - Create the database using ddb.sql
  - `npm i`
  
## To run :
  - `npm run dev`
  - `sudo docker build . -f AlbumSortify/Dockerfile -t flask-server && sudo docker run -d --network host  flask-server --port 3306 --port 3000`
