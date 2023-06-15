import { Viewer } from '@toast-ui/react-editor';

export default function TuiViewer({ content = '' }: { content: string }) {
  return (
    <div className='p-2 border border-cyan-300 text-white'>
      <Viewer
        initialValue={content}
        customHTMLRenderer={{
          htmlBlock: {
            iframe(node) {
              return [
                {
                  type: 'openTag',
                  tagName: 'iframe',
                  outerNewLine: true,
                  attributes: node.attrs,
                },
                { type: 'html', content: node.childrenHTML ?? '' },
                { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
              ];
            },
            div(node) {
              return [
                {
                  type: 'openTag',
                  tagName: 'div',
                  outerNewLine: true,
                  attributes: node.attrs,
                },
                { type: 'html', content: node.childrenHTML ?? '' },
                { type: 'closeTag', tagName: 'div', outerNewLine: true },
              ];
            },
          },
        }}
      />
    </div>
  );
}
