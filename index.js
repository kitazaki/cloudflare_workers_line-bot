
const url = "https://api.line.me/v2/bot/message/reply"

function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  return new Response(html, init)
}

async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const data = await request.json()

    if (data.events[0]) {
      const body = {
        replyToken: data.events[0].replyToken,
        messages: [
          {
             type: "text",
             text: data.events[0].message.text
          }
        ]
      }
      const init = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          Authorization: "Bearer "+ACCESS_TOKEN,
          "content-type": "application/json"
          }
      }
      const res = await fetch(url, init)
      
      return JSON.stringify(data)
    }
    else {
      return JSON.stringify(data)
    }
  }
  else if (contentType.includes("application/text")) {
    return await request.text()
  }
  else if (contentType.includes("text/html")) {
    return await request.text()
  }
  else if (contentType.includes("form")) {
    const formData = await request.formData()
    const text = await formData.entries()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return JSON.stringify(body)
  }
  else {
    const myBlob = await request.blob()
    const objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}

async function handleRequest(request) {
  const reqBody = await readRequestBody(request)
  const retBody = `The request body sent in was ${reqBody}`
  //console.log(reqBody)
  return new Response(retBody)
}

addEventListener("fetch", event => {
  const { request } = event
  const { url } = request

  //console.log(JSON.stringify(request))

  if (request.method === "POST") {
    return event.respondWith(handleRequest(request))
  }
  else if (request.method === "GET") {
    return event.respondWith(new Response(`The request was a GET`))
  }
})

