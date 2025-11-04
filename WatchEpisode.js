import { config } from 'dotenv';
config();

const query = `
mutation WatchEpisode($animeId: Int, $episode: Int) {
  SaveMediaListEntry(mediaId: $animeId, progress: $episode) {
    media {
      title {
        english(stylised: true)
      }
    },
    progress,
    status
  }
}
`;

export async function watchEpisode(animeId, episode) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query,
      variables: {
        animeId,
        episode
      }
    })
  });
  if (!response.ok) {
    return { success: false, status: response.status, message: 'Error updating episode progress.' };
  }

  const data = await response.json();
  return { success: true, data: data.data.SaveMediaListEntry };
}