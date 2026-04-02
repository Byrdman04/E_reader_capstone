function SpeechHighlight({ content, highlightIndex, fontSize }) {
  const { start, length } = highlightIndex;

  const renderLines = (text) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <div className="document-text" style={{ fontSize: `${fontSize}px` }}>
      {start === -1 ? (
        // No highlight — normal render
        content.split('\n').map((line, i) => (
          <p key={i} className="document-line">{line}</p>
        ))
      ) : (
        // Active highlight — split around current word
        <>
          {renderLines(content.slice(0, start))}
          <mark style={{ backgroundColor: '#f5c542', borderRadius: '3px', padding: '0 2px' }}>
            {content.slice(start, start + length)}
          </mark>
          {renderLines(content.slice(start + length))}
        </>
      )}
    </div>
  );
}

export default SpeechHighlight;