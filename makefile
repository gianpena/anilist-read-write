tampermonkey-script.build.js:
	cp tampermonkey-script.js tampermonkey-script.build.js
	. .env && sed -i '' "s|__API_URL__|$${API_URL}|g" tampermonkey-script.build.js

clean:
	rm tampermonkey-script.build.js

.PHONY: clean