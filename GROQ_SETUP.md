# 🚀 Configuração da API Groq - Interactive Avatar Challenge

## 📋 Passos para Configurar a API

### 1. Criar arquivo `.env.local`
Na raiz do projeto (`/home/marianapereira/Documents/interactive-avatar/`), crie um arquivo `.env.local` com:

```bash
NEXT_PUBLIC_GROQ_API_KEY=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
```

### 2. Verificar Configuração
A aplicação já está configurada para usar a API key. Você pode verificar o status na interface:
- ✅ Verde: API configurada corretamente
- ❌ Vermelho: Precisa configurar a API key

### 3. Testar a Integração

#### Avatar 1 - Voz 🎤
- Clique em "🎤 Falar com Maria"
- Permita acesso ao microfone
- Fale sua mensagem
- Maria responderá por voz e mudará a emoção

#### Avatar 2 - Texto 💬
- Digite sua mensagem no campo de texto
- Clique em "📤 Enviar" ou pressione Enter
- Maria responderá por texto e mudará a emoção

#### Avatar 3 - Acessibilidade ♿
- Ative/desative modo de acessibilidade
- Controle alto contraste
- Ajuste tamanho da fonte
- Teste screen reader
- Botões de emoção para teste

## 🎯 Funcionalidades Implementadas

### Sistema de Detecção de Emoção
A Maria muda automaticamente de emoção baseada na resposta do ChatGPT:

- **Happy** 😊: Palavras positivas (feliz, ótimo, excelente, etc.)
- **Sad** 😢: Palavras negativas (triste, problema, erro, etc.)
- **Surprised** 😲: Palavras de surpresa (uau, incrível, surpresa, etc.)
- **Closed Eyes** 😴: Palavras de sono (sono, cansado, dormir, etc.)

### Prompts Personalizados
Cada avatar tem um prompt específico:

- **Voz**: Respostas curtas e conversacionais
- **Texto**: Respostas detalhadas e informativas
- **Acessibilidade**: Foco em inclusão e acessibilidade

## 🔧 Tecnologias Utilizadas

- **Groq API**: Modelo `llama-3.3-70b-versatile`
- **OpenAI SDK**: Compatibilidade com Groq
- **Web Speech API**: Speech-to-Text
- **Speech Synthesis API**: Text-to-Speech
- **WCAG 2.1 AA**: Conformidade de acessibilidade

## 📚 Referências

- [Groq Quickstart Guide](https://console.groq.com/docs/quickstart)
- [Groq API Documentation](https://console.groq.com/docs/overview)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🚀 Próximos Passos

1. Configure a API key no `.env.local`
2. Teste os 3 avatares
3. Experimente diferentes tipos de mensagens
4. Teste as funcionalidades de acessibilidade

---

**Desenvolvido para um Challenge de Frontend para criar um Interactive Avatar** 🎭
