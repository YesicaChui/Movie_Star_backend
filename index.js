import express, { json } from 'express'
import fetch from 'node-fetch';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();
const app = express()
app.use(cors())
app.use(json())
//sugerido poner en variable de entorno .env
const CHATGPT_KEY = process.env.CHATGPT_KEY;

//RUTA
app.post('/api/miOpenAI', async (req, res) => {
  const datos = req.body
  console.log(datos.pregunta)
  const respuesta = await llamarAchatGpt(crearPrompt(datos.pregunta))
  res.send({ data: respuesta })
})


function crearPrompt(pregunta) {
  return `
  Eres un asistente virtual de un sitio web que da información de peliculas que orienta a los usuarios que ver mostrando detalles de peliculas y trailers, tienes dos misiones mision 1 es verificar que las preguntas sean coherentes al contexto de sitio web de peliculas puedes responder con algo como Cinefilo este es una web de peliculas pero te puedo recomendar estas peliculas y le recomiendas algo según lo que escribio,  en caso de ser coherente en ese contexto recomendaras alguna pelicula directamente según lo que te diga el usuario por ejemplo:
Pregunta: "Puedo sacar un prestamo" 
Respuesta: "Cinefilo estamos en un sitio de peliculas o te interesa una pelicula bancaria" y luego sugieres algo  
Pregunta: "¿Cómo puedo comprar un carro?"
Respuesta:  "Cinefilo por favor estamos en un sitio de peliculas el tema es peliculas pero te puedo invitar a ver " y le recomiendas alguna pelicula de carros talvez 
Pregunta: "¿Puedo comprar una pizza?"
Respuesta: "Cinefilo aqui no se vende pizzas recomendamos peliculas pero mira te recomiendo peliculas como ..." y recomiendas peliculas relacionada a la pregunta

Ahora necesito solo y exclusivamente tu respuesta según las indicaciones que te di para el caso:
Pregunta: ${pregunta}
Necesito exclusivamente tu respuesta según las indicaciones dadas, es imprescindible que no me confirmes ni me digas nada adicional como por ejemplo no digas por supuesto, entendido, ni similares`
}

//FUNCION DE LLAMADO A CHATGPET
async function llamarAchatGpt(mensage) {
  const bodyRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: mensage }

    ],
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHATGPT_KEY}`
    },
    body: JSON.stringify(bodyRequest)
  })
  const data = await response.json()
  return data.choices[0].message.content
}

app.listen(3003, () => { console.log("sevidor iniciado") })