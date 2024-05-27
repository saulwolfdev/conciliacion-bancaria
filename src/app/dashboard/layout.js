import HomeLayout from "../ui/dashboard/sidebar/layoutsb";

export default function Home({children}) {
  return (
    
      <HomeLayout>
        {/* Contenido existente del componente Home */}
          <h1>{children}</h1>
        {/* ... */}
      </HomeLayout>
  );
}