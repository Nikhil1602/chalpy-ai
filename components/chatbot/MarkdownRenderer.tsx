import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownRenderer({ content, className = "" }: { content: string, className?: string }) {

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => (
                    <p className={cn(`text-sm leading-relaxed whitespace-pre-wrap`, className)}>
                        {children}
                    </p>
                ),
                strong: ({ children }) => (
                    <strong className={cn(`font-semibold text-sm`, className)}>
                        {children}
                    </strong>
                ),
                ul: ({ children }) => (
                    <ul className={cn("list-disc pl-5 space-y-1 text-sm", className)}>
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className={cn("list-decimal pl-5 space-y-1 text-sm", className)}>
                        {children}
                    </ol>
                ),
                code: ({ children }) => (
                    <code className={cn("bg-gray-700 p-1 py-0.5 rounded text-sm", className)}>
                        {children}
                    </code>
                ),
                pre: ({ children }) => (
                    <pre className={cn("bg-gray-700 p-1 my-1 rounded text-sm", className)}>
                        {children}
                    </pre>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );

}