import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownRenderer({ content }: { content: string }) {

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {children}
                    </p>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                        {children}
                    </strong>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                        {children}
                    </ol>
                ),
                code: ({ children }) => (
                    <code className="bg-gray-700 p-1 py-0.5 rounded text-xs">
                        {children}
                    </code>
                ),
                pre: ({ children }) => (
                    <pre className="bg-gray-700 p-1 my-1 rounded text-xs">
                        {children}
                    </pre>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );

}