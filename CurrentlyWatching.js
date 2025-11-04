const query = `
query CurrentlyWatching($pg: Int) {
  Page(page: $pg, perPage: 20) {
    mediaList(userName: "gian", type: ANIME, status: CURRENT) {
      status,
      media {
        id,
        title {
          english(stylised: true)
        },
        nextAiringEpisode {
          airingAt,
          episode,
          timeUntilAiring
        }
      },
      progress
    }
  }
}
`;

export async function getCurrentlyWatching(pg = 1) {
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
    return { success: false, status: response.status, message: 'Error fetching currently watching list.' };
  }
  
  const data = await response.json();
  return { success: true, watching: data.data.Page.mediaList };
}