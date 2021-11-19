import { next } from '@ember/runloop';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/markdown-editor';

export default Component.extend({
  intl: service(),
  layout: layout,

  classNames: ['markdown-editor'],

  ////////////////
  //! Variables //
  ////////////////

  /*
   * The value
   */
  value: "",

  /*
   * Holds the previous value of the textarea while editing.
   */
  previousValue: "",

  /*
   * Undo history array that holds previous values while editing content.
   */
  undoHistory: A(),

  btns: 'heading,bold,italic,quote,link,image,table,hr,list-ol,list-ul,undo,help',

  /*
   * Builds toolbar out of the supplied string of buttons.
   */
  toolbarBtns: computed('btns', function() {
    var that = this,
      btns = that.get('btns').split(','),
      toolbarBtns = [],
      btnGroups = [],
      formattingOpts = that.get('_formattingOpts');

    btns.forEach(function(type) {
      if(!btnGroups[formattingOpts[type].group]) {
        btnGroups[formattingOpts[type].group] = [];
      }
      btnGroups[formattingOpts[type].group].push(formattingOpts[type]);
    });

    btnGroups.forEach(function(btn) {
      toolbarBtns.push(A(btn));
    });

    return A(toolbarBtns);
  }),

  /*
   * Default formats supplied with the component.
   */
  _formattingOpts: {
    'heading': {
      regex: '## $1',
      requireSelection: false,
      group: 1,
      enter: 'start',
      style: 'heading',
      tooltip: 'markdown-editor.formats.heading.tooltip',
      iconSvg: 'header',
      defaultType: true
    },
    'bold': {
      regex: '**$1**',
      requireSelection: true,
      group: 2,
      enter: 'none',
      style: 'bold',
      tooltip: 'markdown-editor.formats.bold.tooltip',
      iconSvg: 'bold',
      defaultType: true
    },
    'italic': {
      regex: '*$1*',
      requireSelection: true,
      group: 2,
      enter: 'none',
      style: 'italic',
      tooltip: 'markdown-editor.formats.italic.tooltip',
      iconSvg: 'italic',
      defaultType: true
    },
    'quote': {
      regex: '> $1',
      requireSelection: false,
      group: 3,
      enter: 'start',
      style: 'quote',
      tooltip: 'markdown-editor.formats.quote.tooltip',
      iconSvg: 'quote-right',
      defaultType: true
    },
    'link': {
      regex: '[$1]({{result}})',
      requireSelection: true,
      group: 4,
      enter: 'none',
      style: 'link',
      tooltip: 'markdown-editor.formats.link.tooltip',
      iconSvg: 'chain',
      prompt: 'markdown-editor.formats.link.prompt',
      defaultType: true
    },
    'image': {
      regex: '![$1]({{result}})',
      requireSelection: false,
      group: 4,
      enter: 'none',
      style: 'image',
      tooltip: 'markdown-editor.formats.image.tooltip',
      iconSvg: 'image',
      prompt: 'markdown-editor.formats.image.prompt',
      defaultType: true
    },
    'table': {
      regex: '\nFirst Header | Second Header\n--- | ---\nFirst column | Second column\n',
      requireSelection: false,
      group: 5,
      enter: 'start',
      style: 'table',
      tooltip: 'markdown-editor.formats.table.tooltip',
      iconSvg: 'table',
      defaultType: true
    },
    'hr': {
      regex: '\n------------------\n',
      requireSelection: false,
      group: 5,
      enter: 'start',
      style: 'hr',
      tooltip: 'markdown-editor.formats.hr.tooltip',
      iconSvg: 'minus',
      defaultType: true
    },
    'list-ol': {
      regex: '1. $1',
      requireSelection: false,
      group: 6,
      enter: 'list',
      style: 'list-ol',
      tooltip: 'markdown-editor.formats.list-ol.tooltip',
      iconSvg: 'list-ol',
      defaultType: true
    },
    'list-ul': {
      regex: '* $1',
      requireSelection: false,
      group: 6,
      enter: 'list',
      style: 'list-ul',
      tooltip: 'markdown-editor.formats.list-ul.tooltip',
      iconSvg: 'list-ul',
      defaultType: true
    },
    'undo': {
      group: 7,
      style: 'undo',
      tooltip: 'markdown-editor.formats.undo.tooltip',
      iconSvg: 'rotate-left',
      undoType: true
    },
    'help': {
      group: 8,
      style: 'help',
      tooltip: 'markdown-editor.formats.help.tooltip',
      href: 'markdown-editor.formats.help.href',
      iconSvg: 'question-circle',
      helpType: true
    }
  },

  //////////////////////////
  //! Computed Properties //
  //////////////////////////

  /*
   * Return tabindex='-1' if model is true
   */
  modalTabindex: computed('tabindex', 'modal', function() {
    if (this.modal) {
      return '-1';
    }
    return this.tabindex;
  }),

  /*
   * Generated textarea ID for the instance.
   */
  textareaId: computed('elementId', function() {
    return this.elementId + '-editor';
  }),

  /*
   * Flag that tells if there are undo steps that can be performed.
   */
  noUndo: computed('undoHistory.length', function() {
    return (this.get('undoHistory.length') < 1) ? true : false;
  }),

  ///////////////////
  //! Ember Events //
  ///////////////////

  /*
   * Set locale to `en-us` if it is not set by the application
   */
  init: function() {
    this._super(...arguments);
    if(!this.intl.get('locale')) {
      this.intl.setLocale('en-us');
    }
  },

  /*
   * Binds all the events to the textarea.
   */
  didInsertElement: function() {
    var that = this;

    that.setProperties({
      startPos: 0,
      endPos: 0,
      selection: '',
      lastchar: '\n',
      previousValue: that.get('value')
    });

    that.send('clearUndo');
  },

  //////////////
  //! Actions //
  //////////////

  actions: {
    /*
     * Gets the selection from the textarea on blur.
     * This enables the buttons to perform actions on the selection.
     */
    handleTextareaBlur: function(){
      var that = this,
        textComponent = document.getElementById(that.get('textareaId')),
        selection, startPos, endPos,
        lastchar = '\n';

      startPos = textComponent.selectionStart;
      endPos = textComponent.selectionEnd;
      selection = textComponent.value.substring(startPos, endPos);

      if (startPos) {
        lastchar = textComponent.value.substring(startPos - 1, startPos);
      }

      that.setProperties({
        startPos: startPos,
        endPos: endPos,
        selection: selection,
        lastchar: lastchar
      });
    },
    /*
     * Applies the style to text based on the regex sent.
     * @param regex The supplied regular expression that handles the replacement.
     * @param promptText Supplied text for a standard prompt dialog.
     */
    applyStyle: function(regex, requireSelection = false, promptText = null, tooltip = null ,enter){
      this.set('regex', regex);
      this.set('enter', enter);
      this.set('promptText', promptText);
      this.set('tooltip', tooltip);

      if(!this.selection && requireSelection){
        this.set('modal', true);
        this.set('dialog', true);
      } else if (promptText){
        this.set('modal', true);
        this.set('dialog', false);
      } else {
        this.set('modal', false);
        this.send('setValue', regex, enter);
      }
    },

    confirm: function (result) {
      let that = this,
        regex = that.get('regex'),
        enter = that.get('enter');
        regex = regex.replace('{{result}}', result);
      this.send('setValue', regex, enter);
      this.set('modal', '');
    },

    cancel: function () {
      this.set('modal', '');
    },

    setValue: function(regex, enter) {
      let that = this,
        value = that.get('value'),
        lastchar =  that.get('lastchar'),
        selection = that.get('selection'),
        extraEnter = '';

      if (enter === 'start' || enter === 'list') {
        if (!lastchar.includes('\n')) {
          extraEnter = '\n';
        }
      }
      if (enter === 'list') {
        if (lastchar === ' ') {
          extraEnter = '';
        }
      }

      that.send('addUndoStep', value);

      var newStr = selection.replace(/^(.*)$/gm, regex),
        newValue = value.substr(0, that.get('startPos')) + extraEnter + newStr + value.substr(that.get('endPos'), value.length),
        newCursorPos = that.get('startPos') + extraEnter.length + newStr.length,
        strOffset = extraEnter.length + newStr.length - that.get('selection').length;

      that.setProperties({
        selection: '',
        value: newValue,
        newCursorPos: newCursorPos
      });

      that.send('setCursor', that.get('endPos') + strOffset);
    },

    /*
     * Sets the cursor location in the texterea.
     * @param pos The desired cursor possition.
     */
    setCursor: function(pos) {
      var that = this,
        ctrl = document.getElementById(that.get('textareaId'));

      if(ctrl.setSelectionRange) {
        ctrl.focus();
        next(that, function() {
          ctrl.setSelectionRange(pos, pos);
        });
      } else if(ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    },

    /*
     * Adds a step to the undo array.
     * @param value The value that is to be saved as an undo step.
     */
    addUndoStep: function(value) {
      var that = this,
        undoHistory = that.get('undoHistory');

      undoHistory.pushObject(value);

      that.set('undoHistory', undoHistory);
    },

    /*
     * Clears out the undo array.
     */
    clearUndo: function() {
      var that = this;

      that.set('undoHistory', A());
    },

    /*
     * Reverts the value to a previous value based on the undo array.
     */
    undo: function() {
      var that = this,
        undoHistory = that.get('undoHistory').toArray();

      if(undoHistory.length === 0){
        alert('No more steps to undo.');
        return false;
      }

      var restoreValue = undoHistory.pop();

      that.setProperties({
        undoHistory: A(undoHistory),
        value: restoreValue
      });
    },
  }
});
