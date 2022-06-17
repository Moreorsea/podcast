export class Question {
  static create(question) {
    return fetch('https://podcast-app-12c27-default-rtdb.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(response => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage();

    const html = questions.length
        ? questions.map(toCard).join('')
        : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`

    const list = document.querySelector('#list');
    list.innerHTML = html;
  }

  static fetch(token) {
    if(!token) {
      return Promise.resolve('<p class="error">У вас нет токена</p>')
    }
    return fetch(`https://podcast-app-12c27-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(questions => {
        if(questions && questions.error) {
          return `<p class="error">${response.error}</p>`
        }

        return questions ? Object.keys(questions).map(key => ({
          ...questions[key],
          id: key
        })) : []
      })
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>Вопросов пока нет</p>'
  }
}

function addToLocalStorage(question) {
  const questionsList = getQuestionsFromLocalStorage();

  questionsList.push(question);
  localStorage.setItem('questions', JSON.stringify(questionsList));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">${new Date(question.date).toLocaleDateString()}</div>
    <div class="mui--text-black-54">${new Date(question.date).toLocaleTimeString()}</div>
    <div>${question.text}</div>
    <br>
  `
}
