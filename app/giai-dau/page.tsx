import HomePage from "../page";

export const revalidate = 60;

/** /giai-dau is the tournaments section of the home page; /giai-dau/[slug] stays the detail page. */
export default async function TournamentsSectionPage() {
  return HomePage();
}
