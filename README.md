for when HOST of terminal session defaults to environment HOST
declare -x HOST="127.0.0.1"

County Data and GPS Locations Source:
https://simplemaps.com/data/us-zips
https://simplemaps.com/data/us-cities

Setting up Python3 Environment

Go into server directory
cd server

check pip version
pip --version

setting up virtualenv
virtualenv -p python3 env

using newly made virtual env
source ./env/bin/activate

update pip for python3
curl https://bootstrap.pypa.io/get-pip.py | python3

install packages and their versions as dictated by requirements.txt
pip install -r requirements.txt

start flask app
FLASK_APP=app.py flask run

Setting up Anaconda Environment for Jupyter Notebook

- Open Anaconda Navigator > Environments 
- Go to base and click the play button then Open Terminal
- Go to the server directory in this project
- Install packages via requirements.txt with sudo
sudo pip install -r requirements.txt

