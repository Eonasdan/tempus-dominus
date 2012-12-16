deps:
	git submodule init
	git submodule update
	npm install -d

build:
	mkdir -p build/js
	mkdir -p build/css
	@./node_modules/.bin/uglifyjs -o build/js/bootstrap-datepicker.min.js src/js/bootstrap-datepicker.js
	@./node_modules/.bin/lessc --include-path=bootstrap/less src/less/datepicker.less build/css/datepicker.css

clean:
	rm -rf build

.PHONY: deps build clean
