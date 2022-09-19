export const NotesView = () => {
  return <div className="w-1/2 bg-gray-200">Notes</div>;
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
