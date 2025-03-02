import SyntaxHighlighter from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const CodeBlock = ({ value }: any) => {
  return (
    <div className="my-10">
      <SyntaxHighlighter language={value.language} style={dracula}>
        {value.code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
