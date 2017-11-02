.SILENT: readme

readme:
	./node_modules/.bin/vuedoc.md component.vue \
		--ignore-name \
		--ignore-data \
		--section 'FormSchema API' \
		--output ./README.md
