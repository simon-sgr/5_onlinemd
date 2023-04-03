import React, { useState } from 'react';
import MarkdownPreview from './MarkdownPreview';

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState('');

  const handleChange = (e) => {
    setMarkdownText(e.target.value);
  }

  return (
    <div className="markdown-display">
      <textarea
        className="markdown-textarea"
        onChange={handleChange}
        value={markdownText}
      />
      <MarkdownPreview markdown={markdownText} />
    </div>
  );
}

export default MarkdownEditor;