import { Editor } from '@toast-ui/react-editor';
import { EventMapping } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'prismjs/themes/prism.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import Prism from 'prismjs';

interface Props extends Partial<EventMapping> {
  content?: string;
  editorRef: React.MutableRefObject<any>;
}

const TuiEditor = ({
  content = '내용을 입력해주세요.',
  editorRef,
  onChange,
}: Props) => {
  const toolbarItems = [
    ['heading', 'bold', 'italic'],
    ['hr'],
    ['ul', 'ol', 'task'],
    ['table', 'link'],
    ['image'],
    ['code'],
  ];

  const getYoutubeId = (url: string) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
    const queryId = urlObj.searchParams.get('v');
    if (queryId) return queryId;
    return null;
  };

  const youtubeToolbarIcon = () => {
    const container = document.createElement('div');
    container.className = 'youtube-div';

    const youtubeInput = document.createElement('input');
    youtubeInput.id = 'youtube-input';
    youtubeInput.placeholder = '유튜브 링크';

    const youtubeButton = document.createElement('buton');
    youtubeButton.className = 'youtube-button';
    youtubeButton.textContent = '확인';

    container.appendChild(youtubeInput);
    container.appendChild(youtubeButton);

    youtubeButton.onclick = () => {
      const value = youtubeInput.value;

      if (!value) return;
      if (!(value.includes('youtu.be') || value.includes('youtube.com'))) {
        alert('유튜브 링크 확인');
        youtubeInput.value = '';
        return;
      }

      const youtubeId = getYoutubeId(value);
      if (!youtubeId) {
        alert('유튜브 ID 확인');
        youtubeInput.value = '';
        return;
      }
      const existHTML = editorRef.current.getInstance().getHTML();
      editorRef.current
        .getInstance()
        .setHTML(
          existHTML +
            `<img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg" contenteditable="false" />`
        );
      youtubeInput.value = '';
    };

    const toolbar = {
      toolbarItems: [
        {
          groupIndex: 3,
          itemIndex: 3,
          item: {
            name: 'youtube',
            tooltip: 'youtube',
            className: 'toastui-editor-toolbar-icons',
            style: {
              backgroundImage: 'url(/youtube.png)',
              backgroundSize: '25px',
              backgroundPosition: 'center center',
            },
            popup: {
              className: 'popup-wrapper',
              body: container, //위에서 만든 container 적용
              // style: {}
            },
          },
        },
      ],
    };
    return toolbar;
  };

  return (
    <div className='w-full'>
      {editorRef && (
        <Editor
          ref={editorRef}
          theme='dark'
          language='ko-KR'
          initialValue={content}
          initialEditType='wysiwyg' // wysiwyg & markdown
          previewStyle='tab' // tab, vertical
          height='600px'
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          plugins={[
            colorSyntax,
            [codeSyntaxHighlight, { highlighter: Prism }],
            youtubeToolbarIcon,
          ]}
          // hideModeSwitch={true}
          usageStatistics={false}
          onChange={onChange}
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
      )}
    </div>
  );
};

export default TuiEditor;
