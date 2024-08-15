import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {Authenticator} from '@aws-amplify/ui-react'
import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda'
import {fetchAuthSession} from 'aws-amplify/auth'

import outputs from "../amplify_outputs.json"

function App() {
  const [text, setText] = useState('')

  async function invokeHelloWorld() {

    const {credentials} = await fetchAuthSession()
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.helloWorldFunctionName
    const labmda = new LambdaClient({credentials: credentials, region: awsRegion})
    const command = new InvokeCommand({
      FunctionName: functionName,
    });
    const apiResponse = await labmda.send(command);

    if (apiResponse.Payload) {
      const payload = JSON.parse(new TextDecoder().decode(apiResponse.Payload))
      setText(payload.message)
    }
  }

  return (
      <Authenticator>
        {({signOut, user}) => (
            <>
              <div>
                <a href="https://docs.amplify.aws" target="_blank">
                  <img src="https://docs.amplify.aws/assets/icon/favicon-purple-96x96.png" className="logo amplify"
                       alt="Amplify logo"/>
                </a>
                <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
              </div>
              <h1>Amplify + Vite + React</h1>
              <p>
                Hello, {user?.signInDetails?.loginId}
                <br/>
                <button onClick={signOut}>Sign Out</button>
              </p>
              <p>
                <button onClick={invokeHelloWorld}>invokeHelloWorld</button>
                <div>{text}</div>
              </p>
            </>
        )}
      </Authenticator>
  )
}

export default App
