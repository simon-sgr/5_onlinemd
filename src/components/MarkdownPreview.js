import React, { useState, useEffect } from 'react';

const MarkdownPreview = ({ markdown }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('http://localhost:3002/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: markdown
    }).then(response => {
      response.text().then(text => {
        setHtml(text);
      })
    }).catch(error => console.log(error));
  }, [markdown]);

  return (
    <div className='markdown-preview' dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default MarkdownPreview;