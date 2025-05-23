import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { createApi } from 'unsplash-js';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly unsplash: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
      },
    });

    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashAccessKey) {
      throw new Error(
        'UNSPLASH_ACCESS_KEY is not defined in environment variables',
      );
    }
    this.unsplash = createApi({
      accessKey: unsplashAccessKey,
    });

    this.logger.log('Gemini API and Unsplash API initialized successfully');
  }

  async generateItinerary(
    budget: number,
    location: string,
    numberOfDays: number,
  ) {
    try {
      this.logger.log(`Starting itinerary generation for: ${location}`);

      // Get country photo first
      const photoResult = await this.getCountryPhotos(location);
      const countryImage = photoResult.photo.url;

      const prompt = `
Generate a ${numberOfDays}-day travel itinerary for ${location}. Include:
- A summary title and description
- A day-by-day itinerary with:
  - Day number
  - Title
  - Hotel, transport, and activities with cost estimates
- A total daily cost
- A cost breakdown table
- A list of POIs (for map rendering) with coordinates if available

Return the result strictly in JSON with this structure:

{
  "title": "${location}",
  "location": "Spain",
  "description": "You love the coastal towns and local food—this place is both!",
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Old Town Stroll",
      "activities": [
        { "label": "Hotel Check-in at Zaragoza Plaza", "cost": "$170/night" },
        { "label": "Explore Parte Vieja (Old Town)", "cost": "Free" },
        { "label": "Transport: Uber from airport", "cost": "$20" }
      ],
      "totalCost": "$250"
    },
    ...
  ],
  "costOverview": [
    { "day": "Day 1", "description": "Hotel, Food, Transport", "total": "$250" },
    ...
  ],
  "mapPoints": [
    { "name": "Hotel Zaragoza Plaza", "lat": 43.318, "lng": -1.981 },
    { "name": "Parte Vieja", "lat": 43.324, "lng": -1.984 }
  ]
}

Budget: $${budget}
Please only return valid JSON in your response.`;

      this.logger.log(`Generated prompt: ${prompt}`);

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      this.logger.log('Received response from Gemini');
      let text = result.response.text();
      // Remove triple backticks and optional 'json' after them
      text = text.replace(/```(?:json)?|```/gi, '').trim();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        this.logger.error('AI did not return valid JSON:', text);
        throw new Error('AI did not return valid JSON');
      }

      // Basic validation
      if (
        typeof data !== 'object' ||
        !data.title ||
        !data.location ||
        !data.description ||
        !Array.isArray(data.itinerary) ||
        !Array.isArray(data.costOverview) ||
        !Array.isArray(data.mapPoints)
      ) {
        this.logger.error('AI response missing required fields:', data);
        throw new Error('AI response missing required fields');
      }

      // Validate structure of itinerary items
      for (const item of data.itinerary) {
        if (
          typeof item.day !== 'number' ||
          typeof item.title !== 'string' ||
          !Array.isArray(item.activities) ||
          typeof item.totalCost !== 'string'
        ) {
          this.logger.error('Invalid itinerary item:', item);
          throw new Error('Invalid itinerary item structure');
        }
      }

      // Add the image URL to the response
      return {
        image: countryImage,
        ...data,
      };
    } catch (error) {
      this.logger.error('Error in generateItinerary:', error.stack);
      throw error;
    }
  }

  async getCountryPhotos(country: string) {
    try {
      this.logger.log(`Fetching photo for: ${country}`);

      const result = await this.unsplash.search.getPhotos({
        query: `${country}`,
        perPage: 1,
        // orientation: 'landscape',
        contentFilter: 'high',
        orderBy: 'relevant',
      });

      if (result.errors) {
        this.logger.error('Unsplash API error:', result.errors);
        throw new Error('Failed to fetch photo from Unsplash');
      }

      if (!result.response.results.length) {
        throw new Error(`No photos found for ${country}`);
      }

      const photo = result.response.results[0];
      return {
        country,
        photo: {
          id: photo.id,
          url: photo.urls.regular,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || `${country} landscape photo`,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          location: photo.location?.title || country,
        },
      };
    } catch (error) {
      this.logger.error('Error in getCountryPhotos:', error.stack);
      throw error;
    }
  }
}
