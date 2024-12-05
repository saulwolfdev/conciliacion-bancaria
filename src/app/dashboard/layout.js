import HomeLayout from "../ui/dashboard/sidebar/layoutsb";

export default function Home({children}) {
  return (
    
      <HomeLayout>
          <h1>{children}</h1>
      </HomeLayout>
  );
}