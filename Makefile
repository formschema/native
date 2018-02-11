.SILENT: readme
.DEFAULT: readme

readme:
	./node_modules/.bin/vuedoc.md --join src/components/*.js --ignore-name --ignore-data --section 'FormSchema API' --output ./README.md
