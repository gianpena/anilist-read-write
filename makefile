tampermonkey-script.build.js:
	cp tampermonkey-script.js tampermonkey-script.build.js
	bash -c 'source .env && sed "s|__API_URL__|$$API_URL|g" tampermonkey-script.build.js > tampermonkey-script.build.js.tmp && mv tampermonkey-script.build.js.tmp tampermonkey-script.build.js'

clean:
	rm tampermonkey-script.build.js

.PHONY: clean