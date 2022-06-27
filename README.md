# CallerPackage
```
browserify ./src/app.js -o ./dist/bundle.js
Then -> Live Server

## For convenience
Download "run on save" extention.
Open its setting.json in settings>extentions>Run On Save> edit in settings.json
Paste following:-
{
    "workbench.startupEditor": "none",
    "window.zoomLevel": 1,
    "emeraldwalk.runonsave": {
        "commands": [
            {
                "match": "\\.js$",
                "cmd": "browserify ./src/app.js -o ./dist/bundle.js "
            }
        ]
    }
}

Now command will auto run with save.
```

```
browserify src/popup/popup.js -o src/child_bundle.js 
browserify src/client/client.js -o src/parent_bundle.js
```