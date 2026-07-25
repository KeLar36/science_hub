import { Table } from "@/shared/ui/Table";
import { PostRow } from "./PostRow";

export function PostTable({ posts, onEdit, onDelete, onPublish }) {
  const tableHeaders = ["Назва статті", "Автор", "Дата", "Статус", "Дії"];

  return (
    <Table headers={tableHeaders}>
      {posts.map((post) => (
        <PostRow
          key={post._id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </Table>
  );
}
