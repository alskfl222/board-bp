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
          plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
          hideModeSwitch={true}
          usageStatistics={false}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default TuiEditor;
