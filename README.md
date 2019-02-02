for when HOST of terminal session defaults to environment HOST
declare -x HOST="127.0.0.1"

County Data and GPS Locations Source:
https://simplemaps.com/data/us-zips
https://simplemaps.com/data/us-cities

Setting up Python3 Environment

update pip for python3
curl https://bootstrap.pypa.io/get-pip.py | python3

check pip version
pip --version

deactivate 
rm -rf env
virtualenv -p python3 env
source ./env/bin/activate
pip install -r requirements.txt