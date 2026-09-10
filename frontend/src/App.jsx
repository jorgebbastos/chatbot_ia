import { useEffect, useRef, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const suggestions = [
  'Explique inteligência artificial de forma simples',
  'Me ajude a organizar minha rotina de estudos',
  'Crie uma ideia criativa para um projeto web',
]

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Olá! Eu sou o Clareza. Como posso ajudar você hoje?',
  },
]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const endOfMessages = useRef(null)

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage(event, messageOverride) {
    event?.preventDefault()
    const message = (messageOverride ?? input).trim()
    if (!message || isLoading) return

    setInput('')
    setError('')
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', content: message },
    ])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || 'Não foi possível concluir a mensagem.')
      }

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
      ])
    } catch (requestError) {
      setError(requestError.message || 'Verifique se o backend está em execução.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Clareza início">
          <span className="brand-mark">C</span>
          <span>clareza</span>
        </a>
        <div className="status-pill">
          <span className="status-dot" />
          <span>IA online</span>
        </div>
      </header>

      <section className="workspace" aria-label="Chatbot Clareza">
        <div className="intro">
          <p className="eyebrow">ASSISTENTE INTELIGENTE</p>
          <h1>Ideias mais claras,<br /><em>um papo de cada vez.</em></h1>
          <p className="intro-copy">Pergunte, explore e transforme curiosidade em próximos passos.</p>
        </div>

        <section className="chat-panel" aria-label="Conversa">
          <div className="chat-header">
            <div className="avatar">C</div>
            <div>
              <h2>Clareza</h2>
              <p>Seu assistente para pensar melhor</p>
            </div>
            <span className="secure-label">API segura</span>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message) => (
              <article className={`message-row ${message.role}`} key={message.id}>
                {message.role === 'assistant' && <div className="mini-avatar">C</div>}
                <div className="message-bubble">{message.content}</div>
              </article>
            ))}
            {isLoading && (
              <article className="message-row assistant">
                <div className="mini-avatar">C</div>
                <div className="message-bubble typing" aria-label="Clareza está digitando">
                  <span /><span /><span />
                </div>
              </article>
            )}
            <div ref={endOfMessages} />
          </div>

          {messages.length === 1 && (
            <div className="suggestions" aria-label="Sugestões de perguntas">
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => sendMessage(null, suggestion)}>
                  {suggestion}<span>↗</span>
                </button>
              ))}
            </div>
          )}

          <div className="composer-wrap">
            {error && <p className="error-message" role="alert">{error}</p>}
            <form className="composer" onSubmit={sendMessage}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escreva sua pergunta..."
                aria-label="Sua mensagem"
                maxLength={4000}
                disabled={isLoading}
              />
              <button className="send-button" type="submit" aria-label="Enviar mensagem" disabled={!input.trim() || isLoading}>
                <span>Enviar</span><strong>↑</strong>
              </button>
            </form>
            <p className="composer-note">O Clareza pode cometer erros. Confira informações importantes.</p>
          </div>
        </section>
      </section>

      <footer className="footer">
        <span>PROJETO TESTE · CHATBOT COM IA</span>
        <span>Desenvolvido com React + FastAPI</span>
      </footer>
    </main>
  )
}

export default App

