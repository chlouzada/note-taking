import { trpc } from "../../utils/trpc";

export const NotesView = () => {
  const { data } = trpc.notebook.list.useQuery();
  return (
    <div className="w-1/2 bg-gray-200">Notes {data?.map((d) => <p>{d.title}</p>)}</div>
  );
};

export const CategoryView = () => {
  return <div className="w-1/2 bg-blue-200">Categories</div>;
};

export const Navigation = () => {
  return (
    <div className="flex w-[42rem]">
      <CategoryView />
      <NotesView />
    </div>
  );
};
