import {
  useState,
  useRef,
  createContext,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import {
  EmoticonItem,
  useEmoticon,
  EmoticonHook,
  EmoticonContext,
} from './Emoticon';
import { getFetchUrl, exceptionHandler } from '@util';

export interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  author: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  emoticons: EmoticonItem[];
  comments: Comment[];
}

export interface CommentHook extends Omit<Comment, 'content'>, EmoticonHook {
  prevContent: string;
  content: MutableRefObject<string>;
  mutate: KeyedMutator<any>;
  mode: 'read' | 'modify' | 'recomment';
  setMode: Dispatch<SetStateAction<'read' | 'modify' | 'recomment'>>;
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isEmoticonsExpanded: boolean;
  setIsEmoticonsExpanded: Dispatch<SetStateAction<boolean>>;
  isRecommentExpanded: boolean;
  setIsRecommentExpanded: Dispatch<SetStateAction<boolean>>;
  pathname: string;
  onSubmitModify: () => void;
  onClickCancel: () => void;
}

const useComment = (
  initialValue: Comment & { mutate: KeyedMutator<any> } & EmoticonHook
): CommentHook => {
  const {
    id,
    postId,
    parentId,
    author,
    authorId,
    content: prevContent,
    createdAt,
    updatedAt,
    emoticons,
    comments,
    mutate,
    selected,
    isExist,
    setUp,
    add,
    remove,
    cleanUp,
  } = initialValue;
  const pathname = usePathname();
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [inputText, setInputText] = useState(prevContent);
  const [isEmoticonsExpanded, setIsEmoticonsExpanded] = useState(false);
  const [isRecommentExpanded, setIsRecommentExpanded] = useState(false);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const isValidModifyContent = (): boolean => {
    if (content.current !== inputText) return true;
    if (emoticons.length !== selected.length) return true;
    for (let i = 0; i < emoticons.length; i++) {
      if (emoticons[i].id !== selected[i].id) return true;
    }
    return false;
  };

  const onSubmitModify = async () => {
    if (!isValidModifyContent()) {
      setMode('read');
      return;
    }
    try {
      const res = await axios.put(fetchUrl, {
        id,
        content: inputText,
        emoticons: selected,
      });
      content.current = res.data.content;
      setInputText(res.data.content);
      setMode('read');
      await mutate();
    } catch (err) {
      exceptionHandler(err);
    }
  };

  const onClickCancel = () => {
    setInputText(content.current);
    setMode('read');
  };

  return {
    id,
    postId,
    parentId,
    author,
    authorId,
    prevContent,
    content,
    createdAt,
    updatedAt,
    emoticons,
    comments,
    mutate,
    selected,
    isExist,
    setUp,
    add,
    remove,
    cleanUp,
    mode,
    setMode,
    inputText,
    setInputText,
    isEmoticonsExpanded,
    setIsEmoticonsExpanded,
    isRecommentExpanded,
    setIsRecommentExpanded,
    pathname,
    onSubmitModify,
    onClickCancel,
  };
};

export const CommentContext = createContext<CommentHook>({
  id: -1,
  postId: -1,
  parentId: -1,
  author: '',
  authorId: -1,
  prevContent: '',
  content: { current: '' },
  createdAt: '',
  updatedAt: '',
  emoticons: [],
  comments: [],
  mutate: async () => {},
  selected: [],
  isExist: (item: EmoticonItem) => true,
  setUp: (items: EmoticonItem[]) => {},
  add: (item: EmoticonItem) => {},
  remove: (item: EmoticonItem) => {},
  cleanUp: () => {},
  mode: 'read',
  setMode: () => {},
  inputText: '',
  setInputText: () => {},
  isEmoticonsExpanded: false,
  setIsEmoticonsExpanded: () => {},
  isRecommentExpanded: false,
  setIsRecommentExpanded: () => {},
  pathname: '',
  onSubmitModify: () => {},
  onClickCancel: () => {},
});

export function CommentProvider({ children, initialValue }: any) {
  const emoticonValue = useEmoticon();
  const commentValue = useComment({ ...initialValue, ...emoticonValue });
  return (
    <CommentContext.Provider value={commentValue}>
      <EmoticonContext.Provider value={emoticonValue}>
        {children}
      </EmoticonContext.Provider>
    </CommentContext.Provider>
  );
}
