const query = `
query CurrentlyReading($pg: Int) {
  Page(page: $pg, perPage: 20) {
    mediaList(userName: "gian", type: MANGA, status: CURRENT) {
      status,
      media {
        id,
        title {
          english(stylised: true)
        }
      },
      progress
    }
  }
}
`;

export async function getCurrentlyReading(pg = 1) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        pg
      }
    })
  });
  if (!response.ok) {
    return { success: false, status: response.status, message: 'Error fetching currently reading list.' };
  }

  const data = await response.json();
  return { success: true, reading: data.data.Page.mediaList };
}