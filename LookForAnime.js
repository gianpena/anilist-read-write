const query = `
query LookForAnime($name: String) {
  Media(search: $name, type: ANIME) {
    id
  }
}
`;

export async function lookForAnime(name) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { name },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching anime: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.Media ? data.data.Media.id : null;
};