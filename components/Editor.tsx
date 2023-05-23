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

const createContainerEl = () => {
  const container = document.createElement('div');
  container.style.margin = '6px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  const ytText = document.createElement('span');
  ytText.textContent = '유튜브 영상 주소';

  const ytInput = document.createElement('input');
  ytInput.placeholder = '유튜브 링크';
  ytInput.style.marginTop = '.5rem';
  ytInput.style.height = '1.5rem';
  ytInput.style.padding = '0 .5rem';
  ytInput.style.color = '#333';

  const ytButton = document.createElement('button');
  ytButton.textContent = '확인';
  ytButton.style.marginTop = '1.5rem';
  ytButton.style.width = '6rem';
  ytButton.style.border = '1px solid white';
  ytButton.style.color = '#aaa';
  ytButton.addEventListener('mouseover', () => {
    ytButton.style.backgroundColor = '#aaa';
    ytButton.style.color = '#333';
  });
  ytButton.addEventListener('mouseout', () => {
    ytButton.style.backgroundColor = 'transparent';
    ytButton.style.color = '#aaa';
  });

  container.appendChild(ytText);
  container.appendChild(ytInput);
  container.appendChild(ytButton);

  return { container, ytInput, ytButton };
};

const TuiEditor = ({
  content = '내용을 입력해주세요.',
  editorRef,
}: Props) => {
  const toolbarItems = [
    ['heading', 'bold', 'italic'],
    ['hr'],
    ['ul', 'ol', 'task'],
    ['table', 'link'],
    ['image'],
  ];

  const getYoutubeId = (url: string) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
    const queryId = urlObj.searchParams.get('v');
    if (queryId) return queryId;
    return null;
  };

  const youtubeToolbarIcon = () => {
    const { container, ytInput, ytButton } = createContainerEl();

    ytButton.onclick = () => {
      const value = ytInput.value;

      if (!value) return;
      if (!(value.includes('youtu.be') || value.includes('youtube.com'))) {
        alert('유튜브 링크 확인');
        ytInput.value = '';
        return;
      }

      const youtubeId = getYoutubeId(value);
      if (!youtubeId) {
        alert('유튜브 ID 확인');
        ytInput.value = '';
        return;
      }
      const existHTML = editorRef.current.getInstance().getHTML();
      editorRef.current
        .getInstance()
        .setHTML(
          existHTML +
            `<p><br></p><img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg" contenteditable="false" />`
        );
      ytInput.value = '';
    };

    const toolbar = {
      toolbarItems: [
        {
          groupIndex: 3,
          itemIndex: 3,
          item: {
            name: 'youtube',
            tooltip: '유튜브',
            className: 'toastui-editor-toolbar-icons',
            style: {
              backgroundImage: 'url(/youtube.png)',
              backgroundSize: '25px',
              backgroundPosition: 'center center',
            },
            popup: {
              className: 'popup-wrapper',
              body: container,
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
          hideModeSwitch={true}
          usageStatistics={false}
          customHTMLRenderer={{
            htmlBlock: {
              // iframe(node) {
              //   return [
              //     {
              //       type: 'openTag',
              //       tagName: 'iframe',
              //       outerNewLine: true,
              //       attributes: node.attrs,
              //     },
              //     { type: 'html', content: node.childrenHTML ?? '' },
              //     { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
              //   ];
              // },
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
