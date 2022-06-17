import "./styles.css";
import { isValid, createModal } from './utils';
import {Question} from './question';
import { getAuthForm, authWidthEmailAndPassword } from './auth';

const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.getElementById('modal-btn');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
})
modalBtn.addEventListener('click', openModal);

function submitFormHandler(e) {
  e.preventDefault();

  if(isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    submitBtn.disabled = true;
    Question.create(question).then(() => {
      input.className = '';
      submitBtn.disabled = false;
      form.reset();
    })
    //Async request to server to save question
  }
}

function authFormHandler(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button');
  const email = e.target.querySelector('#email').value;
  const password = e.target.querySelector('#password').value;

  btn.disabled = true;
  authWidthEmailAndPassword(email, password)
    .then(token => {
      return Question.fetch(token);
    })
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
}

function openModal() {
  createModal('Авторизация', getAuthForm());
  document
    .getElementById('auth-form')
    .addEventListener('submit', authFormHandler, {once: true});
}

function renderModalAfterAuth(content) {
  if(typeof content === 'string') {
    createModal('Ошибка!', content)
  } else {
    createModal('Список вопросов', Question.listToHTML(content))
  }
}
