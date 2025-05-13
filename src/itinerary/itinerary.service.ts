import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;

  constructor() {
    // Get API key from https://makersuite.google.com/app/apikey
    this.genAI = new GoogleGenerativeAI('AIzaSyBE1S3ZKSpiJCEnb_TKDKBucj7hg1Q6rgg'); // Free API key
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',  // Updated to match the working example
      generationConfig: {
        temperature: 0.7,
      }
    });
    this.logger.log('Gemini API initialized successfully'); // Log initialization
  }

  async generateItinerary(
    budget: number,
    location: string,
    numberOfDays: number,
  ) {
    try {
      this.logger.log(`Starting itinerary generation for: ${location}`);
      
      const prompt = `Create a ${numberOfDays}-day itinerary for ${location} with a budget of ${budget}. Include daily activities, estimated costs, and suggested places to eat.`;
      this.logger.log(`Generated prompt: ${prompt}`);

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      this.logger.log('Received response from Gemini');
      return result.response.text();
    } catch (error) {
      this.logger.error('Error in generateItinerary:', error.stack);
      throw error;
    }
  }
} 