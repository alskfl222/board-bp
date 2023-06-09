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
import { useUserStore } from '@store/user';
import { initialComment } from '@data/comment';
import { getFetchUrl, exceptionHandler } from '@util';

type CommentMode = 'read' | 'modify' | 'recomment';

export interface Comment {
  id: number;
  postId: number;
  postAuthorId: number;
  parentId: number | null;
  author: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  emoticons: EmoticonItem[];
  sentiments: any;
  comments: Comment[];
}

export interface CommentHook extends Omit<Comment, 'content'>, EmoticonHook {
  userId: number;
  content: MutableRefObject<string>;
  mutate: KeyedMutator<any>;
  mode: CommentMode;
  setMode: Dispatch<SetStateAction<CommentMode>>;
  modeState?: [CommentMode, Dispatch<SetStateAction<CommentMode>>];
  recommentTo: string;
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isEmoticonsExpanded: boolean;
  setIsEmoticonsExpanded: Dispatch<SetStateAction<boolean>>;
  isRecommentExpanded: boolean;
  setIsRecommentExpanded: Dispatch<SetStateAction<boolean>>;
  pathname: string;
  onSubmitModify: () => void;
  onClickRecomment: (author: string) => void;
  onClickCancel: () => void;
}

const useComment = (
  initialValue: Comment &
    EmoticonHook & {
      mutate: KeyedMutator<any>;
      modeState?: [
        'read' | 'modify' | 'recomment',
        Dispatch<SetStateAction<'read' | 'modify' | 'recomment'>>
      ];
      recommentTo: string;
    }
): CommentHook => {
  const {
    id,
    postId,
    postAuthorId,
    parentId,
    author,
    authorId,
    content: prevContent,
    createdAt,
    updatedAt,
    emoticons,
    sentiments,
    comments,
    mutate,
    selected,
    isExist,
    setUp,
    add,
    remove,
    cleanUp,
    modeState,
    recommentTo: prevRecomment,
  } = initialValue;
  const pathname = usePathname();
  const content = useRef(prevContent);
  const userId = useUserStore((state) => state.userId);
  const state = useState<'read' | 'modify' | 'recomment'>('read');
  const [mode, setMode] = modeState ? modeState : state;
  const [inputText, setInputText] = useState(prevContent);
  const [recommentTo, setRecommentTo] = useState(prevRecomment);
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

  const onClickRecomment = (author: string) => {
    setMode('recomment');
    setRecommentTo(author);
  };

  const commentProps = {
    id,
    postId,
    postAuthorId,
    parentId,
    author,
    authorId,
    content,
    createdAt,
    updatedAt,
    emoticons,
    sentiments,
    comments,
  };

  const emoticonProps = {
    selected,
    isExist,
    setUp,
    add,
    remove,
    cleanUp,
  };

  const stateProps = {
    mode,
    setMode,
    recommentTo,
    inputText,
    setInputText,
    isEmoticonsExpanded,
    setIsEmoticonsExpanded,
    isRecommentExpanded,
    setIsRecommentExpanded,
  };

  const onClickProps = {
    onSubmitModify,
    onClickRecomment,
    onClickCancel,
  };

  return {
    ...commentProps,
    ...emoticonProps,
    ...stateProps,
    ...onClickProps,
    pathname,
    userId,
    mutate,
  };
};

export const CommentContext = createContext<CommentHook>(initialComment);

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
