ember-cli-markdown-editor
==============================================================================

<<<<<<< HEAD
markdown-editor is a markdown enhanced textarea with native browser spellchecking

Features:
- Bootstrap Styling by default
- Font Awesome SVG Icons
- Supports all textarea Attributes
- Does not depend on a specific markdown addon to generate html formatted markup
- Native browser spellchecking
- Disable Buttons via an optional btns array
- Undo Button
- Provide localization via [ember-intl](https://github.com/ember-intl/ember-intl)

## Requirements

- ember-cli 2.4.2 or higher
- Bootstrap CSS
=======
[Short description of the addon.]
>>>>>>> 88f173f (v2.13.3...v3.8.3)


<<<<<<< HEAD
* `ember install ember-cli-bootstrap-css` Or your favorite Bootstrap addon
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

## Localization

If you include in your project root a folder called `translations` you can add transition files like this per locale:

`translations/nl-nl.yaml`
```yaml
markdown-editor:
  modal:
    selectionText: 'Maak eerst een selectie'
    confirm: 'Bevestigen'
    cancel: 'Annuleren'
  formats:
    heading:
      tooltip: 'Hoofdstuk toevoegen'
    bold:
      tooltip: 'Maak de selectie vet'
    italic:
      tooltip: 'Maak de selectie schuingedrukt'
    quote:
      tooltip: 'Voeg geciteerde tekst toe'
    link:
      tooltip: 'Maak een link van de selectie'
      prompt: 'Vul het linkadres in. Inclusief http://'
    image:
      tooltip: 'Voeg een plaatje toe'
      prompt: 'Voer het afbeeldingadres in. Inclusief http://'
    table:
      tooltip: 'Tabel toevoegen'
    hr:
      tooltip: 'Horizontale lijn'
    list-ol:
      tooltip: 'Voeg genummerde lijst toe'
    list-ul:
      tooltip: 'Add Bulletted List'
    undo:
      tooltip: 'Ongedaan maken'
    help:
      tooltip: 'Wat is Markdown?'
      href: 'https://guides.github.com/features/mastering-markdown/'
```

## Running the Dummy App
=======
Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
>>>>>>> 88f173f (v2.13.3...v3.8.3)


Installation
------------------------------------------------------------------------------

```
ember install ember-cli-markdown-editor
```

<<<<<<< HEAD
## Credits

This project was originally based on the [ember-bootstrap-markdown](https://github.com/ChrisHonniball/ember-bootstrap-markdown) by [@ChrisHonniball](https://github.com/ChrisHonniball), and I really like his code.

And of course thanks to all our wonderful contributors, [here](https://github.com/martinic/ember-cli-markdown-editor/graphs/contributors).

## Changelog
* **0.2.0**
  - Integration of ember-svg-jar
  - Removed Font Awesome from requirements and Installation
* **0.1.1**
  - Remove jQuery dependency
* **0.1.0**
  - Release v0.1.0
* **0.1.0-beta.5**
  - Update ember-intl to v3.2.6
* **0.1.0-beta.4**
  - Upgrade ember-intl to 2.30.1
* **0.1.0-beta.3**
  - Add [ember-intl](https://github.com/ember-intl/ember-intl) translations
  - Add tabindex='-1' if modal is true
* **0.1.0-beta.2**
  - Add some readme
* **0.1.0-beta.1**
  - First version
=======

Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
>>>>>>> 88f173f (v2.13.3...v3.8.3)
