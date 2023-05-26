import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

interface Props {
  content?: string;
  viewerRef: React.MutableRefObject<any>;
}

const TuiViewer = ({ content = '기본내용', viewerRef }: Props) => {
  console.log(content);
  return (
    <div className='w-full'>
      {viewerRef && (
        <Viewer
          ref={viewerRef}
          theme='dark'
          initialValue={content}
          customHTMLRenderer={{
            htmlBlock: {
              iframe(node: any) {
                return [
                  {
                    type: 'openTag',
                    tagName: 'iframe',
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: 'html', content: node.childrenHTML },
                  {
                    type: 'closeTag',
                    tagName: 'iframe',
                    outerNewLine: false,
                  },
                ];
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default TuiViewer;
