// import { MutableRefObject, Dispatch, SetStateAction } from "react";
// import { usePathname } from 'next/navigation';
// import axios from "axios";
// import { getFetchUrl } from '@util/fetch';

// export default function Info({
//   author,
//   content,
//   createdAt,
//   inputText,
//   setMode,
//   setInputText,
//   onClickCancel,
//   fetchData,
// }: {
//   author: string,
//   content: MutableRefObject<string>,
//   createdAt: string,
//   inputText: string,
//   setMode: Dispatch<SetStateAction<"read" | "modify" | "recomment">>,
//   setInputText: Dispatch<SetStateAction<string>>,
//   onClickCancel: () => void,
//   fetchData: () => Promise<void>,
// }) {
//   const pathname = usePathname();
//   const fetchUrl = getFetchUrl(`${pathname}/comment`);

//   const onSubmitModify = async () => {
//     if (content.current === inputText) {
//       setMode('read');
//       return;
//     }
//     try {
//       const res = await axios.put(fetchUrl, {
//         id,
//         content: inputText,
//       });
//       content.current = res.data.content;
//       setInputText(res.data.content);
//       setMode('read');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const onClickDelete = async () => {
//     try {
//       await axios.delete(`${fetchUrl}/${id}`);
//       await fetchData();
//       setMode('read');
//     } catch (err) {}
//   };

//   const createButton = (authorId: number) => {
//     return {
//       read: (
//         <Read
//           parentId={parentId}
//           authorId={authorId}
//           setMode={setMode}
//           onClickDelete={onClickDelete}
//         />
//       ),
//       modify: <Modify onSubmit={onSubmitModify} onClickCancel={onClickCancel} />,
//       recomment: <span>...</span>,
//     };
//   };
//   return (
//     <div className='w-full flex justify-between'>
//       <div>{author}</div>
//       <div>
//         <div>{createdAt}</div>
//         <div>{createButton(authorId)[mode]}</div>
//       </div>
//     </div>
//   );
// }
