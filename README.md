# ember-cli-markdown-editor

markdown-editor is a markdown enhanced textarea with native browser spellchecking

Features:
- Bootstrap Styling by default
- Font Awesome Icons
- Supports all textarea Attributes
- Does not depend on a specific markdown addon to generate html formatted markup
- Native browser spellchecking
- Disable Buttons via an optional btns array
- Undo Button
- Provide localization via [ember-intl](https://github.com/ember-intl/ember-intl)

## Requirements

- ember-cli 2.4.2 or higher
- Bootstrap CSS
- Font Awesome CSS an Icons

## Installation

* `ember install ember-cli-bootstrap-css` Or your favorite Bootstrap addon
* `ember install ember-font-awesome` Or your favorite Font Awesome addon
* `ember install ember-cli-markdown-editor` This addon

## Usage

Add the markdown-editor to your templates like you would normaly do with a textarea.

Minimal
```
{{markdown-editor value=myValue}}
```

Common
```
{{markdown-editor
rows='8'
placeholder="Post content"
value=myValue
}}
```

All Buttons
```
{{markdown-editor
rows='8'
placeholder="Post content"
btns='heading,bold,italic,quote,link,image,table,hr,list-ol,list-ul,undo,help'
value=myValue
}}
```

Some Buttons
```
{{markdown-editor
rows='8'
placeholder="Post content"
btns='bold,italic,list-ol,list-ul'
value=myValue
}}
```

## Running the Dummy App

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Credits

This project was originally based on the [ember-bootstrap-markdown](https://github.com/ChrisHonniball/ember-bootstrap-markdown) by [@ChrisHonniball](https://github.com/ChrisHonniball), and I really like his code.

And of course thanks to all our wonderful contributors, [here](https://github.com/martinic/ember-cli-markdown-editor/graphs/contributors).

## Changelog
* **0.1.0-beta.4**
  - Upgrade ember-intl to 2.30.1
* **0.1.0-beta.3**
  - Add [ember-intl](https://github.com/ember-intl/ember-intl) translations
  - Add tabindex='-1' if modal is true
* **0.1.0-beta.2**
  - Add some readme
* **0.1.0-beta.1**
  - First version
