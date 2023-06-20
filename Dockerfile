FROM python:3.9

COPY  /home/debian/AlbumSortify/requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY /etc/letsencrypt/live/albumsortify.fr/cert.pem /app/cert.pem
COPY /etc/letsencrypt/live/albumsortify.fr/privkey.pem /app/key.pem
RUN chmod 400 /app/key.pem
RUN chmod 400 /app/cert.pem

COPY /home/debian/AlbumSortify/app.py /app/app.py

WORKDIR /app
EXPOSE 5000

ENV FLASK_APP=/app/app.py
ENV FLASK_ENV="development"
ENV FLASK_RUN_HOST="0.0.0.0"
ENV FLASK_RUN_PORT="3000"

ENTRYPOINT [ "flask", "run", "--cert=/app/cert.pem", "--key=/app/key.pem"]
