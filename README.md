# ember-cli-markdown-editor

markdown-editor is a markdown enhanced textarea with native browser spellchecking

Features:

- Bootstrap 5 Styling by default
- Font Awesome SVG Icons
- Supports all textarea Attributes
- Does not depend on a specific markdown addon to generate html formatted markup
- Native browser spellchecking
- Disable Buttons via an optional btns array
- Undo Button
- Provide localization via [ember-intl](https://github.com/ember-intl/ember-intl)
- Compact mode

## Requirements

- ember-cli 3.28.4 or higher
- Bootstrap 5 CSS

## Installation

- `npm install bootstrap` Or your favorite Bootstrap 5 addon
- `ember install ember-cli-markdown-editor` This addon

## Usage

First make sure your route file app/routes/application.js sets the default language for the intl service:

```
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;

  async beforeModel() {
    super.init(...arguments);
    return this.intl.setLocale(['en-us']);
  }
}
```

Add the markdown-editor to your templates like you would normaly do with a textarea but passing a param function to update the value, like in the examples.

Minimal

```
<MarkdownEditor @value={{this.myValue}} @onChange={{fn (mut this.myValue)}} />
```

Common

```
<MarkdownEditor
  @rows="8"
  @placeholder="Post content"
  @value={{this.myValue}}
  @onChange={{fn (mut this.myValue)}}
/>
```

Compact mode

```
<MarkdownEditor
  @rows="8"
  @placeholder="Post content"
  @value={{this.myValue}}
  @onChange={{fn (mut this.myValue)}}
  @compact={{true}}
/>
```

All Buttons

```
<MarkdownEditor
  @rows="8"
  @placeholder="Post content"
  @btns="heading,bold,italic,quote,link,image,table,hr,list-ol,list-ul,undo,help"
  @value={{this.myValue}}
  @onChange={{fn (mut this.myValue)}}
/>
```

Some Buttons

```
<MarkdownEditor
  @rows="8"
  @placeholder="Post content"
  @btns="bold,italic,list-ol,list-ul"
  @value={{this.myValue}}
  @onChange={{fn (mut this.myValue)}}
/>
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

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

## Credits

This project was originally based on the [ember-bootstrap-markdown](https://github.com/ChrisHonniball/ember-bootstrap-markdown) by [@ChrisHonniball](https://github.com/ChrisHonniball), and I really like his code.

And of course thanks to all our wonderful contributors, [here](https://github.com/martinic/ember-cli-markdown-editor/graphs/contributors).

## Changelog

- **0.4.0**
  - Updated ember to 4.3.0
  - Updated ember-intl to 6.0.0-beta.3 so it can be used with ember 4.3.0.
- **0.3.0**
  - Reworked to Octane syntax.
  - Update ember-cli to 3.28.4
  - Update bootstrap to bootstrap 5.1.3
  - Update ember-intl to v5.7.0
- **0.2.0**
  - Integration of ember-svg-jar
  - Removed Font Awesome from requirements and Installation
- **0.1.1**
  - Remove jQuery dependency
- **0.1.0**
  - Release v0.1.0
- **0.1.0-beta.5**
  - Update ember-intl to v3.2.6
- **0.1.0-beta.4**
  - Upgrade ember-intl to 2.30.1
- **0.1.0-beta.3**
  - Add [ember-intl](https://github.com/ember-intl/ember-intl) translations
  - Add tabindex='-1' if modal is true
- **0.1.0-beta.2**
  - Add some readme
- **0.1.0-beta.1**
  - First version
