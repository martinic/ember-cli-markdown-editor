import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { next } from '@ember/runloop';
import { A } from '@ember/array';

export default class MarkdownEditorComponent extends Component {
  @service intl;
  ////////////////
  //! Variables //
  ////////////////

  /*
   * The value
   */
  get value(){
    return this.args.value;
  }

  /*
   * Holds the previous value of the textarea while editing.
   */
  @tracked previousValue = "";

  /*
   * Undo history array that holds previous values while editing content.
   */
  @tracked undoHistory = A();

  @tracked modal = false;
  @tracked result = '';
  @tracked dialog = '';
  @tracked regex = '';
  @tracked enter = '';
  @tracked promptText = '';
  @tracked tooltip = '';
  @tracked lastchar = '';
  @tracked selection = '';
  @tracked endPos = '';
  @tracked startPos = '';

  /*
   * Builds toolbar out of the supplied string of buttons.
   */
  get toolbarBtns() {
    let defaultBtns = 'heading,bold,italic,quote,link,image,table,hr,list-ol,list-ul,undo,help';
    let btns = [];
    if(this.args.btns){ 
      btns = this.args.btns.split(',')
    } else {
      btns = defaultBtns.split(',')
    }
    var that = this;
    var toolbarBtns = [];
    var btnGroups = [];
    var formattingOpts = that._formattingOpts;

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
  }

  /*
   * Default formats supplied with the component.
   */
  _formattingOpts = {
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
  }

  //////////////////////////
  //! Computed Properties //
  //////////////////////////

  /*
   * Return tabindex='-1' if modal is true
   */
  get modalTabindex() {
    if (this.modal) {
      return '-1';
    }
    return this.tabindex ;
  }

  /*
   * Generated textarea ID for the instance.
   
  get textareaId() {
    let textComponents = document.getElementsByClassName('markdown-editor');
    let newId = '0'
    if(textComponents.length > 0){
      newId = textComponents.length + 1;
    }
    return 'markdowneditor'+newId;
  }*/

  /*
   * Flag that tells if there are undo steps that can be performed.
   */
  get noUndo() {
    if(this.undoHistory.length < 1){
      return true;
    }
    return false;
  }

  ///////////////////
  //! Ember Events //
  ///////////////////

  /*
   * Set locale to `en-us` if it is not set by the application
   */
  constructor() {
    super(...arguments);
    if(!this.intl.locale) {
      this.intl.setLocale('en-us');
    }
    
    /* Generate textarea ID for the instance. */
    let textComponents = document.getElementsByClassName('markdown-editor');
    let newId = textComponents.length + 1;
    this.textareaId = 'markdowneditor'+newId;
    
    this.previousValue = "";
    this.undoHistory = A();
    this.modal = false;
    this.result = '';
    this.dialog = '';
    this.regex = '';
    this.enter = '';
    this.promptText = '';
    this.tooltip = '';
    this.lastchar = '';
    this.selection = '';
    this.endPos = '';
    this.startPos = '';
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.previousValue = "";
    this.undoHistory = A();
    this.modal = false;
    this.result = '';
    this.dialog = '';
    this.regex = '';
    this.enter = '';
    this.promptText = '';
    this.tooltip = '';
    this.lastchar = '';
    this.selection = '';
    this.endPos = '';
    this.startPos = '';
  }
  
  /*
   * Binds all the events to the textarea.
   */
  @action eventBinder() {
    var that = this;

    that.startPos = 0;
    that.endPos = 0;
    that.selection = '';
    that.lastchar = '\n';
    that.previousValue = that.value;

    that.clearUndo();
  }

  //////////////
  //! Actions //
  //////////////
  
  /*
   * Gets the selection from the textarea on blur.
   * This enables the buttons to perform actions on the selection.
   */
  @action handleTextareaBlur(){
    let that = this;
    let textComponent = document.getElementById(that.textareaId);
    let selection = '';
    let startPos =''; 
    let endPos = '';
    let lastchar = '\n';

    startPos = textComponent.selectionStart;
    endPos = textComponent.selectionEnd;
    selection = textComponent.value.substring(startPos, endPos);

    if (startPos) {
      lastchar = textComponent.value.substring(startPos - 1, startPos);
    }

    that.startPos = startPos;
    that.endPos = endPos;
    that.selection = selection;
    that.lastchar = lastchar;
  }
  
  /*
   * Applies the style to text based on the regex sent.
   * @param regex The supplied regular expression that handles the replacement.
   * @param promptText Supplied text for a standard prompt dialog.
   */
  @action applyStyle(regex, requireSelection = false, promptText = null, tooltip = null ,enter){
    this.regex = regex;
    this.enter = enter;
    this.promptText = promptText;
    this.tooltip = tooltip;

    if(!this.selection && requireSelection){
      this.modal = true;
      this.dialog = true;
    } else if (promptText){
      this.modal = true;
      this.dialog = false;
    } else {
      this.modal = false;
      this.setValue(regex, enter);
    }
  }

  @action confirm(result) {
    let that = this;
    let regex = that.regex;
    let enter = that.enter;
    
    regex = regex.replace('{{result}}', result);
    this.setValue(regex, enter);
    this.modal = '';
    this.result = '';    
  }

  @action cancel() {
    this.modal = '';
    this.result = '';
  }

  @action setValue(regex, enter) {
    if(this.args.onChange){
      let that = this;
      let value = that.value;
      let lastchar =  that.lastchar;
      let selection = that.selection;
      let extraEnter = '';

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

      that.addUndoStep(value);

      let newStr = selection.replace(/^(.*)$/gm, regex);
      let newValue = value.substr(0, that.startPos) + extraEnter + newStr + value.substr(that.endPos, value.length);
      let newCursorPos = that.startPos + extraEnter.length + newStr.length;
      let strOffset = extraEnter.length + newStr.length - that.selection.length;

      that.selection = '';
      this.args.onChange(newValue);
      that.newCursorPos = newCursorPos;

      that.setCursor(that.endPos + strOffset);
    }
  }

  /*
   * Sets the cursor location in the texterea.
   * @param pos The desired cursor possition.
   */
  @action setCursor(pos) {
    let that = this;
    let ctrl = document.getElementById(that.textareaId);

    if(ctrl.setSelectionRange) {
      ctrl.focus();
      next(that, function() {
        ctrl.setSelectionRange(pos, pos);
      });
    } else if(ctrl.createTextRange) {
      let range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  /*
   * Adds a step to the undo array.
   * @param value The value that is to be saved as an undo step.
   */
  @action addUndoStep(value) {
    let that = this;
    let undoHistory = that.undoHistory;

    undoHistory.pushObject(value);

    that.undoHistory = undoHistory;
  }

  /*
   * Clears out the undo array.
   */
  @action clearUndo() {
    let that = this;
    that.undoHistory = A();
  }

  /*
   * Reverts the value to a previous value based on the undo array.
   */
  @action undo() {
    if(this.args.onChange){
      let that = this;
      let undoHistory = that.undoHistory.toArray();

      if(undoHistory.length === 0){
        alert('No more steps to undo.');
        return false;
      }

      var restoreValue = undoHistory.pop();

      that.undoHistory = A(undoHistory);
      // that.updateValue();
      this.args.onChange(restoreValue);
    }
  }
  
  @action onChange(value){
    if(this.args.onChange){
      let newValue = this.args.value;
        this.args.onChange(newValue);
    }
  }
}