export function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details key={item.question} className="surface p-5">
          <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 dark:text-white">
            {item.question}
          </summary>
          <p className="mt-3 text-sm leading-7">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
