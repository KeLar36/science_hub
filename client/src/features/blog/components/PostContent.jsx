export default function PostContent({ content }) {
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto w-full text-left mt-8">
      <div className="w-full p-5 md:p-8 rounded-2xl bg-bg-primary/20 border border-border-color/40 overflow-hidden break-words">
        <div
          className="
            prose prose-sm md:prose-base dark:prose-invert 
            max-w-none 
            text-text-primary 
            leading-relaxed 
            tracking-normal
            font-sans
            
            /* Захист від вилізання коду та таблиць — дозволяємо їм горизонтальний скрол всередині */
            prose-pre:overflow-x-auto prose-pre:max-w-full
            prose-table:overflow-x-auto prose-table:block prose-table:max-w-full
            
            /* Кастомізація внутрішніх тегів, які прийдуть з Quill */
            prose-headings:font-bold 
            prose-headings:text-text-primary 
            prose-headings:tracking-tight
            prose-p:text-text-secondary
            prose-a:text-brand hover:prose-a:text-brand/80
            prose-strong:text-text-primary
            prose-code:text-brand prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-img:rounded-xl prose-img:border prose-img:border-border-color
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
