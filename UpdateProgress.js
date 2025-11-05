import { config } from 'dotenv';
config();

const query = `
mutation UpdateProgress($mediaId: Int, $prgrss: Int) {
  SaveMediaListEntry(mediaId: $mediaId, progress: $prgrss) {
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

export async function updateProgress(mediaId, prgrss) {
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
        mediaId,
        prgrss
      }
    })
  });
  if (!response.ok) {
    return { success: false, status: response.status, message: 'Error updating progress.' };
  }

  const data = await response.json();
  return { success: true, data: data.data.SaveMediaListEntry };
}