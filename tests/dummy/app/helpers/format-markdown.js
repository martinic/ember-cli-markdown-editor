import { htmlSafe } from '@ember/template';
import { helper as buildHelper } from '@ember/component/helper';
import marked from 'marked';

export default buildHelper(function(params) {
  let value = params[0];
  return htmlSafe(marked(value));
});
