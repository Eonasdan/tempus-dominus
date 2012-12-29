deps:
	npm install -d

build: deps
	mkdir -p build/js
	mkdir -p build/css
	@./node_modules/.bin/uglifyjs --comments \
		-o build/js/bootstrap-datetimepicker.min.js \
	       	src/js/bootstrap-datetimepicker.js
	@./node_modules/.bin/lessc --yui-compress --include-path=node_modules/bootstrap/less\
	       	src/less/bootstrap-datetimepicker.less \
	       	build/css/bootstrap-datetimepicker.min.css

test: build deps
	@./test/run.sh

clean:
	rm -rf build

.PHONY: deps build clean test
