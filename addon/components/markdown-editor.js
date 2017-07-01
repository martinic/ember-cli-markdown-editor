import Ember from 'ember';
import layout from '../templates/components/markdown-editor';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['markdown-editor'],

  ////////////////
  //! Variables //
  ////////////////

  lang: {
    modal: {
      selectionText: 'Please make a text selection',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    help: {
      title: 'What is Markdown?',
      href: 'https://guides.github.com/features/mastering-markdown/'
    }
  },

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
  undoHistory: Ember.A(),

  btns: 'heading,bold,italic,quote,link,image,table,hr,list-ol,list-ul',

  /*
   * Builds toolbar out of the supplied string of buttons.
   */
  toolbarBtns: Ember.computed('btns', function() {
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
      toolbarBtns.push(Ember.A(btn));
    });

    return Ember.A(toolbarBtns);
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
      tooltip: 'Add Heading',
      iconClass: 'fa-header'
    },
    'bold': {
      regex: '**$1**',
      requireSelection: true,
      group: 2,
      enter: 'none',
      style: 'bold',
      tooltip: 'Make Selection Bold',
      iconClass: 'fa-bold'
    },
    'italic': {
      regex: '*$1*',
      requireSelection: true,
      group: 2,
      enter: 'none',
      style: 'italic',
      tooltip: 'Make Selection Italic',
      iconClass: 'fa-italic'
    },
    'quote': {
      regex: '> $1',
      requireSelection: false,
      group: 3,
      enter: 'start',
      style: 'quote',
      tooltip: 'Add Quoted Text',
      iconClass: 'fa-quote-right'
    },
    'link': {
      regex: '[$1]({{result}})',
      requireSelection: true,
      group: 4,
      enter: 'none',
      style: 'link',
      tooltip: 'Make Selection a Link',
      iconClass: 'fa-link',
      prompt: 'Enter your link address. Include http://.'
    },
    'image': {
      regex: '![$1]({{result}})',
      requireSelection: false,
      group: 4,
      enter: 'none',
      style: 'image',
      tooltip: 'Add Embedded Image',
      iconClass: 'fa-image',
      prompt: 'Enter the image URL'
    },
    'table': {
      regex: '\nFirst Header | Second Header\n--- | ---\nFirst column | Second column\n',
      requireSelection: false,
      group: 5,
      enter: 'start',
      style: 'table',
      tooltip: 'Add table',
      iconClass: 'fa-table'
    },
    'hr': {
      regex: '\n------------------\n',
      requireSelection: false,
      group: 5,
      enter: 'start',
      style: 'hr',
      tooltip: 'Horizontal rule',
      iconClass: 'fa-minus'
    },
    'list-ol': {
      regex: '1. $1',
      requireSelection: false,
      group: 6,
      enter: 'list',
      style: 'list-ol',
      tooltip: 'Add Ordered List',
      iconClass: 'fa-list-ol'
    },
    'list-ul': {
      regex: '* $1',
      requireSelection: false,
      group: 6,
      enter: 'list',
      style: 'list-ul',
      tooltip: 'Add Bulletted List',
      iconClass: 'fa-list-ul'
    }
  },

  //////////////////////////
  //! Computed Properties //
  //////////////////////////

  /*
   * Generated textarea ID for the instance.
   */
  textareaId: Ember.computed('elementId', function() {
    return this.get('elementId') + '-editor';
  }),

  /*
   * Flag that tells if there are undo steps that can be performed.
   */
  noUndo: Ember.computed('undoHistory.length', function() {
    return (this.get('undoHistory.length') < 1) ? true : false;
  }),

  ///////////////////
  //! Ember Events //
  ///////////////////

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

    that.$('.markdown-editor-textarea').on('blur', Ember.$.proxy(that.handleTextareaBlur, that));
  },

  /*
   * Unbinds all events.
   */
  willDestroyElement: function() {
    var that = this;

    that.$('.markdown-editor-textarea').off('blur');

//    that.$('.markdown-editor-toolbar .btn').tooltip('destroy');
  },

  ///////////////////////
  //! Custom Functions //
  ///////////////////////

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

  //////////////
  //! Actions //
  //////////////

  actions: {
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

      if(!this.get('selection') && requireSelection){
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
        Ember.run.next(that, function() {
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

      that.set('undoHistory', Ember.A());
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
        undoHistory: Ember.A(undoHistory),
        value: restoreValue
      });
    },
  }
});
