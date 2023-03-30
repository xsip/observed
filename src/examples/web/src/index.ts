import { WatchThis } from './observed';
import './index.html';
import './element-cache';
import { elementCache } from './element-cache';
import { getObservedElement } from './get-observed-element';
// TODO: find way to reuse but dont reuse onChange!
window.onload = () => {
  const one = document.getElementById('one');
  const cls = getObservedElement(
    '#one',
    function (changes: keyof HTMLElement[]) {
      console.log('changes ', changes);
    },
    function (read: keyof HTMLElement[]) {
      console.log('read ', read);
    }
  );
  /*const cls2 = getObservedElement('#one');
  console.log(cls.id);
  console.log('OK: ', cls.getAttribute('id'));
  cls.setAttribute('test', '1337');*/
  cls.setAttribute('test', '1337');
};
