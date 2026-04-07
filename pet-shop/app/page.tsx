type Props = {
  title: string;
};

const Component = ({}: Props) => {
  return (
    <div>
      <h2>components</h2>
    </div>
  );
};
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
