import { trpc } from "../../utils/trpc";

export const NotesView = () => {
  const { data } = trpc.notebook.list.useQuery();
  return (
    <div className="w-1/2 bg-gray-200">
      Notes{" "}
      {data?.map((d) => (
        <p>{d.title}</p>
      ))}
    </div>
  );
};

export const CategoryView = () => {
  return <div className="w-1/2 bg-blue-200">Categories</div>;
};

export const Navigation = () => {
  return (
    <div className="col-start-1 col-end-3">
      <div className="flex h-full">
        <CategoryView />
        <NotesView />
      </div>
    </div>
  );
};
