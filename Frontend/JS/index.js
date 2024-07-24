

// Elementos do login

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// Elementos do chat

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

// Identificação do usuário

const user = { id: "", name: "", color: "" }

// Lista de cores disponíveis para cada usuário do chat

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

let websocket


// Criando o objeto de mensagem própria do chat (balãozinho)

const createMessageSelfElement = (content) => {

    // Cria o objeto div apartir do JS, não usando mais o do HTML
    const div = document.createElement("div")

    // Cria uma classe para o objeto, interagindo e já estilizando com o CSS externo
    div.classList.add("message--self")

    // Pega o conteúdo que recebemos do input do chat e coloca dentro da div
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {

    // Cria o objeto "div" e "span" apartir do JS, não usando mais o do HTML
    const div = document.createElement("div")
    const span = document.createElement("span")

    // Cria uma classe para o objeto, interagindo e já estilizando com o CSS externo
    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor

    // Colocando o "span" dentro da "div", como se fosse no HTML

    div.appendChild(span)

    // Colocando o nome de quem enviou a mensagem dentro do span

    span.innerHTML = sender

    // Pega o conteúdo que recebemos do input do chat e coloca dentro da div, importante usar o "+=" para agregar junto ao span adicionado anteriormente
    div.innerHTML += content

    return div
}

// Gera uma cor aleatória para o usuário ser identificado

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

// Função de rolagem automática de tela

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"

    })
}

const processMessage = ({  data  }) => {

    // Converte de string para um objeto novamente
    const { userId, userName, userColor, content } = JSON.parse(data)

    // Criamos um objeto que vai mostrar o conteúdo da nossa mensagem, mas primeiro fazendo uma verificação se o "id" da mensagem é o nosso ou de um terceiro
       const message = 
            userId == user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, userName, userColor)
    // "chatMessages" recebe a "message" como filho, exibindo assim os objetos de mensagem própria ou de terceiros
    chatMessages.appendChild(message)

    // Rola a tela automaticamente para baixo
    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

    console.log(user)
}

const sendMessage = (event) => {

    // Evita que o site recarregue sozinho
    event.preventDefault()


    // Objeto "message" que identifica quem enviou a mensagem
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    // Converte o objeto "message" para string
    websocket.send(JSON.stringify(message))

    // Limpa o campo de input do chat
    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)