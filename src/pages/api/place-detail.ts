import { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ message: 'placeId is required' });
  }

  const fields = [
    "photos",
    "formatted_address",
    "name",
    "rating",
  ].join(",");

  const apiKey = process.env.PLACE_API_KEY; // 환경 변수에 API 키 저장

  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=${fields}&language=ko&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching place details' });
  }
}
