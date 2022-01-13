import MarkdownIt from 'markdown-it';
import 'github-markdown-css/github-markdown-light.css';

const md = new MarkdownIt({
  linkify: true,
});

export const renderText = (text: string): string => md.render(text);
