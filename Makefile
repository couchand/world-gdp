# build the visualization from source
all: data script

# get the data
data: www/data.csv
www/data.csv:
	curl http://www.explainingprogress.com/wp-content/uploads/nvd3/GDPlevelsSince1_maddison/GDPlevelsSince1_maddison.csv | tr '\r' '\n' > www/data.csv

# compile the coffeescript
script: www/script.js
www/script.js: src/script.coffee
	coffee -c -o www src/script.coffee

clean:
	rm www/data.csv www/script.js
