import CharacterDetails from "@/components/CharacterDetails";

export default function CharacterPage({ params }) {
  return <CharacterDetails id={params.id} />;
}
