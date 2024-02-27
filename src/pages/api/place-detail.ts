import { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { placeName } = req.query;

  if (!placeName) {
    return res.status(400).json({ message: 'placeId is required' });
  }

  const fields = [
    "photos",
    "formatted_address",
    "name",
    "rating",
  ].join(",");

  const apiKey = process.env.PLACE_API_KEY; // 환경 변수에 API 키 저장

  // const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeName}&fields=${fields}&language=ko&key=${apiKey}`;
    const apiUrl = `  https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${placeName}&inputtype=textquery&language=ko&key=${apiKey}
    `;

    try {
      const searchApiResponse = await fetch(apiUrl);
      const searchData = await searchApiResponse.json();
  
      // 검색 결과에서 모든 장소의 place_id 추출
      const placeIds = searchData.candidates.map((candidate: { place_id: any; }) => candidate.place_id);
  
      // 각 place_id에 대해 Place 세부 정보 API 호출
      const placeDetailsPromises = placeIds.map(async (placeId: any) => {
        const detailsApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&language=ko&key=${apiKey}`;
        const detailsApiResponse = await fetch(detailsApiUrl);
        return detailsApiResponse.json();
      });
  
      // 모든 Place 세부 정보를 기다림
      const placeDetails = await Promise.all(placeDetailsPromises);
  
      res.json(placeDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching place details' });
    }
  }