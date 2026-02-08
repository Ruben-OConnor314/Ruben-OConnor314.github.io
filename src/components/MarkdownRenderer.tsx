import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert max-w-none text-gray-300
      prose-ul:list-disc prose-ol:list-decimal
      prose-li:ml-5 prose-ul:pl-5 prose-ol:pl-5
      prose-h1:text-3xl prose-h1:font-bold
      prose-h2:text-2xl prose-h2:font-bold
      prose-h3:text-xl prose-h3:font-semibold
      prose-h4:text-lg prose-h4:font-semibold"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeMathjax,
            {
              tex: {
                inlineMath: [["$", "$"]],
                displayMath: [["$$", "$$"]],
              },
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
