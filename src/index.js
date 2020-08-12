/**
 * Webpack入口文件
 */
import './index.scss';
import './icon/iconfont.css';

// import '@babel/polyfill';
// import $ from 'jqeury'

const fancyFunc = () => [1, 2];

fancyFunc();

function addFunc(c, d) {
  return c + d;
}

addFunc(2, 3);

const promiseObj = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(777);
  }, 2000);
});

promiseObj().then((res) => {
  document.getElementsByClassName('text-content')[0].innerText = res;
});
